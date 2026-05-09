import React from 'react';
import ReactDOM from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb', currency: 'USD' }}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <BookProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </BookProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </PayPalScriptProvider>
  </React.StrictMode>
);
