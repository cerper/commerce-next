import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import PriceTag from "./PriceTag";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;
  return (
    <div className="card w-full  bg-base-100 transition-shadow hover:shadow-xl">
      <figure>
        <Image
          src={product.imageURL}
          alt={product.name}
          width={500}
          height={400}
          className=" aspect-square h-auto max-h-[250px] min-w-[200px] rounded-xl object-cover object-center"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          {isNew && <div className=" badge badge-secondary">NEW</div>}
        </h2>
        <p className="text-justify text-base ">{product.description}</p>

        <Link href={"/products/" + product.id} className="btn btn-primary">
          Check it out
        </Link>
        <PriceTag
          className="text-base font-semibold underline"
          price={product.price}
        />
      </div>
    </div>
  );
}
