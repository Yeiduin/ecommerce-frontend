// src/pages/admin/AdminUsersPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  
  // --- NUEVO ESTADO PARA LA BÚSQUEDA ---
  const [searchTerm, setSearchTerm] = useState('');

  // La función para obtener usuarios ahora puede incluir un término de búsqueda
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Añadimos el término de búsqueda como un parámetro en la URL
      const { data } = await axios.get(`http://localhost:4000/api/users?search=${searchTerm}`, config);
      
      setUsers(data);
    } catch (error) {
      toast.error('No se pudieron cargar los usuarios.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Este efecto se ejecuta cuando el componente se carga por primera vez
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // --- NUEVO EFECTO PARA LA BÚSQUEDA EN TIEMPO REAL ---
  // Este efecto se dispara cada vez que el usuario deja de escribir
  // en la barra de búsqueda por medio segundo (debounce).
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (token) {
        fetchUsers();
      }
    }, 500); // 500ms de espera

    // Limpiamos el temporizador si el usuario sigue escribiendo
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, token]); // Se ejecuta cuando 'searchTerm' o 'token' cambian

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:4000/api/users/${userId}`, config);

        setUsers(users.filter(u => u._id !== userId));

        toast.success('Usuario eliminado con éxito');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error al eliminar el usuario.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionar Usuarios</h1>

      {/* --- NUEVA BARRA DE BÚSQUEDA --- */}
      <div className="mb-6">
        <input 
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 p-3 rounded-lg w-full placeholder-gray-500 text-white"
        />
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="bg-slate-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Nombre</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Rol</th>
                <th scope="col" className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                  <td className="px-6 py-4 font-mono text-xs">{user._id}</td>
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="font-bold text-emerald-400">Admin</span>
                    ) : (
                      <span>Usuario</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== 'admin' && (
                      <button onClick={() => handleDelete(user._id)} className="font-medium text-red-500 hover:underline">
                        Eliminar
                      </button>
                    )}
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

export default AdminUsersPage;