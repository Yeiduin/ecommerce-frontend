// src/pages/admin/AdminDashboardPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:4000/api/summary', config);
        setSummary(data);
      } catch (error) {
        toast.error('No se pudieron cargar las estadísticas.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchSummary();
    }
  }, [token]);

  if (loading) {
    return <p>Cargando dashboard...</p>;
  }
  
  if (!summary) {
    return <p>No se pudieron cargar los datos.</p>;
  }

  // Componente interno para las tarjetas de estadísticas
  const StatCard = ({ title, value, icon }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
      <div className="bg-emerald-500 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Ingresos Totales" 
          value={`$${summary.totalSales.toFixed(2)}`}
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
        />
        <StatCard 
          title="Total de Pedidos" 
          value={summary.ordersCount}
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard 
          title="Total de Usuarios" 
          value={summary.usersCount}
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 01-3.71-3.71A3.002 3.002 0 017 9c1.657 0 3 1.343 3 3s-1.343 3-3 3m0-6c-1.657 0-3-1.343-3-3s1.343-3 3-3m6 6c1.657 0 3-1.343 3-3s-1.343-3 3-3" /></svg>}
        />
        <StatCard 
          title="Total de Productos" 
          value={summary.productsCount}
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
        />
      </div>

      {/* Tabla de Pedidos Recientes */}
      <h2 className="text-2xl font-bold mb-4">Pedidos Recientes</h2>
      <div className="bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">ID del Pedido</th>
              <th scope="col" className="px-6 py-3">Usuario</th>
              <th scope="col" className="px-6 py-3">Fecha</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {summary.recentOrders.map((order) => (
              <tr key={order._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                <td className="px-6 py-4">{order.user?.name || 'N/A'}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <Link to={`/pedido/${order._id}`} className="font-medium text-blue-500 hover:underline">Ver Detalles</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboardPage;