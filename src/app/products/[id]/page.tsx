"use server";
import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import AddCartButton from "./AddCartButton";
import incrementProductQuantity from "./actions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) notFound();
  return product;
});

export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);

  return {
    title: product.name + "- Flowmazon",
    description: product.description,
    openGraph: {
      images: [{ url: product.imageURL }],
    },
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await getProduct(id);
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Image
        src={product.imageURL}
        alt={product.name}
        width={600}
        height={400}
        className=" mx-auto mb-8 h-auto max-h-[300px] min-w-[400px] rounded-xl object-cover object-center"
        priority
      />
      <h1 className="mb-8 text-3xl font-semibold">{product?.name}</h1>
      <PriceTag
        price={product.price}
        className="mb-4 p-4 text-lg font-extrabold underline"
      />
      <p className="text-center text-xl font-medium">{product.description}</p>

      <AddCartButton
        incrementProductQuantity={incrementProductQuantity}
        productId={product.id}
      />
    </div>
  );
}
