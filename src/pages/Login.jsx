import { LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const presets = {
  user: { email: 'reader@chapterly.dev', password: 'reader123' },
  admin: { email: 'admin@chapterly.dev', password: 'admin123' }
};

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedRole = location.state?.role || 'user';
  const [role, setRole] = useState(requestedRole);
  const [form, setForm] = useState(presets[requestedRole]);
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const { pushToast } = useToast();

  useEffect(() => {
    setForm(presets[role]);
    setError('');
  }, [role]);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/shop'} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    try {
      const loggedIn = login({ role, ...form });
      pushToast(`Welcome back, ${loggedIn.name}.`);
      navigate(location.state?.from || (role === 'admin' ? '/admin' : '/shop'), { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_30rem] lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage">Dual-role entry</p>
        <h1 className="mt-4 font-serif text-5xl font-bold">Choose how you want to enter Chapterly.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-ink/65 dark:text-zinc-300">
          Readers get the storefront and checkout flow. Admins unlock protected catalog, pricing, stock, category, and order management.
        </p>
      </div>

      <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-zinc-900">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-ink/5 p-1 dark:bg-white/5">
          {[
            { value: 'user', label: 'Login as User', icon: UserRound },
            { value: 'admin', label: 'Login as Admin', icon: ShieldCheck }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRole(option.value)}
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-3 text-sm font-bold transition ${
                role === option.value ? 'bg-white text-ink shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-ink/60 dark:text-zinc-400'
              }`}
            >
              <option.icon className="h-4 w-4" />
              {option.label}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input className="input mt-2" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input className="input mt-2" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </div>
          {error && <p className="rounded-md bg-oxblood/10 px-3 py-2 text-sm font-semibold text-oxblood">{error}</p>}
          <button className="btn-primary w-full" type="submit">
            <LockKeyhole className="h-4 w-4" />
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
