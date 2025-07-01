// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  // Ahora desestructuramos el _id de la categoría para usarlo si es necesario
  const { _id, name, image, price, category } = product;
  const addItemToCart = useCartStore((state) => state.addItem);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group">
      <Link to={`/producto/${_id}`}>
        <img className="w-full h-56 object-cover group-hover:opacity-80 transition-opacity" src={image || 'https://via.placeholder.com/400x300'} alt={`Imagen de ${name}`} />
        <div className="p-4">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{name}</h3>
        </div>
      </Link>
      <div className="p-4 pt-0">
        {/* ===== CORRECCIÓN AQUÍ ===== */}
        {/* Ahora accedemos a category.name para mostrar el texto */}
        <p className="text-sm text-gray-400 capitalize">{category?.name || 'Sin Categoría'}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-emerald-400">${price}</span>
          <button 
            onClick={() => {
              addItemToCart(product);
              toast.success(`${product.name} añadido al carrito!`);
            }}
            className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;