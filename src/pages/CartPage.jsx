// src/pages/CartPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';

function CartPage() {
  // --- CORRECCIÓN CLAVE AQUÍ ---
  // Seleccionamos cada pieza del estado por separado para evitar re-renders innecesarios y bucles infinitos.
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  // --- FIN DE LA CORRECCIÓN ---

  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Calculamos el precio total del carrito
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Navega al checkout o al login si es necesario
  const handleCheckout = () => {
    if (user) {
      navigate('/envio');
    } else {
      // Redirigimos al usuario al login, y después del login, lo llevamos a la página de envío
      navigate('/login?redirect=/envio');
    }
  };

  // --- Renderizado para un Carrito Vacío ---
  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Tu Carrito está Vacío</h1>
        <p className="text-gray-400">Parece que aún no has añadido ningún producto.</p>
        <Link 
          to="/tienda" 
          className="mt-6 inline-block bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-transform hover:scale-105"
        >
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  // --- Renderizado del Carrito con Productos ---
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">Tu Carrito de Compras</h1>
      
      {/* Contenedor principal adaptable */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Columna de Productos */}
        <div className="w-full lg:w-2/3 space-y-4">
          {items.map(item => (
            <div key={item._id} className="flex flex-col sm:flex-row items-center bg-slate-800 p-4 rounded-lg gap-4">
              {/* Imagen y Nombre del Producto */}
              <div className="flex items-center w-full sm:w-1/2">
                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4"/>
                <div className="flex-grow">
                  <Link to={`/producto/${item._id}`} className="font-semibold hover:text-emerald-400">{item.name}</Link>
                  <p className="text-emerald-400 font-bold sm:hidden mt-1">${item.price.toFixed(2)}</p> {/* Precio visible en móvil */}
                </div>
              </div>
              
              {/* Controles y Precio */}
              <div className="flex justify-between items-center w-full sm:w-1/2">
                <p className="hidden sm:block text-emerald-400 font-bold w-1/4">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-3 w-1/2 justify-center">
                  <button onClick={() => decreaseQuantity(item._id)} className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 font-bold">-</button>
                  <span className="font-bold w-8 text-center">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)} className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 font-bold">+</button>
                </div>
                <button onClick={() => removeItem(item._id)} className="w-1/4 text-right text-red-500 hover:text-red-400" title="Eliminar producto">
                  <svg className="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Columna de Resumen del Pedido */}
        <div className="w-full lg:w-1/3 bg-slate-800 p-6 rounded-lg lg:sticky lg:top-28">
          <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} productos)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Envío</span>
              <span className="font-semibold text-green-400">Gratis</span>
            </div>
            <hr className="border-slate-700 my-2" />
            <div className="flex justify-between font-bold text-xl pt-2">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={handleCheckout} 
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold py-3 transition-colors"
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;