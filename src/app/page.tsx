import PaginationBar from "@/components/PaginationBar";
import PriceTag from "@/components/PriceTag";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

interface HomeProps {
  searchParams: { page: string };
}

export default async function Home({
  searchParams: { page = "1" },
}: HomeProps) {
  const currentPage = parseInt(page);
  const pageSize = 6;
  const heroItemCount = 1;

  const totalItemCount = await prisma.product.count();

  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="min-w[30vh] lg:min-w-[70vh]  ">
        {currentPage === 1 && (
          <div className="hero rounded-xl bg-base-200">
            <div className="hero-content  flex-col items-center justify-center lg:flex-row">
              <Image
                priority
                src={products[0].imageURL}
                alt={products[0].name}
                width={350}
                height={800}
                className="aspect-square  max-h-[80vh] w-full  rounded-lg shadow-2xl lg:h-[60vh] "
              />
              <div>
                <h1 className=" text-center text-3xl font-bold">
                  {products[0].name}
                </h1>
                <p className="ml-8 py-3 text-justify text-lg">
                  {products[0].description}
                </p>
                <div>
                  <Link
                    href={"/products/" + products[0].id}
                    className="btn btn-primary ml-8"
                  >
                    Check it out
                  </Link>
                </div>
                <PriceTag
                  className="ml-8 text-base font-semibold underline"
                  price={products[0].price}
                />
              </div>
            </div>
          </div>
        )}

        <div className="my-4 grid grid-cols-1 gap-4  md:grid-cols-2  xl:grid-cols-3">
          {(currentPage === 1 ? products.slice(1) : products).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        <div className="flex items-center justify-center">
          {totalPages > 1 && (
            <PaginationBar currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>
      </div>
    </div>
  );
}
