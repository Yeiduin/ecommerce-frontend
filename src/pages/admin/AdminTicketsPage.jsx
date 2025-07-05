// src/pages/admin/AdminTicketsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:4000/api/tickets', config);
        setTickets(data);
      } catch (error) {
        toast.error('No se pudieron cargar los tickets de soporte.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTickets();
    }
  }, [token]);
  
  const statusTicketStyles = {
    "Abierto": "bg-blue-500 text-white",
    "En proceso": "bg-yellow-500 text-white",
    "Cerrado": "bg-green-500 text-white",
  };

  if (loading) return <p>Cargando tickets...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionar Tickets de Soporte</h1>
      <div className="bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">Usuario</th>
              <th scope="col" className="px-6 py-3">Asunto</th>
              <th scope="col" className="px-6 py-3">Fecha de Creación</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                <td className="px-6 py-4">
                    <p className="font-semibold text-white">{ticket.user.name}</p>
                    <p className="text-xs text-gray-500">{ticket.user.email}</p>
                </td>
                <td className="px-6 py-4">{ticket.subject}</td>
                <td className="px-6 py-4">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusTicketStyles[ticket.status] || 'bg-gray-700'}`}>
                        {ticket.status}
                    </span>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/admin/tickets/${ticket._id}`} className="font-medium text-blue-500 hover:underline">
                    Ver y Responder
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

export default AdminTicketsPage;