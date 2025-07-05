// src/pages/TicketDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para la navegación
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  
  const { user, token } = useAuthStore();

  const fetchTicket = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`http://localhost:4000/api/tickets/${id}`, config);
      setTicket(data);
    } catch (error) {
      toast.error('No se pudo cargar el ticket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTicket();
    }
  }, [id, token]);
  
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
        toast.error("La respuesta no puede estar vacía.");
        return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`http://localhost:4000/api/tickets/${id}/reply`, { message: replyMessage }, config);
      setTicket(data);
      setReplyMessage('');
      toast.success('Respuesta enviada.');
    } catch (error) {
      toast.error('No se pudo enviar la respuesta.');
    }
  };
  
  const handleStatusChange = async (newStatus) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}`}};
        const { data } = await axios.put(`http://localhost:4000/api/tickets/${id}/status`, { status: newStatus }, config);
        setTicket(data);
        toast.success(`Estado del ticket actualizado a "${newStatus}"`);
    } catch (error) {
        toast.error('No se pudo cambiar el estado.');
    }
  }

  // --- NUEVA FUNCIÓN PARA REGRESAR ---
  const handleGoBack = () => {
    if (user.role === 'admin') {
      navigate('/admin/tickets');
    } else {
      navigate('/perfil');
    }
  };

  const statusTicketStyles = {
    "Abierto": "bg-blue-500/20 text-blue-300",
    "En proceso": "bg-yellow-500/20 text-yellow-300",
    "Cerrado": "bg-green-500/20 text-green-300",
  };

  if (loading) return <p className="text-center py-10">Cargando ticket...</p>;
  if (!ticket) return <p className="text-center py-10">Ticket no encontrado.</p>;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      
      {/* --- NUEVO BOTÓN DE REGRESAR --- */}
      <button onClick={handleGoBack} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>
            {user.role === 'admin' ? 'Volver a todos los tickets' : 'Volver a mi perfil'}
        </span>
      </button>

      <div className="bg-slate-800 p-6 rounded-lg">
        {/* ... (El resto del código de la página no cambia) ... */}
        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">{ticket.subject}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusTicketStyles[ticket.status] || 'bg-gray-700'}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">De: {ticket.user.name} ({ticket.user.email})</p>
            {ticket.order && <p className="text-sm text-gray-400">Relacionado al Pedido: <Link to={`/pedido/${ticket.order._id}`} className="text-emerald-400 underline">#{ticket.order.orderNumber}</Link></p>}
          </div>
          {user.role === 'admin' && ticket.status !== 'Cerrado' && (
            <div className="flex items-center gap-2 self-start">
                <span className="text-sm text-gray-300">Marcar como:</span>
                {ticket.status !== 'En proceso' && (
                    <button onClick={() => handleStatusChange('En proceso')} className="bg-yellow-600 text-white px-2 py-1 text-xs rounded-lg hover:bg-yellow-700 transition-colors">En proceso</button>
                )}
                <button onClick={() => handleStatusChange('Cerrado')} className="bg-green-600 text-white px-2 py-1 text-xs rounded-lg hover:bg-green-700 transition-colors">Cerrado</button>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-6">
          {ticket.messages.map((msg, index) => (
            <div key={index} className={`p-4 rounded-lg ${msg.sender === 'admin' ? 'bg-slate-700' : 'bg-emerald-900/50'}`}>
              <p className="font-bold text-white">{msg.name}</p>
              <p className="text-gray-300 whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs text-gray-500 text-right mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {ticket.status !== 'Cerrado' && (
            <form onSubmit={handleReplySubmit} className="mt-6 border-t border-slate-700 pt-6">
                <h3 className="text-xl font-bold mb-2">Responder</h3>
                <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full bg-slate-700 p-2 rounded-md"
                    rows="4"
                    placeholder="Escribe tu respuesta..."
                    required
                ></textarea>
                <button type="submit" className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg">
                    Enviar Respuesta
                </button>
            </form>
        )}
      </div>
    </div>
  );
}

export default TicketDetailPage;