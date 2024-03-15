import { prisma } from "@/lib/db/prisma";

import { NextRequest, NextResponse } from "next/server";

type Product = {
  name: string;
  description: string;
  imageURL: string;
  price: number;
};

export async function POST(request: NextRequest) {
  try {
    const reqBody: Product = await request.json();
    const { name, imageURL, description, price } = reqBody;
    console.log(reqBody);

    if (!name || !description || !imageURL || !price) {
      return NextResponse.json("You have to fill all the inputs");
    }

    const product = await prisma.product.create({
      data: { name, description, imageURL, price },
    });

    return NextResponse.json({
      message: "Product added succesfully",
      product,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
