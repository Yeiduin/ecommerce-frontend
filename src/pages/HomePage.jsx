// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from 'react-router-dom';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // ===== CAMBIO CLAVE AQUÍ =====
        // Ahora llamamos a nuestro nuevo endpoint de productos recientes
        const { data } = await axios.get('http://localhost:4000/api/products/recent');
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error al obtener los productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="space-y-16">
      <Hero />

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Novedades</h2>

        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/tienda" className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-emerald-600 transition-transform duration-300 transform hover:scale-105">
                Ver todos los productos
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default HomePage;