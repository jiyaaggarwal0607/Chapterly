import { createContext, useContext, useMemo, useState } from 'react';
import { initialBooks, categories as defaultCategories, mockOrders } from '../data/books';
import { loadStorage, saveStorage } from '../utils/storage';

const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState(() => loadStorage('chapterly-books', initialBooks));
  const [categories, setCategories] = useState(() => loadStorage('chapterly-categories', defaultCategories));

  function persistBooks(nextBooks) {
    setBooks(nextBooks);
    saveStorage('chapterly-books', nextBooks);
  }

  function persistCategories(nextCategories) {
    setCategories(nextCategories);
    saveStorage('chapterly-categories', nextCategories);
  }

  function addBook(book) {
    persistBooks([{ ...book, id: `bk-${Date.now()}`, rating: Number(book.rating || 4.5) }, ...books]);
  }

  function updateBook(bookId, updates) {
    persistBooks(books.map((book) => (book.id === bookId ? { ...book, ...updates } : book)));
  }

  function deleteBook(bookId) {
    persistBooks(books.filter((book) => book.id !== bookId));
  }

  function addCategory(category) {
    const trimmed = category.trim();
    if (trimmed && !categories.includes(trimmed)) {
      persistCategories([...categories, trimmed]);
    }
  }

  function deleteCategory(category) {
    persistCategories(categories.filter((item) => item !== category));
  }

  const value = useMemo(
    () => ({
      books,
      categories,
      orders: mockOrders,
      addBook,
      updateBook,
      deleteBook,
      addCategory,
      deleteCategory
    }),
    [books, categories]
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBooks() {
  return useContext(BookContext);
}
