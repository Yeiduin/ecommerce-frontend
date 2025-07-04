// src/pages/PlaceOrderPage.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import CheckoutSteps from '../components/CheckoutSteps';

function PlaceOrderPage() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { items, shippingAddress, paymentMethod, clearCart } = useCartStore();

  useEffect(() => {
    if (!shippingAddress.address) navigate('/envio');
    if (!paymentMethod) navigate('/pago');
  }, [shippingAddress, paymentMethod, navigate]);

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice);

  const placeOrderHandler = async () => {
    const toastId = toast.loading('Procesando tu pedido...');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const orderData = {
        orderItems: items.map(item => ({...item, product: item._id })),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        totalPrice: totalPrice,
      };

      const { data } = await axios.post('http://localhost:4000/api/orders', orderData, config);

      clearCart();
      toast.success('¡Pedido realizado con éxito!', { id: toastId });
      
      // --- CAMBIO EN LA REDIRECCIÓN ---
      // Redirigimos a la página de detalle del pedido recién creado.
      navigate(`/pedido/${data._id}`); 

    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo realizar el pedido.', { id: toastId });
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Envío</h2>
              {/* --- MOSTRAMOS LOS NUEVOS DATOS --- */}
              <p><strong>Recibe:</strong> {shippingAddress.fullName}</p>
              <p><strong>Celular:</strong> {shippingAddress.phone}</p>
              <p><strong>Dirección:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Método de Pago</h2>
              <p><strong>Método:</strong> {paymentMethod}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Artículos del Pedido</h2>
              {items.length === 0 ? <p>Tu carrito está vacío</p> : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item._id} className="flex items-center gap-4">
                      <img src={item.image || '...'} alt={item.name} className="w-16 h-16 rounded object-cover" />
                      <Link to={`/producto/${item._id}`} className="flex-1 font-semibold hover:text-emerald-400">{item.name}</Link>
                      <div>{item.quantity} x ${item.price} = <span className="font-bold">${(item.quantity * item.price).toFixed(2)}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg self-start sticky top-28">
          <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Subtotal:</span><span>${itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío:</span><span>${shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Impuestos:</span><span>${taxPrice.toFixed(2)}</span></div>
            <hr className="border-slate-700 my-2" />
            <div className="flex justify-between font-bold text-xl"><span>Total:</span><span>${totalPrice.toFixed(2)}</span></div>
          </div>
          <button onClick={placeOrderHandler} disabled={items.length === 0} className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 ...">
            Realizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderPage;