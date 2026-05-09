import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadStorage, saveStorage } from '../utils/storage';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadStorage('chapterly-cart', []));

  useEffect(() => {
    saveStorage('chapterly-cart', items);
  }, [items]);

  function addToCart(book, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.id === book.id);
      if (existing) {
        return current.map((item) =>
          item.id === book.id ? { ...item, quantity: Math.min(item.quantity + quantity, book.stock || 1) } : item
        );
      }
      return [...current, { ...book, quantity }];
    });
  }

  function removeItem(bookId) {
    setItems((current) => current.filter((item) => item.id !== bookId));
  }

  function updateQuantity(bookId, quantity) {
    setItems((current) =>
      current
        .map((item) => (item.id === bookId ? { ...item, quantity: Math.max(1, Math.min(Number(quantity), item.stock || 1)) } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({ items, subtotal, itemCount, addToCart, removeItem, updateQuantity, clearCart }),
    [items, subtotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
