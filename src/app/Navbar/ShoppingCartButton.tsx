"use client";
import { ShoppingCart } from "@/lib/db/cart";
import { FormaPrice } from "@/lib/db/format";
import Link from "next/link";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

export default function ShoppingCartButton({ cart }: ShoppingCartButtonProps) {
  function closeDropdown() {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  }
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-circle btn-ghost ">
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm1.336-5l1.977-7h-16.813l2.938 7h11.898zm4.969-10l-3.432 12h-12.597l.839 2h13.239l3.474-12h1.929l.743-2h-4.195z" />
          </svg>
          <span className="badge indicator-item badge-sm">
            {cart?.size || 0}
          </span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact z-30 mt-4 w-52 bg-base-100 shadow"
      >
        <div className="card-body">
          <span className="text-lg font-bold ">{cart?.size || 0} Items</span>
          <span className="capitalize text-info">
            subtotal: {FormaPrice(cart?.subtotal || 0)}
          </span>
          <div className="card-actions">
            <Link
              href={"/cart"}
              className="btn btn-primary btn-block capitalize"
              onClick={closeDropdown}
            >
              view cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
