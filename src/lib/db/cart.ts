"use server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Cart, Prisma } from "@prisma/client";

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
  const localCardId = cookies().get("localCardId")?.value;
  const cart = localCardId
    ? await prisma.cart.findUnique({
        where: { id: localCardId },
        include: { Items: { include: { product: true } } },
      })
    : null;

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
  const newCart = await prisma.cart.create({
    data: {},
  });

  //Needs encryption + secure settings in real production app
  cookies().set("localCardId", newCart.id);
  return {
    ...newCart,
    Items: [],
    size: 0,
    subtotal: 0,
  };
}
