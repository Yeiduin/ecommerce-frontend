// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

function ProfilePage() {
  const { user, token } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
          // Usamos Promise.all para cargar pedidos y tickets en paralelo
          const [ordersRes, ticketsRes] = await Promise.all([
            axios.get('http://localhost:4000/api/orders/myorders', config),
            axios.get('http://localhost:4000/api/tickets/mytickets', config)
          ]);
          setOrders(ordersRes.data);
          setTickets(ticketsRes.data);
        } catch (error) {
          toast.error('No se pudo cargar tu información.');
          console.error('Error al cargar datos del perfil:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [token]);

  const statusOrderStyles = {
    "En proceso": "text-blue-400",
    "Enviado": "text-yellow-400",
    "Entregado": "text-green-400",
    "Cancelado": "text-red-400",
  };
  
  const statusTicketStyles = {
    "Abierto": "bg-blue-500/20 text-blue-300",
    "En proceso": "bg-yellow-500/20 text-yellow-300",
    "Cerrado": "bg-green-500/20 text-green-300",
  };


  if (loading) {
    return <p className="text-center py-10">Cargando perfil...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>

      <div className="bg-slate-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Información del Usuario</h2>
        <p><strong>Nombre:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Historial de Pedidos</h2>
        {orders.length === 0 ? (
          <p>Aún no has realizado ningún pedido.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Nº PEDIDO</th>
                  <th scope="col" className="px-6 py-3">FECHA</th>
                  <th scope="col" className="px-6 py-3">TOTAL</th>
                  <th scope="col" className="px-6 py-3">ESTADO</th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                    <td className="px-6 py-4 font-bold text-white">#{order.orderNumber}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${statusOrderStyles[order.status] || 'text-gray-400'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/pedido/${order._id}`} className="font-medium text-blue-500 hover:underline">Ver Detalles</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Mis Tickets de Soporte</h2>
        {tickets.length === 0 ? (
          <p>No tienes tickets de soporte. Si necesitas ayuda, puedes <Link to="/contacto" className="text-emerald-400 underline">contactarnos aquí</Link>.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Fecha</th>
                  <th scope="col" className="px-6 py-3">Asunto</th>
                  <th scope="col" className="px-6 py-3">Estado</th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                    <td className="px-6 py-4">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-white">{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusTicketStyles[ticket.status] || 'bg-gray-500/20 text-gray-300'}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/ticket/${ticket._id}`} className="font-medium text-blue-500 hover:underline">Ver Conversación</Link>
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