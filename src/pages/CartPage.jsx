// src/pages/CartPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';

function CartPage() {
  // ===== CORRECCIÓN AQUÍ: Usamos selectores atómicos =====
  // Pedimos cada pieza del estado o acción que necesitamos por separado.
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  // =========================================================

  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // Si el usuario está logueado, va a envío. Si no, a login.
    if (user) {
      navigate('/envio');
    } else {
      navigate('/login?redirect=/envio'); // Pequeña mejora: si va a login, lo redirigimos al envío después
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Tu Carrito está Vacío</h1>
        <p className="text-gray-400">Parece que aún no has añadido ningún producto.</p>
        <Link to="/tienda" className="mt-6 inline-block bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700">
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Tu Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item._id} className="flex items-center bg-slate-800 p-4 rounded-lg">
              <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4"/>
              <div className="flex-grow">
                <Link to={`/producto/${item._id}`} className="text-lg font-bold hover:text-emerald-400">{item.name}</Link>
                <p className="text-emerald-400 font-semibold">${item.price}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => decreaseQuantity(item._id)} className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600">-</button>
                <span className="font-bold w-4 text-center">{item.quantity}</span>
                <button onClick={() => increaseQuantity(item._id)} className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600">+</button>
              </div>
              <button onClick={() => removeItem(item._id)} className="ml-6 text-red-500 hover:text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg sticky top-28">
          <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
          <div className="flex justify-between mb-2"><span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} productos)</span><span>${totalPrice.toFixed(2)}</span></div>
          <div className="flex justify-between mb-4"><span>Envío</span><span>Gratis</span></div>
          <div className="border-t border-slate-700 pt-4 flex justify-between font-bold text-lg"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
          <button onClick={handleCheckout} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold py-3 transition-colors">
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;