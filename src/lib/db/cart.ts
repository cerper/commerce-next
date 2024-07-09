"use server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOption } from "../authOptions";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { Items: { include: { product: true } } };
}>;

export type CartItemsWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};
//obteniendo el carrito si el usuario no esta registrado

export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOption);
  let cart: CartWithProducts | null;
  if (session) {
    cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { Items: { include: { product: true } } },
    });
  } else {
    const localCardId = cookies().get("localCardId")?.value;
    cart = localCardId
      ? await prisma.cart.findUnique({
          where: { id: localCardId },
          include: { Items: { include: { product: true } } },
        })
      : null;
  }

  if (!cart) {
    return null;
  }
  return {
    ...cart,
    size: cart.Items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.Items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
  };
}
//creando el carrito
export async function createCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOption);

  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      data: { userId: session.user.id },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });

    //Needs encryption + secure settings in real production app
    cookies().set("localCardId", newCart.id);
  }
  return {
    ...newCart,
    Items: [],
    size: 0,
    subtotal: 0,
  };
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCardId = cookies().get("localCardId")?.value;
  const localCart = localCardId
    ? await prisma.cart.findUnique({
        where: { id: localCardId },
        include: { Items: true },
      })
    : null;
  if (!localCart) {
    return;
  }

  const userCart = await prisma.cart.findFirst({
    where: { userId: userId },
    include: { Items: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = await mergeCartItems(
        localCart.Items,
        userCart.Items,
      );

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cartItem.createMany({
        data: mergedCartItems.map((item) => ({
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          Items: {
            createMany: {
              data: localCart.Items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }
    await tx.cart.delete({
      where: { id: localCart.id },
    });
    cookies().set("localCardId", "");
  });
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}
