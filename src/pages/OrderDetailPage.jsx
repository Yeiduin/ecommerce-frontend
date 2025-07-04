// src/pages/OrderDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

function OrderDetailPage() {
  const { id: orderId } = useParams();
  const { token } = useAuthStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
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
  }, [orderId, token]);

  // --- NUEVO: Estilos para el estado del pedido ---
  const statusStyles = {
    "En proceso": "bg-blue-500/20 text-blue-300",
    "Enviado": "bg-yellow-500/20 text-yellow-300",
    "Entregado": "bg-emerald-500/20 text-emerald-300",
    "Cancelado": "bg-red-500/20 text-red-300",
  };

  if (loading) return <p className="text-center py-10">Cargando pedido...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!order) return <p className="text-center py-10">Pedido no encontrado.</p>;

  // Cálculo de precios para el resumen
  const itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = order.totalPrice - itemsPrice - shippingPrice;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Detalles del Pedido #{order.orderNumber}</h1>
      <p className="text-sm text-gray-400 mb-6">ID de referencia: {order._id}</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div className="bg-slate-800 p-4 sm:p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Envío</h2>
              <p><strong>Nombre:</strong> {order.user.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-emerald-400">{order.user.email}</a></p>
              <p><strong>Dirección:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              
              {/* --- CAMBIO PRINCIPAL AQUÍ --- */}
              {/* Mostramos el nuevo estado del pedido con su estilo correspondiente */}
              <div className={`mt-4 p-3 rounded-lg text-center font-semibold ${statusStyles[order.status] || 'bg-gray-700'}`}>
                {order.status}
              </div>
            </div>

            <div className="bg-slate-800 p-4 sm:p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Artículos del Pedido</h2>
              <div className="space-y-4">
                {order.orderItems.map(item => (
                  <div key={item._id || item.product} className="flex items-center gap-4 border-b border-slate-700 py-4 last:border-b-0">
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
            <div className="flex justify-between"><span>Subtotal:</span><span>${itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío:</span><span>${shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Impuestos:</span><span>${taxPrice.toFixed(2)}</span></div>
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