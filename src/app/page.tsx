import PriceTag from "@/components/PriceTag";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });
  return (
    <div className="mx-5  min-w-[70vh] ">
      <div className="hero rounded-xl bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            priority
            src={products[0].imageURL}
            alt={products[0].name}
            width={400}
            height={800}
            className="aspect-square  max-h-[80vh] w-full max-w-sm rounded-lg shadow-2xl lg:h-[60vh] "
          />
          <div>
            <h1 className="text-center text-3xl font-bold">
              {products[0].name}
            </h1>
            <p className="py-3 text-justify text-lg">
              {products[0].description}
            </p>
            <div>
              <Link
                href={"/products/" + products[0].id}
                className="btn btn-primary"
              >
                Check it out
              </Link>
            </div>
            <PriceTag
              className="text-base font-semibold underline"
              price={products[0].price}
            />
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 gap-4  md:grid-cols-2  xl:grid-cols-3">
        {products.slice(1).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
