import { ArrowRight, BadgeCheck, BookOpenCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import SectionHeader from '../components/SectionHeader';
import { useBooks } from '../context/BookContext';

export default function Home() {
  const { books, categories } = useBooks();
  const featured = books.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1800&q=85"
            alt="Warm modern bookstore interior"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/62 to-ink/20" />
        </div>
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl content-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brass">Modern bookstore platform</p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">Chapterly</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/82">
              Browse thoughtful fiction, sharp business writing, practical technology guides, and beautifully chosen books for curious readers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary bg-white text-ink hover:bg-brass hover:text-white">
                Shop collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary border-white/30 bg-white/10 text-white hover:border-white hover:text-white">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: BookOpenCheck, title: 'Curated catalog', text: 'High-signal reads across six practical categories.' },
            { icon: Truck, title: 'Fast fulfillment', text: 'Mock checkout flow with shipping capture and payment confirmation.' },
            { icon: BadgeCheck, title: 'Admin ready', text: 'Protected dashboard for stock, pricing, books, orders, and categories.' }
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <item.icon className="h-7 w-7 text-sage" />
              <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/65 dark:text-zinc-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Featured shelves"
            title="Books readers keep recommending"
            description="A responsive catalog experience with search, category filters, detail pages, stock labels, and polished cart actions."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`} className="rounded-full border border-ink/10 bg-white px-5 py-2 text-sm font-semibold shadow-sm transition hover:border-sage hover:text-sage dark:border-white/10 dark:bg-zinc-900">
              {category}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
