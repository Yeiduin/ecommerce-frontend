// src/pages/ContactPage.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // En una aplicación real, aquí haríamos una petición a una API para enviar el email.
    // Por ahora, simulamos el éxito y reseteamos el formulario.
    console.log('Formulario enviado:', formData);
    toast.success('¡Mensaje enviado con éxito! Te responderemos pronto.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Contáctanos</h1>
          <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
            ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para servirte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-800 p-8 rounded-lg">
          {/* Columna de Información */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-emerald-400">Dirección</h3>
              <p className="text-gray-300">Calle Falsa 123, Medellín, Colombia</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400">Teléfono</h3>
              <p className="text-gray-300">(57) 300-123-4567</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400">Correo Electrónico</h3>
              <p className="text-gray-300">info@bestdeal.com</p>
            </div>
          </div>

          {/* Columna del Formulario */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Tu Nombre</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Tu Correo</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Tu Mensaje</label>
                <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."></textarea>
              </div>
              <button type="submit" className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold transition-colors">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;