import { ArrowLeft, CheckCircle2, ShoppingCart, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function BookDetail() {
  const { id } = useParams();
  const { books } = useBooks();
  const { addToCart } = useCart();
  const { pushToast } = useToast();
  const book = books.find((item) => item.id === id);

  if (!book) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-4xl font-bold">Book not found</h1>
        <Link to="/shop" className="btn-primary mt-6">
          Back to shop
        </Link>
      </section>
    );
  }

  function handleAdd() {
    addToCart(book);
    pushToast(`${book.title} added to cart.`);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-sage">
        <ArrowLeft className="h-4 w-4" />
        Back to shop
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft dark:border-white/10 dark:bg-zinc-900">
          <img src={book.cover} alt={`${book.title} cover`} className="h-[34rem] w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage">{book.category}</p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">{book.title}</h1>
          <p className="mt-3 text-lg text-ink/65 dark:text-zinc-300">by {book.author}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 rounded-md bg-brass/10 px-3 py-1.5 text-sm font-bold text-brass">
              <Star className="h-4 w-4 fill-current" />
              {book.rating} rating
            </span>
            <span className="flex items-center gap-2 rounded-md bg-sage/10 px-3 py-1.5 text-sm font-bold text-sage">
              <CheckCircle2 className="h-4 w-4" />
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <p className="mt-8 text-base leading-8 text-ink/75 dark:text-zinc-300">{book.description}</p>
          <div className="mt-8 rounded-lg border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
            <h2 className="text-lg font-bold">About the author</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65 dark:text-zinc-400">{book.authorBio}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-3xl font-extrabold">${book.price.toFixed(2)}</span>
            <button className="btn-primary" onClick={handleAdd} disabled={book.stock <= 0}>
              <ShoppingCart className="h-4 w-4" />
              {book.stock > 0 ? 'Add to Cart' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
