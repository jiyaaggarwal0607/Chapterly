import { CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function OrderConfirmation() {
  const { state } = useLocation();

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-sage" />
      <h1 className="mt-6 font-serif text-4xl font-bold">Order Confirmed</h1>
      <p className="mt-4 text-ink/65 dark:text-zinc-300">
        Thank you for shopping with Chapterly. Your payment reference is <strong>{state?.paymentId || 'MOCK-CONFIRMED'}</strong>.
      </p>
      {state?.total && <p className="mt-2 text-sm text-ink/55 dark:text-zinc-400">Total paid: ${state.total.toFixed(2)}</p>}
      <Link to="/shop" className="btn-primary mt-8">
        Continue shopping
      </Link>
    </section>
  );
}
