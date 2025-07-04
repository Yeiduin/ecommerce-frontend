// src/pages/OrderDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

function OrderDetailPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:4000/api/orders/${id}`,
          config
        );
        setOrder(data);
      } catch (error) {
        toast.error("No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrder();
    }
  }, [id, token]);

  if (loading) return <p>Cargando detalles del pedido...</p>;
  if (!order) return <p>Pedido no encontrado.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- CAMBIO AQUÍ --- */}
      <h1 className="text-3xl font-bold mb-4 text-white">
        Detalles del Pedido #{order.orderNumber}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-slate-800 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Dirección de Envío
            </h2>
            <p className="text-gray-300">
              <strong className="text-white">Nombre:</strong> {order.user.name}
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Email:</strong>{" "}
              <a href={`mailto:${order.user.email}`} className="text-blue-400">
                {order.user.email}
              </a>
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Dirección:</strong>{" "}
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="mt-4 bg-green-900 text-green-200 p-3 rounded-lg">
                Entregado el {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="mt-4 bg-red-900 text-red-200 p-3 rounded-lg">
                No Entregado
              </div>
            )}
          </div>

          <div className="bg-slate-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Artículos del Pedido
            </h2>
            {order.orderItems.map((item) => (
              <div
                key={item.product}
                className="flex items-center justify-between py-4 border-b border-slate-700"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-white">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-slate-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Resumen del Pedido
            </h2>
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white">${order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-gray-300">Envío</span>
              <span className="text-white">$0.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span className="text-white">Total</span>
              <span className="text-white">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;