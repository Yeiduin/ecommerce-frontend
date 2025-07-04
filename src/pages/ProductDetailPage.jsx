// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const StarRating = ({ rating, numReviews }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-2">
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
        {halfStar && <span>☆</span>}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-500">★</span>)}
      </div>
      {numReviews > 0 && (
          <span className="text-gray-400 text-sm">({numReviews} {numReviews === 1 ? 'reseña' : 'reseñas'})</span>
      )}
    </div>
  );
};

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItemToCart = useCartStore((state) => state.addItem);
  
  const { user, token } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:4000/api/products/${id}`);
      setProduct(data);
    } catch (error) { 
      console.error("Error al obtener el producto:", error);
      toast.error('No se pudo cargar el producto.');
    } finally { 
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchProduct();
  }, [id]);
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
        toast.error('Por favor, selecciona una calificación.');
        return;
    }
    setIsSubmitting(true);
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const reviewData = { rating, comment };
        await axios.post(`http://localhost:4000/api/products/${id}/reviews`, reviewData, config);
        
        toast.success('¡Gracias por tu reseña!');
        setRating(0);
        setComment('');
        fetchProduct();
    } catch (error) {
        toast.error(error.response?.data?.message || 'No se pudo enviar la reseña.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addItemToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} añadido(s) al carrito!`);
  };

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) value = 1;
    if (product && value > product.stock) value = product.stock;
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
            <div className="mt-3">
              <StarRating rating={product.rating} numReviews={product.numReviews} />
            </div>
          </div>
          <p className="text-4xl font-bold text-emerald-400">${product.price}</p>
          <div>
            <h3 className="font-bold text-xl border-b border-slate-700 pb-2 mb-3">Descripción</h3>
            <p className="text-gray-300 leading-relaxed">{product.description || "No hay descripción disponible."}</p>
          </div>
          
          {/* --- BLOQUE DE CÓDIGO RESTAURADO --- */}
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
          {/* --- FIN DEL BLOQUE RESTAURADO --- */}

        </div>
      </div>
      
      <div className="mt-16 border-t border-slate-700 pt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Reseñas de Clientes</h2>
          {product.reviews.length === 0 ? (
            <p className="text-gray-400">Este producto aún no tiene reseñas. ¡Sé el primero!</p>
          ) : (
            <div className="space-y-6">
              {product.reviews.map(review => (
                <div key={review._id} className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <strong className="text-white">{review.name}</strong>
                    <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <StarRating rating={review.rating} numReviews={0} />
                  <p className="text-gray-300 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Escribe tu Reseña</h2>
          {user ? (
            <form onSubmit={handleReviewSubmit} className="bg-slate-800 p-6 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Calificación</label>
                <div className="flex space-x-1 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} onClick={() => setRating(star)} className={star <= rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300">Comentario</label>
                <textarea id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
              </button>
            </form>
          ) : (
            <p className="text-gray-400">
              Por favor, <Link to="/login" className="text-emerald-400 underline">inicia sesión</Link> para dejar una reseña.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;