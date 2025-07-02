// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  const { _id, name, image, price, category, stock, brand } = product;
  
  const addItemToCart = useCartStore((state) => state.addItem);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group flex flex-col">
      <Link to={`/producto/${_id}`} className="flex-grow">
        <div className="relative">
          {/* --- CORRECCIÓN DE IMAGEN --- */}
          {/* Cambiamos 'object-cover' por 'object-contain' para que la imagen se vea completa */}
          {/* y le damos una altura fija y un color de fondo al contenedor. */}
          <div className="h-56 w-full bg-slate-700 flex items-center justify-center">
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
        <div className="p-4">
          {/* --- NUEVA LÍNEA PARA LA MARCA --- */}
          <p className="text-xs text-emerald-400 font-semibold uppercase mb-1">{brand}</p>
          <h3 className="text-lg font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{name}</h3>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-emerald-400">${price}</span>
          <button 
            onClick={() => {
              addItemToCart(product);
              toast.success(`${product.name} añadido al carrito!`);
            }}
            disabled={stock === 0}
            className={`text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
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