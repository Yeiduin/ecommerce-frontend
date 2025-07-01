// src/pages/admin/AdminOrdersPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // ===== LA CORRECCIÓN ESTÁ AQUÍ =====
      // Apuntamos a la nueva ruta /api/orders/all
      const { data } = await axios.get('http://localhost:4000/api/orders/all', config);

      setOrders(data);
    } catch (error) {
      toast.error('No se pudieron cargar los pedidos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleMarkAsDelivered = async (orderId) => {
    if (window.confirm('¿Estás seguro de que quieres marcar este pedido como entregado?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`http://localhost:4000/api/orders/${orderId}/deliver`, {}, config);
        
        // Refrescamos la lista de pedidos para mostrar el cambio
        fetchOrders(); 
        
        toast.success('Pedido marcado como entregado.');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error al actualizar el pedido.');
      }
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Pedidos</h1>
        <Link to="/admin/productos/nuevo">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded">
            + Añadir Producto
          </button>
        </Link>
      </div>

      <div className="bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">USUARIO</th>
              <th scope="col" className="px-6 py-3">FECHA</th>
              <th scope="col" className="px-6 py-3">TOTAL</th>
              <th scope="col" className="px-6 py-3">PAGADO</th>
              <th scope="col" className="px-6 py-3">ENTREGADO</th>
              <th scope="col" className="px-6 py-3">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                <td className="px-6 py-4">{order.user?.name || 'Usuario Eliminado'}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {order.isPaid ? (<span className="text-green-400">Sí</span>) : (<span className="text-red-400">No</span>)}
                </td>
                <td className="px-6 py-4">
                  {order.isDelivered ? (
                    <span className="text-green-400">Sí</span>
                  ) : (
                    <button onClick={() => handleMarkAsDelivered(order._id)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600">
                      Marcar
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link to={`/pedido/${order._id}`} className="font-medium text-blue-500 hover:underline">Detalles</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrdersPage;