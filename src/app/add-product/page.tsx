import FormSubmitBotton from "@/components/FormSubmitBotton";
import { prisma } from "@/lib/db/prisma";

import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOption } from "../api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Add Product - Flowmazon",
};

async function AddProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOption);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageURL = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageURL || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, description, imageURL, price },
  });
  redirect("/");
}

export default async function AddProductPage() {
  const session = await getServerSession(authOption);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  return (
    <div className="flex w-[150vh] flex-col items-center justify-center py-6">
      <h1 className="mb-3 text-4xl font-bold capitalize">add product</h1>
      <form
        className="mt-4 flex w-full flex-col items-center justify-center py-4"
        action={AddProduct}
      >
        <input
          type="text"
          placeholder="Name"
          required
          name="name"
          className=" input input-bordered mb-5 w-full  "
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="textarea textarea-bordered mb-5 w-full py-10 "
        ></textarea>
        <input
          type="url"
          placeholder="Image URL"
          required
          name="imageUrl"
          className=" input input-bordered mb-5 w-full "
        />
        <input
          type="number"
          placeholder="Price"
          required
          name="price"
          className=" input input-bordered mb-5 w-full  "
        />
        <FormSubmitBotton className=" btn-block">Add Product</FormSubmitBotton>
      </form>
    </div>
  );
}
