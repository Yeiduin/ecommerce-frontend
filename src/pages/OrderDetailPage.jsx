// src/pages/OrderDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

function OrderDetailPage() {
  // Obtenemos el ID del pedido desde los parámetros de la URL
  const { id: orderId } = useParams();

  // Obtenemos el token del usuario para autorizar la petición
  const { token } = useAuthStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      // Nos aseguramos de tener un token antes de hacer la llamada
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const { data } = await axios.get(`http://localhost:4000/api/orders/${orderId}`, config);
        setOrder(data);
      } catch (err) {
        setError('No se pudo cargar el pedido. Es posible que no tengas permiso para verlo.');
        toast.error('No se pudo cargar el pedido.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]); // El efecto depende del ID del pedido y del token

  if (loading) return <p className="text-center py-10">Cargando pedido...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!order) return <p className="text-center py-10">Pedido no encontrado.</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Detalles del Pedido</h1>
      <p className="text-sm text-gray-400 mb-6">ID del Pedido: {order._id}</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div className="bg-slate-800 p-4 sm:p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Envío</h2>
              <p><strong>Nombre:</strong> {order.user.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-emerald-400">{order.user.email}</a></p>
              <p><strong>Dirección:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>

            <div className="bg-slate-800 p-4 sm:p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Artículos del Pedido</h2>
              <div className="space-y-4">
                {order.orderItems.map(item => (
                  <div key={item._id} className="flex items-center gap-4 border-b border-slate-700 py-4 last:border-b-0">
                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-16 h-16 rounded object-cover" />
                    <Link to={`/producto/${item.product}`} className="flex-1 font-semibold hover:text-emerald-400">{item.name}</Link>
                    <div className="text-right">
                      {item.quantity} x ${item.price.toFixed(2)} = <span className="font-bold">${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg self-start sticky top-28">
          <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Subtotal:</span><span>${(order.totalPrice / 1.15).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío:</span><span>$0.00</span></div>
            <div className="flex justify-between"><span>Impuestos (15%):</span><span>${(order.totalPrice - (order.totalPrice / 1.15)).toFixed(2)}</span></div>
            <hr className="border-slate-700 my-2" />
            <div className="flex justify-between font-bold text-xl"><span>Total:</span><span>${order.totalPrice.toFixed(2)}</span></div>
          </div>
          <div className="mt-4 border-t border-slate-700 pt-4">
            <h3 className="font-bold mb-2">Estado del Pago</h3>
            {order.isPaid ? (
              <div className="bg-emerald-500/20 text-emerald-300 p-3 rounded-lg text-center">Pagado el {new Date(order.paidAt).toLocaleDateString()}</div>
            ) : (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-center">Pendiente de Pago</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;