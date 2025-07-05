// src/pages/ContactPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAuthStore from '../stores/authStore';

function ContactPage() {
  // Estados para el formulario
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  // Si el usuario está logueado, obtenemos sus pedidos para el menú desplegable
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (user && token) {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get('http://localhost:4000/api/orders/myorders', config);
          setUserOrders(data);
        } catch (error) {
          console.error("No se pudieron cargar los pedidos del usuario", error);
        }
      }
    };
    fetchUserOrders();
  }, [user, token]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
        toast.error('Debes iniciar sesión para enviar una solicitud de soporte.');
        navigate('/login');
        return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const ticketData = { subject, message, orderId: orderId || undefined };
      
      await axios.post('http://localhost:4000/api/tickets', ticketData, config);

      toast.success('¡Ticket enviado! Te responderemos pronto.');
      setSubject('');
      setMessage('');
      setOrderId('');
      navigate('/perfil'); // Llevamos al usuario a su perfil para que vea su nuevo ticket
    } catch (error) {
      toast.error('No se pudo enviar el ticket.');
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Centro de Soporte</h1>
          <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
            ¿Tienes alguna pregunta o un problema con un pedido? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Si el usuario ha iniciado sesión, muestra sus pedidos */}
            {user && userOrders.length > 0 && (
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-300">¿Tu consulta es sobre un pedido específico?</label>
                <select id="orderId" value={orderId} onChange={(e) => setOrderId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-700 ...">
                  <option value="">No, es una consulta general</option>
                  {userOrders.map(order => (
                    <option key={order._id} value={order._id}>
                      Pedido #{order.orderNumber} - {new Date(order.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Asunto</label>
              <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 ..."/>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">Tu Mensaje</label>
              <textarea id="message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 ..."></textarea>
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-emerald-600 ...">
              Enviar Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;