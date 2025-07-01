// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../stores/authStore';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:4000/api/users/register', formData);
      // Si el registro es exitoso, llamamos a la acción de login de nuestro store
      loginAction(response.data);
      // Y redirigimos al usuario a la página de inicio
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">Crear una Cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre</label>
            <input type="text" id="name" name="name" required onChange={handleChange} value={formData.name} className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
            <input type="email" id="email" name="email" required onChange={handleChange} value={formData.email} className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
            <input type="password" id="password" name="password" required onChange={handleChange} value={formData.password} className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."/>
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold transition-colors">
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;