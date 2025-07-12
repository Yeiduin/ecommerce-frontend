// src/components/admin/AdminLayout.jsx
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Íconos para el menú móvil

function AdminLayout() {
  // Estado para controlar la visibilidad de la barra lateral en móvil
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- Componente de la Barra Lateral (reutilizable) ---
  const SidebarContent = () => (
    <>
      <div className="flex justify-between items-center mb-6 md:justify-center">
        <h2 className="text-xl font-bold text-white">Panel de Admin</h2>
        {/* Botón para cerrar el menú en móvil */}
        <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(false)}>
          <FaTimes />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <NavLink to="/admin" end className={({ isActive }) => (isActive ? "bg-emerald-600 text-white" : "") + " block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-500 hover:text-white"}>Dashboard</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/admin/productos" className={({ isActive }) => (isActive ? "bg-emerald-600 text-white" : "") + " block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-500 hover:text-white"}>Gestionar Productos</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/admin/pedidos" className={({ isActive }) => (isActive ? "bg-emerald-600 text-white" : "") + " block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-500 hover:text-white"}>Gestionar Pedidos</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/admin/banners" className={({ isActive }) => (isActive ? "bg-emerald-600 text-white" : "") + " block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-500 hover:text-white"}>Gestionar Banners</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/admin/tickets" className={({ isActive }) => (isActive ? "bg-emerald-600 text-white" : "") + " block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-500 hover:text-white"}>Gestionar Tickets</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/admin/usuarios" className={({ isActive }) => (isActive ? "bg-emerald-600 text-white" : "") + " block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-500 hover:text-white"}>Gestionar Usuarios</NavLink>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <hr className="border-slate-700 my-4" />
        <NavLink to="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-500 hover:text-white">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Volver a la Tienda</span>
          </div>
        </NavLink>
      </div>
    </>
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen md:flex">
      {/* --- Overlay para el menú móvil --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- Barra Lateral --- */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-800 p-4 flex flex-col z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* --- Contenido Principal --- */}
      <div className="flex-1 flex flex-col">
        {/* Header para móvil con botón de menú */}
        <header className="md:hidden bg-slate-800 p-4 flex items-center shadow-lg">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            <FaBars />
          </button>
          <h2 className="text-lg font-bold ml-4">Admin</h2>
        </header>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;