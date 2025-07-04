// src/pages/admin/AdminOrdersPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        `http://localhost:4000/api/orders/all?${searchParams.toString()}`,
        config
      );
      setOrders(data);
    } catch (error) {
      toast.error('No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, searchParams]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `http://localhost:4000/api/orders/${orderId}/status`,
        { status: newStatus },
        config
      );
      
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      
      toast.success(`Pedido actualizado a "${newStatus}"`);
    } catch (error) {
      toast.error("Error al actualizar el estado.");
    }
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'Todos') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const statusStyles = {
    "En proceso": "bg-blue-500 text-white",
    "Enviado": "bg-yellow-500 text-white",
    "Entregado": "bg-green-500 text-white",
    "Cancelado": "bg-red-500 text-white",
  };

  if (loading) return <p>Cargando pedidos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Pedidos</h1>
      </div>

      {/* --- SECCIÓN DE FILTROS ACTUALIZADA --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-800 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Buscar por Nº Pedido, usuario o producto..."
          defaultValue={searchParams.get('search') || ''}
          onKeyUp={(e) => { if (e.key === 'Enter') handleFilterChange('search', e.target.value) }}
          className="bg-slate-700 p-2 rounded w-full placeholder-gray-400"
        />
        <select 
          onChange={(e) => handleFilterChange('status', e.target.value)} 
          value={searchParams.get('status') || 'Todos'} 
          className="bg-slate-700 p-2 rounded w-full"
        >
          <option value="Todos">Todos los Estados</option>
          <option value="En proceso">En proceso</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        <select 
          onChange={(e) => handleFilterChange('sort', e.target.value)} 
          value={searchParams.get('sort') || 'date-desc'} 
          className="bg-slate-700 p-2 rounded w-full"
        >
          <option value="date-desc">Más Recientes</option>
          <option value="date-asc">Más Antiguos</option>
          <option value="price-desc">Mayor Precio</option>
          <option value="price-asc">Menor Precio</option>
        </select>
      </div>

      <div className="bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">Nº PEDIDO</th>
              <th scope="col" className="px-6 py-3">USUARIO</th>
              <th scope="col" className="px-6 py-3">FECHA</th>
              <th scope="col" className="px-6 py-3">TOTAL</th>
              <th scope="col" className="px-6 py-3">ESTADO</th>
              <th scope="col" className="px-6 py-3">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                <td className="px-6 py-4 font-bold text-white">#{order.orderNumber}</td>
                <td className="px-6 py-4">{order.user?.name || 'Usuario Eliminado'}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`p-2 rounded text-xs font-semibold ${statusStyles[order.status] || 'bg-gray-500 text-white'}`}
                  >
                    <option value="En proceso">En proceso</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/pedido/${order._id}`} className="font-medium text-blue-500 hover:underline">
                    Detalles
                  </Link>
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