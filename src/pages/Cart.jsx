import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { user } = useAuth();
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const shipping = items.length ? 6.99 : 0;
  const total = subtotal + shipping;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-ink/20 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-900">
              <ShoppingBag className="mx-auto h-10 w-10 text-sage" />
              <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
              <Link to="/shop" className="btn-primary mt-6">
                Browse books
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:grid-cols-[6rem_1fr_auto]">
                <img src={item.cover} alt={`${item.title} cover`} className="h-28 w-24 rounded-md object-cover" />
                <div>
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="mt-1 text-sm text-ink/60 dark:text-zinc-400">{item.author}</p>
                  <p className="mt-2 text-sm font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-md border border-ink/10 dark:border-white/10">
                    <button className="grid h-9 w-9 place-items-center" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                      <Minus className="h-4 w-4" />
                    </button>
                    <input className="h-9 w-12 bg-transparent text-center text-sm font-bold outline-none" value={item.quantity} onChange={(event) => updateQuantity(item.id, event.target.value)} />
                    <button className="grid h-9 w-9 place-items-center" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="btn-secondary px-3 py-2 text-oxblood" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-bold">Checkout Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <strong>${shipping.toFixed(2)}</strong>
            </div>
            <div className="border-t border-ink/10 pt-3 dark:border-white/10">
              <div className="flex justify-between text-lg">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
          {!user && items.length > 0 && (
            <p className="mt-5 rounded-md bg-brass/10 px-3 py-2 text-sm font-semibold text-brass">
              Please login before completing your purchase.
            </p>
          )}
          <Link
            to={user ? '/checkout' : '/login'}
            state={user ? undefined : { from: '/checkout', role: 'user' }}
            className={`btn-primary mt-6 w-full ${items.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            {user ? 'Continue to checkout' : 'Login to checkout'}
          </Link>
        </aside>
      </div>
    </section>
  );
}
