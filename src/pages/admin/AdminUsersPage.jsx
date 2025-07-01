// src/pages/admin/AdminUsersPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:4000/api/users', config);
      setUsers(data);
    } catch (error) {
      toast.error('No se pudieron cargar los usuarios.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:4000/api/users/${userId}`, config);

        // Actualizamos el estado local para reflejar el cambio en la UI
        setUsers(users.filter(u => u._id !== userId));

        toast.success('Usuario eliminado con éxito');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error al eliminar el usuario.');
      }
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionar Usuarios</h1>
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
                  {/* Por seguridad, no permitimos borrar administradores desde la UI */}
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
    </div>
  );
}

export default AdminUsersPage;