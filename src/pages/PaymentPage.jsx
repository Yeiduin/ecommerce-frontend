// src/pages/PaymentPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentPage() {
  const navigate = useNavigate();
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCartStore();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/envio');
    }
  }, [shippingAddress, navigate]);

  const [selectedMethod, setSelectedMethod] = useState(paymentMethod);

  const handleSubmit = (e) => {
    e.preventDefault();
    savePaymentMethod(selectedMethod);
    navigate('/realizar-pedido');
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md">
        <CheckoutSteps step1 step2 step3 />
        <div className="p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-white">Método de Pago</h1>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <fieldset>
                <legend className="text-lg font-medium text-white">Selecciona un método</legend>
                <div className="mt-4 flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="PayPal"
                    checked={selectedMethod === 'PayPal'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-white">
                    PayPal o Tarjeta de Crédito
                  </label>
                </div>
              </fieldset>
            </div>
            <button type="submit" className="w-full py-3 px-4 mt-8 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold transition-colors">
              Continuar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;