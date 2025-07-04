// src/pages/admin/AdminOrdersPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom'; // Importamos useSearchParams
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  
  // --- NUEVO ---
  // Usamos useSearchParams para leer y escribir en la URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Función para obtener los pedidos, ahora usando los parámetros de la URL
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Construimos la URL con los parámetros de búsqueda y ordenamiento
      const queryString = searchParams.toString();
      const { data } = await axios.get(`http://localhost:4000/api/orders/all?${queryString}`, config);

      setOrders(data);
    } catch (error) {
      toast.error('No se pudieron cargar los pedidos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // El efecto ahora se ejecuta cada vez que cambian los searchParams
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, searchParams]); // Disparamos el efecto al cambiar los parámetros

  // --- NUEVA FUNCIÓN ---
  // Maneja los cambios en la búsqueda y el ordenamiento
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleMarkAsDelivered = async (orderId) => {
    if (window.confirm('¿Estás seguro de que quieres marcar este pedido como entregado?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`http://localhost:4000/api/orders/${orderId}/deliver`, {}, config);
        
        fetchOrders(); // Volvemos a cargar los pedidos para reflejar el cambio
        
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
      </div>

      {/* --- NUEVA SECCIÓN DE BÚSQUEDA Y FILTROS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-slate-800 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Buscar por Nº Pedido, usuario o producto..."
          defaultValue={searchParams.get('search') || ''}
          onKeyUp={(e) => { if (e.key === 'Enter') handleFilterChange('search', e.target.value) }}
          className="bg-slate-700 p-2 rounded w-full placeholder-gray-400"
        />
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
              {/* Añadimos la columna para el nuevo ID */}
              <th scope="col" className="px-6 py-3">Nº PEDIDO</th>
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
                {/* Mostramos el nuevo ID amigable */}
                <td className="px-6 py-4 font-bold text-white">#{order.orderNumber}</td>
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