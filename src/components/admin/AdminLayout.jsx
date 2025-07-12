// src/components/admin/AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';

function AdminLayout() {
  const baseLinkClasses = "block py-2.5 px-4 rounded transition duration-200 hover:bg-emerald-500 hover:text-white";
  const activeLinkClasses = "bg-emerald-600 text-white";

  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <aside className="w-64 bg-slate-800 p-4 flex flex-col">
        <div>
          <h2 className="text-xl font-bold mb-6 text-center">Panel de Admin</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <NavLink to="/admin" end className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Dashboard</NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/admin/productos" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Gestionar Productos</NavLink>
              </li>
              {/* --- NUEVO ENLACE --- */}
              <li className="mb-2">
                <NavLink to="/admin/pedidos" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Gestionar Pedidos</NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/admin/banners" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Gestionar Banners</NavLink>
              </li>
              <li className="mb-2">
              <NavLink to="/admin/tickets" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Gestionar Tickets</NavLink>
            </li>
                <li className="mb-2">
                <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Gestionar Usuarios</NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-auto">
          <hr className="border-slate-700 my-4" />
          <NavLink to="/" className={baseLinkClasses}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Volver a la Tienda</span>
            </div>
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;