// src/pages/ShippingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import CheckoutSteps from '../components/CheckoutSteps';

function ShippingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { shippingAddress, saveShippingAddress } = useCartStore();

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  
  // Redirige si el usuario no está logueado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/pago');
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md">
        <CheckoutSteps step1 step2 />
        <div className="p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-white">Dirección de Envío</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300">Dirección</label>
              <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-300">Ciudad</label>
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300">Código Postal</label>
              <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-300">País</label>
              <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"/>
            </div>
            <button type="submit" className="w-full py-3 px-4 mt-6 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold transition-colors">
              Continuar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShippingPage;