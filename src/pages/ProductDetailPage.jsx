// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';

function ProductDetailPage() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) { return <p className="text-center">Cargando...</p>; }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img src={product.image || 'https://via.placeholder.com/800x600'} alt={`Imagen de ${product.name}`} className="w-full rounded-lg shadow-lg" />
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-white mb-4">{product.name}</h1>
        <p className="text-gray-300 mb-6">{product.description || "No hay descripción disponible."}</p>
        {/* ===== CORRECCIÓN AQUÍ ===== */}
        <p className="text-lg text-gray-400 mb-4">Categoría: <span className="font-semibold text-white capitalize">{product.category?.name || 'N/A'}</span></p>
        <div className="flex items-center justify-between bg-slate-800 p-6 rounded-lg">
          <span className="text-3xl font-bold text-emerald-400">${product.price}</span>
          <button 
            onClick={() => {
              addItemToCart(product);
              toast.success(`${product.name} añadido al carrito!`);
            }}
            className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors text-lg"
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;