import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { pushToast } = useToast();
  const outOfStock = book.stock <= 0;

  function handleAdd() {
    addToCart(book);
    pushToast(`${book.title} added to cart.`);
  }

  return (
    <article className="group grid overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-zinc-900">
      <Link to={`/books/${book.id}`} className="block bg-zinc-100 dark:bg-zinc-800">
        <img src={book.cover} alt={`${book.title} cover`} className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
      </Link>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage">{book.category}</p>
            <Link to={`/books/${book.id}`} className="mt-2 block text-lg font-bold leading-tight hover:text-oxblood dark:hover:text-brass">
              {book.title}
            </Link>
            <p className="mt-1 text-sm text-ink/60 dark:text-zinc-400">{book.author}</p>
          </div>
          <span className="flex items-center gap-1 rounded-md bg-brass/10 px-2 py-1 text-xs font-bold text-brass">
            <Star className="h-3.5 w-3.5 fill-current" />
            {book.rating}
          </span>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-ink/70 dark:text-zinc-300">{book.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-xl font-extrabold">${book.price.toFixed(2)}</span>
          <button className="btn-primary px-3" onClick={handleAdd} disabled={outOfStock}>
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
