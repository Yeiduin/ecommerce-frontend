// ecommerce-frontend/src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  const { _id, name, image, price, stock, brand } = product;
  
  const addItemToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItemToCart(product);
    toast.success(`${product.name} añadido al carrito!`);
  };

  return (
    // Se mantiene como un flexbox en columna que ocupa toda la altura.
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group flex flex-col h-full">
      <Link to={`/producto/${_id}`} className="flex-grow flex flex-col">
        {/* 1. SECCIÓN DE IMAGEN (altura fija) */}
        <div className="relative">
          <div className="h-40 md:h-56 w-full bg-slate-700 flex items-center justify-center">
            <img 
              className="h-full w-full object-contain group-hover:opacity-80 transition-opacity" 
              src={image || 'https://via.placeholder.com/400x300'} 
              alt={`Imagen de ${name}`} 
            />
          </div>
          {stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">AGOTADO</div>
          )}
        </div>
        
        {/* 2. SECCIÓN DE TEXTO (se expande para rellenar) */}
        <div className="p-3 md:p-4 flex-grow">
          <p className="text-xs text-emerald-400 font-semibold uppercase mb-1">{brand}</p>
          <h3 className="text-sm md:text-base font-bold text-white group-hover:text-emerald-400 transition-colors h-10 leading-tight line-clamp-2">{name}</h3>
        </div>
      </Link>

      {/* 3. SECCIÓN DE PRECIO Y BOTÓN (footer de la tarjeta) */}
      <div className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          {/* Contenedor del precio con altura fija para evitar que empuje al botón */}
          <div className="h-12 md:h-auto">
            <span className="break-all text-lg md:text-xl font-bold text-emerald-400 w-full">${price}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`w-full md:w-auto text-white px-3 py-2 rounded-md font-semibold transition-colors text-sm ${
              stock > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            {stock > 0 ? 'Agregar' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;