import { BarChart3, Edit3, PackagePlus, Plus, Save, Tags, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useBooks } from '../context/BookContext';
import { useToast } from '../context/ToastContext';

const blankBook = {
  title: '',
  author: '',
  category: 'Fiction',
  price: 19.99,
  stock: 10,
  rating: 4.5,
  cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=80',
  shortDescription: '',
  description: '',
  authorBio: ''
};

export default function AdminDashboard() {
  const { books, categories, orders, addBook, updateBook, deleteBook, addCategory, deleteCategory } = useBooks();
  const { pushToast } = useToast();
  const [bookForm, setBookForm] = useState(blankBook);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState('');

  const stats = useMemo(
    () => [
      { label: 'Books', value: books.length },
      { label: 'Categories', value: categories.length },
      { label: 'Inventory', value: books.reduce((sum, book) => sum + Number(book.stock), 0) },
      { label: 'Orders', value: orders.length }
    ],
    [books, categories, orders]
  );

  function changeField(event) {
    const { name, value } = event.target;
    setBookForm({
      ...bookForm,
      [name]: ['price', 'stock', 'rating'].includes(name) ? Number(value) : value
    });
  }

  function submitBook(event) {
    event.preventDefault();
    if (editingId) {
      updateBook(editingId, bookForm);
      pushToast('Book updated.');
    } else {
      addBook(bookForm);
      pushToast('Book added to catalog.');
    }
    setBookForm({ ...blankBook, category: categories[0] || 'Fiction' });
    setEditingId(null);
  }

  function startEdit(book) {
    setEditingId(book.id);
    setBookForm(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function submitCategory(event) {
    event.preventDefault();
    addCategory(newCategory);
    setNewCategory('');
    pushToast('Category list updated.', 'info');
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage">Protected admin</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-sage/20 bg-sage/10 px-4 py-3 text-sm font-bold text-sage">
          <BarChart3 className="h-4 w-4" />
          Live mock operations
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <p className="text-sm text-ink/55 dark:text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900" onSubmit={submitBook}>
          <div className="flex items-center gap-3">
            <PackagePlus className="h-6 w-6 text-sage" />
            <h2 className="text-xl font-bold">{editingId ? 'Edit Book' : 'Add Book'}</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input className="input" name="title" value={bookForm.title} onChange={changeField} placeholder="Title" required />
            <input className="input" name="author" value={bookForm.author} onChange={changeField} placeholder="Author" required />
            <select className="input" name="category" value={bookForm.category} onChange={changeField}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <input className="input" name="cover" value={bookForm.cover} onChange={changeField} placeholder="Cover image URL" required />
            <input className="input" name="price" type="number" min="0" step="0.01" value={bookForm.price} onChange={changeField} placeholder="Price" required />
            <input className="input" name="stock" type="number" min="0" value={bookForm.stock} onChange={changeField} placeholder="Stock" required />
            <input className="input" name="rating" type="number" min="1" max="5" step="0.1" value={bookForm.rating} onChange={changeField} placeholder="Rating" />
            <input className="input" name="shortDescription" value={bookForm.shortDescription} onChange={changeField} placeholder="Short description" required />
            <textarea className="input min-h-28 sm:col-span-2" name="description" value={bookForm.description} onChange={changeField} placeholder="Full description" required />
            <textarea className="input min-h-24 sm:col-span-2" name="authorBio" value={bookForm.authorBio} onChange={changeField} placeholder="Author bio" required />
          </div>
          <div className="mt-5 flex gap-3">
            <button className="btn-primary" type="submit">
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? 'Save changes' : 'Add book'}
            </button>
            {editingId && (
              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setBookForm(blankBook);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-bold">Catalog Management</h2>
          <div className="mt-5 max-h-[38rem] space-y-3 overflow-auto pr-1">
            {books.map((book) => (
              <div key={book.id} className="grid gap-3 rounded-lg border border-ink/10 p-3 dark:border-white/10 sm:grid-cols-[4rem_1fr_auto]">
                <img src={book.cover} alt={`${book.title} cover`} className="h-20 w-16 rounded object-cover" />
                <div>
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-sm text-ink/60 dark:text-zinc-400">{book.category} by {book.author}</p>
                  <p className="mt-1 text-sm font-semibold">${Number(book.price).toFixed(2)} · Stock {book.stock}</p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col">
                  <button className="btn-secondary h-10 w-10 p-0" onClick={() => startEdit(book)} aria-label="Edit book">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="btn-secondary h-10 w-10 p-0 text-oxblood" onClick={() => deleteBook(book.id)} aria-label="Delete book">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <Tags className="h-6 w-6 text-sage" />
            <h2 className="text-xl font-bold">Categories</h2>
          </div>
          <form className="mt-5 flex gap-2" onSubmit={submitCategory}>
            <input className="input" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="New category" />
            <button className="btn-primary" type="submit">
              Add
            </button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category} className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-2 text-sm font-semibold dark:bg-white/5">
                {category}
                <button onClick={() => deleteCategory(category)} aria-label={`Delete ${category}`}>
                  <Trash2 className="h-3.5 w-3.5 text-oxblood" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <div className="mt-5 overflow-hidden rounded-lg border border-ink/10 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink/5 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-ink/10 dark:border-white/10">
                    <td className="px-4 py-3 font-bold">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3 text-right font-bold">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
