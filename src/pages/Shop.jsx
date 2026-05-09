import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import SectionHeader from '../components/SectionHeader';
import SkeletonGrid from '../components/SkeletonGrid';
import { useBooks } from '../context/BookContext';

export default function Shop() {
  const { books, categories } = useBooks();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory = category === 'All' || book.category === category;
      const normalized = `${book.title} ${book.author} ${book.description}`.toLowerCase();
      return matchesCategory && normalized.includes(query.toLowerCase());
    });
  }, [books, category, query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Shop"
        title="Find your next excellent read"
        description="Filter by category, search by title or author, and add available titles directly to your persistent shopping cart."
      />

      <div className="mt-10 grid gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 lg:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45 dark:text-zinc-400" />
          <input className="input pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books, authors, or descriptions" />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-sage" />
          {['All', ...categories].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                category === item ? 'bg-ink text-white dark:bg-sage' : 'bg-ink/5 text-ink/70 hover:bg-sage/10 hover:text-sage dark:bg-white/5 dark:text-zinc-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <SkeletonGrid />
        ) : filteredBooks.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-ink/20 bg-white p-10 text-center dark:border-white/15 dark:bg-zinc-900">
            <p className="text-lg font-bold">No books found</p>
            <p className="mt-2 text-sm text-ink/60 dark:text-zinc-400">Try a different search or category filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
