import { Outlet, Link, NavLink } from 'react-router-dom';
import { BookOpen, LogOut, Menu, Moon, ShoppingBag, Sun, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/admin', label: 'Admin' }
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('chapterly-theme') === 'dark');
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { pushToast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('chapterly-theme', dark ? 'dark' : 'light');
  }, [dark]);

  function handleLogout() {
    logout();
    pushToast('Signed out successfully.', 'info');
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-white dark:bg-sage">
              <BookOpen className="h-5 w-5" />
            </span>
            Chapterly
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${isActive ? 'text-oxblood dark:text-brass' : 'text-ink/70 hover:text-ink dark:text-zinc-300 dark:hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="btn-secondary h-10 w-10 p-0" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/cart" className="btn-secondary relative h-10 w-10 p-0" aria-label="Cart">
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-oxblood px-1 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <button className="btn-secondary hidden md:inline-flex" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary hidden md:inline-flex">
                <UserRound className="h-4 w-4" />
                Login
              </Link>
            )}
            <button className="btn-secondary h-10 w-10 p-0 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-ink/10 px-4 py-4 dark:border-white/10 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-sm font-semibold">
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <button className="btn-secondary" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link to="/login" className="btn-primary" onClick={() => setOpen(false)}>
                  <UserRound className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 py-8 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-ink/60 dark:text-zinc-400 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <p>Chapterly Bookstore. Curated reading for sharper days.</p>
          <p>Mock auth: user reader@chapterly.dev / reader123, admin admin@chapterly.dev / admin123</p>
        </div>
      </footer>
    </div>
  );
}
