// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

function ProfilePage() {
  // Obtenemos la información del usuario y el token de nuestro estado global
  const { user, token } = useAuthStore();

  // Creamos estados locales para los pedidos y el estado de carga/error
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      // Configuramos el header de la petición con el token de autorización
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await axios.get('http://localhost:4000/api/orders/myorders', config);
        setOrders(data);
      } catch (error) {
        toast.error('No se pudo cargar el historial de pedidos.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserOrders();
    }
  }, [token]); // El efecto se ejecuta cuando el token esté disponible

  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>

      <div className="bg-slate-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Información del Usuario</h2>
        <p><strong>Nombre:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Historial de Pedidos</h2>
        {orders.length === 0 ? (
          <p>Aún no has realizado ningún pedido.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3">ID del Pedido</th>
                  <th scope="col" className="px-6 py-3">Fecha</th>
                  <th scope="col" className="px-6 py-3">Total</th>
                  <th scope="col" className="px-6 py-3">Pagado</th>
                  <th scope="col" className="px-6 py-3">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                    <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="text-green-400">Pagado el {new Date(order.paidAt).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-red-400">No Pagado</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {/* Este enlace en el futuro llevará al detalle de este pedido específico */}
                      <Link to={`/pedido/${order._id}`} className="font-medium text-blue-500 hover:underline">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;