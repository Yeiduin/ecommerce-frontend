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

  // El estado ahora se inicializa con el método guardado o 'PayPal' por defecto
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'PayPal');

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
            {/* --- SECCIÓN DE OPCIONES DE PAGO ACTUALIZADA --- */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-medium text-white mb-4">Selecciona un método</legend>
              
              <div className="flex items-center">
                <input type="radio" id="paypal" name="paymentMethod" value="PayPal" checked={selectedMethod === 'PayPal'} onChange={(e) => setSelectedMethod(e.target.value)} className="h-4 w-4 text-emerald-600 ..."/>
                <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-white">PayPal</label>
              </div>

              <div className="flex items-center">
                <input type="radio" id="tarjeta" name="paymentMethod" value="Tarjeta de Crédito / Débito" checked={selectedMethod === 'Tarjeta de Crédito / Débito'} onChange={(e) => setSelectedMethod(e.target.value)} className="h-4 w-4 text-emerald-600 ..."/>
                <label htmlFor="tarjeta" className="ml-3 block text-sm font-medium text-white">Tarjeta de Crédito / Débito</label>
              </div>

              <div className="flex items-center">
                <input type="radio" id="pse" name="paymentMethod" value="PSE" checked={selectedMethod === 'PSE'} onChange={(e) => setSelectedMethod(e.target.value)} className="h-4 w-4 text-emerald-600 ..."/>
                <label htmlFor="pse" className="ml-3 block text-sm font-medium text-white">PSE</label>
              </div>

            </fieldset>
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