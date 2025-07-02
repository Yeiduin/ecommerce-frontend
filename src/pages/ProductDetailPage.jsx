// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';

function ProductDetailPage() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Forma correcta y segura de obtener la acción
  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(data);
      } catch (error) { 
        console.error("Error al obtener el producto:", error);
        toast.error('No se pudo cargar el producto.');
      } 
      finally { 
        setLoading(false); 
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItemToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} añadido(s) al carrito!`);
  };

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    if (product && value > product.stock) {
      value = product.stock;
    }
    setQuantity(value);
  }

  if (loading || !product) { 
    return <p className="text-center py-20">Cargando...</p>; 
  }

  return (
    <div className="py-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img src={product.image || 'https://via.placeholder.com/800x600'} alt={`Imagen de ${product.name}`} className="w-full rounded-lg shadow-lg sticky top-28"/>
        </div>
        <div className="space-y-6">
          <div>
            <Link to={`/tienda?brand=${product.brand}`} className="text-lg text-emerald-400 font-semibold hover:underline">{product.brand}</Link>
            <h1 className="text-4xl font-extrabold text-white mt-1">{product.name}</h1>
          </div>
          <p className="text-lg text-gray-400">Categoría: <span className="font-semibold text-white capitalize">{product.category?.name || 'N/A'}</span></p>
          <p className="text-4xl font-bold text-emerald-400">${product.price}</p>
          <div>
            <h3 className="font-bold text-xl border-b border-slate-700 pb-2 mb-3">Descripción</h3>
            <p className="text-gray-300 leading-relaxed">{product.description || "No hay descripción disponible."}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-300">Disponibilidad:</p>
                <p className={`font-bold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `En Stock (${product.stock})` : 'Agotado'}
                </p>
              </div>
              {product.stock > 0 && (
                <div>
                  <label htmlFor="quantity" className="font-semibold text-gray-300">Cantidad:</label>
                  <div className="flex items-center mt-1">
                    <input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} min="1" max={product.stock} className="w-20 bg-slate-700 text-center rounded-md p-2"/>
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0} className={`w-full mt-6 text-white py-3 rounded-lg font-bold transition-colors text-lg ${ product.stock > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500 cursor-not-allowed'}`}>
              {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-16 border-t border-slate-700 pt-8">
        <h2 className="text-2xl font-bold text-center">Detalles Adicionales</h2>
        <p className="text-center text-gray-500 mt-4">(Aquí irán las valoraciones de usuarios y especificaciones técnicas)</p>
      </div>
    </div>
  );
}

export default ProductDetailPage;