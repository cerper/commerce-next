"use client";
import { CartItemsWithProduct } from "@/lib/db/cart";
import Image from "next/image";
import Link from "next/link";
import { FormaPrice } from "@/lib/db/format";
import { useTransition } from "react";

interface CartEntryProps {
  cartItem: CartItemsWithProduct;
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryProps) {
  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>,
    );
  }

  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Image
          src={product.imageURL}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>
      <div>
        <Link href={"/products/" + product.id} className="btn btn-ghost mt-4">
          {product.name}
        </Link>
        <div>Price: {FormaPrice(product.price)}</div>
        <div className="my'1 flex items-center gap-2">
          Quantity:
          <select
            className="select select-bordered mt-4 w-full max-w-[80px]"
            defaultValue={quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.currentTarget.value);
              startTransition(async () => {
                await setProductQuantity(product.id, newQuantity);
              });
            }}
          >
            <option value={0}>0 (Remove)</option>
            {quantityOptions}
          </select>
        </div>

        <div className="mt-4">
          Total: {FormaPrice(product.price * quantity)}
          {isPending && <span className="loading loading-spinner loading-sm" />}
        </div>
      </div>
      <div className="divider" />
    </div>
  );
}
