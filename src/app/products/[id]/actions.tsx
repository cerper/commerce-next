"use server";
import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export default async function incrementProductQuantity(productId: string) {
  const cart = (await getCart()) ?? (await createCart());
  const articleCheck = cart.Items.find((item) => item.productId === productId);
  if (articleCheck) {
    await prisma.cartItem.update({
      where: { id: articleCheck.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/products/[id]");
}
