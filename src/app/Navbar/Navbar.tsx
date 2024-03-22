import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";
import { redirect } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";
import { getCart } from "@/lib/db/cart";
async function searchProducts(formData: FormData) {
  const searchQuery = await formData.get("searchQuery")?.toString();

  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

export default async function Navbar() {
  const cart = await getCart();
  return (
    <div className="bg-base-100">
      <div className="navbar m-auto max-w-7xl flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl normal-case">
            <Image src={logo} alt="Logo Flowmazon" height={40} width={40} />
            Flowmazon
          </Link>
        </div>
        <div className="flex-none gap-2">
          <form>
            <div className="form-control ">
              <input
                type="text"
                name="searchQuery"
                placeholder="Search"
                className="input input-bordered w-full min-w-[100px]"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
        </div>
      </div>
    </div>
  );
}
