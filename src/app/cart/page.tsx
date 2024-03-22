import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";
import { FormaPrice } from "@/lib/db/format";

export const metadata = {
  title: "Shopping Cart - Flowmazon",
};

export default async function CartPage() {
  const cart = await getCart();
  return (
    <div>
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      {cart?.Items.map((cartItem) => (
        <CartEntry
          cartItem={cartItem}
          key={cartItem.id}
          setProductQuantity={setProductQuantity}
        />
      ))}
      {!cart?.Items.length && (
        <p className="mt-5 text-2xl">Your cart is empty</p>
      )}
      <div className="font-semibold underline">
        Total: {FormaPrice(cart?.subtotal || 0)}
      </div>
    </div>
  );
}
