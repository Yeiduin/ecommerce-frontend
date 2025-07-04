// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../stores/authStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function ProfilePage() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:4000/api/orders/myorders",
          config
        );
        setOrders(data);
      } catch (error) {
        toast.error("No se pudieron cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Mi Perfil</h1>
      <div className="bg-slate-800 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Información del Usuario
        </h2>
        <p className="text-gray-300">
          <strong className="text-white">Nombre:</strong> {user?.name}
        </p>
        <p className="text-gray-300">
          <strong className="text-white">Email:</strong> {user?.email}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-white">Mis Pedidos</h2>
      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <div className="bg-slate-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-slate-700">
              <tr>
                {/* --- CAMBIO AQUÍ --- */}
                <th scope="col" className="px-6 py-3">Nº PEDIDO</th>
                <th scope="col" className="px-6 py-3">FECHA</th>
                <th scope="col" className="px-6 py-3">TOTAL</th>
                <th scope="col" className="px-6 py-3">PAGADO</th>
                <th scope="col" className="px-6 py-3">ENTREGADO</th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700"
                >
                  {/* --- CAMBIO AQUÍ --- */}
                  {/* Mostramos el orderNumber en lugar del _id */}
                  <td className="px-6 py-4 font-bold text-white">#{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {order.isPaid ? (
                      <span className="text-green-400">Sí</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.isDelivered ? (
                      <span className="text-green-400">Sí</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/pedido/${order._id}`}
                      className="font-medium text-blue-500 hover:underline"
                    >
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;