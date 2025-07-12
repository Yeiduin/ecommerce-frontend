// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';
import { FaUserCircle } from 'react-icons/fa'; // Importamos el ícono de usuario

function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);

  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error al obtener las categorías para el header:', error);
      }
    };
    fetchCategories();
  }, []);

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tienda?search=${searchTerm}`);
      setSearchTerm('');
      if (isMobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };
  
  // --- NUEVA LÓGICA DEL BOTÓN DE USUARIO ---
  const handleUserIconClick = () => {
    if (user) {
      setUserMenuOpen(!isUserMenuOpen); // Si hay usuario, abre/cierra el menú
    } else {
      navigate('/login'); // Si no hay usuario, va a la página de login
    }
  };


  // Clases reutilizables para los enlaces
  const baseLinkClasses = "text-gray-300 hover:text-emerald-400 transition-colors py-3";
  const activeLinkClasses = "text-emerald-400 font-semibold border-b-2 border-emerald-400 py-3";
  const mobileBaseLinkClasses = "block px-4 py-3 text-lg text-white hover:bg-emerald-500 rounded-md";
  const mobileActiveLinkClasses = "block px-4 py-3 text-lg text-white bg-emerald-600 font-bold rounded-md";

  return (
    <header className="bg-slate-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        
        {/* --- VISTA DE ESCRITORIO (oculta en móvil) --- */}
        <div className="hidden md:flex justify-between items-center py-3">
            <NavLink to="/" className="text-2xl font-bold text-white flex-shrink-0 mr-6">
                Best<span className="text-emerald-400">Deal</span>
            </NavLink>

            <div className="flex-grow max-w-lg mx-6">
                <form onSubmit={handleSearchSubmit} className="w-full">
                    <div className="relative">
                        <input type="search" placeholder="Buscar productos, marcas y más..." className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-emerald-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="flex items-center ml-auto">
                <nav className="flex items-center space-x-6">
                    <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Inicio</NavLink>
                    <div className="relative group">
                        <NavLink to="/tienda" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>
                            <div className="flex items-center">Productos <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg></div>
                        </NavLink>
                        <div className="absolute hidden group-hover:block top-full -right-4 w-48 bg-slate-700 rounded-md shadow-lg py-2 z-10">
                            {categories.map(cat => (
                                <Link key={cat._id} to={`/tienda?category=${cat.name}`} className="block px-4 py-2 text-sm text-gray-200 hover:bg-emerald-500 hover:text-white">{cat.name}</Link>
                            ))}
                            <hr className="border-slate-600 my-1"/>
                            <Link to="/tienda" className="block px-4 py-2 text-sm font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white">Ver Todos</Link>
                        </div>
                    </div>
                    <NavLink to="/sobre-nosotros" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Sobre Nosotros</NavLink>
                    <NavLink to="/contacto" className={({ isActive }) => isActive ? activeLinkClasses : baseLinkClasses}>Contacto</NavLink>
                </nav>
                <div className="flex items-center pl-6 space-x-4">
                    {/* --- SECCIÓN DE USUARIO Y CARRITO MODIFICADA --- */}
                    <div className="relative">
                      <button onClick={handleUserIconClick} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                        <FaUserCircle className={`h-6 w-6 ${user ? 'text-emerald-400' : 'text-gray-500'}`} />
                        {user && <span>Hola, {user.name.split(' ')[0]}</span>}
                      </button>
                      
                      {/* El menú desplegable solo se muestra si hay un usuario y está abierto */}
                      {user && isUserMenuOpen && (
                          <div className="absolute top-full right-0 mt-2 w-56 bg-slate-700 rounded-md shadow-lg py-2 z-20" onMouseLeave={() => setUserMenuOpen(false)}>
                              <div className="px-4 py-2 border-b border-slate-600">
                                  <p className="text-sm font-semibold text-white">{user.name}</p>
                                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                              </div>
                              <Link to="/perfil" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-200 hover:bg-emerald-500 hover:text-white">Mi Perfil</Link>
                              {user.role === 'admin' && (
                                  <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-200 hover:bg-emerald-500 hover:text-white">Panel de Admin</Link>
                              )}
                              <hr className="border-slate-600 my-1"/>
                              <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white">Cerrar Sesión</button>
                          </div>
                      )}
                    </div>
                    
                    <Link to="/carrito" className="text-gray-300 hover:text-white relative">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
                        {totalItemsInCart > 0 && (<span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItemsInCart}</span>)}
                    </Link>
                </div>
            </div>
        </div>

        {/* --- VISTA MÓVIL (sin cambios, ya estaba correcta) --- */}
        <div className="md:hidden flex items-center justify-between py-3 gap-3">
             <NavLink to="/" className="text-xl font-bold">
                Best<span className="text-emerald-400">Deal</span>
            </NavLink>
            <form onSubmit={handleSearchSubmit} className="flex-grow">
                <div className="relative">
                    <input type="search" placeholder="Buscar..." className="w-full bg-slate-800 text-sm rounded-full py-2 pl-4 pr-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </form>
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
             <Link to="/carrito" className="relative">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
                {totalItemsInCart > 0 && (<span className="absolute -top-2 -right-2 bg-emerald-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItemsInCart}</span>)}
            </Link>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL (sin cambios) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 p-4 space-y-2">
            <nav className="flex flex-col space-y-2 pt-2">
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? mobileActiveLinkClasses : mobileBaseLinkClasses}>Inicio</NavLink>
                <NavLink to="/tienda" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? mobileActiveLinkClasses : mobileBaseLinkClasses}>Productos</NavLink>
                <NavLink to="/sobre-nosotros" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? mobileActiveLinkClasses : mobileBaseLinkClasses}>Sobre Nosotros</NavLink>
                <NavLink to="/contacto" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? mobileActiveLinkClasses : mobileBaseLinkClasses}>Contacto</NavLink>
                <hr className="border-slate-700 my-2"/>
                {user ? (
                <>
                    <NavLink to="/perfil" onClick={() => setMobileMenuOpen(false)} className={mobileBaseLinkClasses}>Mi Perfil</NavLink>
                    {user.role === 'admin' && (<NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileBaseLinkClasses}>Panel de Admin</NavLink>)}
                    <button onClick={handleLogout} className={`${mobileBaseLinkClasses} bg-red-600 hover:bg-red-700 text-left w-full`}>Cerrar Sesión</button>
                </>
                ) : (
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className={mobileBaseLinkClasses}>Iniciar Sesión</NavLink>
                )}
            </nav>
        </div>
      )}
    </header>
  );
}

export default Header;