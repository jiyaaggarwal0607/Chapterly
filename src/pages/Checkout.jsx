import { PayPalButtons } from '@paypal/react-paypal-js';
import { CreditCard, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const initialShipping = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  country: '',
  postalCode: ''
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState(initialShipping);
  const [readyForPayment, setReadyForPayment] = useState(false);
  const shippingCost = items.length ? 6.99 : 0;
  const total = subtotal + shippingCost;

  if (!items.length) {
    return <Navigate to="/cart" replace />;
  }

  function updateField(event) {
    setShipping({ ...shipping, [event.target.name]: event.target.value });
  }

  function handleShippingSubmit(event) {
    event.preventDefault();
    setReadyForPayment(true);
    pushToast('Shipping details saved. You can complete payment now.', 'info');
  }

  function completeOrder(paymentId = `MOCK-${Date.now()}`) {
    clearCart();
    pushToast('Order completed successfully.');
    navigate('/confirmation', { state: { paymentId, total, shipping } });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-sage" />
            <h2 className="text-xl font-bold">Shipping Details</h2>
          </div>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleShippingSubmit}>
            <input className="input" name="fullName" value={shipping.fullName} onChange={updateField} placeholder="Full name" required />
            <input className="input" name="email" type="email" value={shipping.email} onChange={updateField} placeholder="Email" required />
            <input className="input sm:col-span-2" name="address" value={shipping.address} onChange={updateField} placeholder="Street address" required />
            <input className="input" name="city" value={shipping.city} onChange={updateField} placeholder="City" required />
            <input className="input" name="country" value={shipping.country} onChange={updateField} placeholder="Country" required />
            <input className="input" name="postalCode" value={shipping.postalCode} onChange={updateField} placeholder="Postal code" required />
            <button className="btn-primary sm:col-span-2" type="submit">
              Save shipping details
            </button>
          </form>

          <div className="mt-8 border-t border-ink/10 pt-8 dark:border-white/10">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-sage" />
              <h2 className="text-xl font-bold">Payment</h2>
            </div>
            <div className={`mt-5 ${readyForPayment ? '' : 'pointer-events-none opacity-45'}`}>
              <PayPalButtons
                style={{ layout: 'vertical', shape: 'rect', label: 'paypal' }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: total.toFixed(2)
                        }
                      }
                    ]
                  })
                }
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  completeOrder(details.id);
                }}
                onError={() => pushToast('PayPal sandbox could not complete payment. Use mock payment for local testing.', 'info')}
              />
              <button className="btn-secondary mt-3 w-full" onClick={() => completeOrder()} disabled={!readyForPayment}>
                Mock Payment
              </button>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img src={item.cover} alt={`${item.title} cover`} className="h-16 w-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-ink/55 dark:text-zinc-400">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm dark:border-white/10">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <strong>${shippingCost.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between text-lg">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
