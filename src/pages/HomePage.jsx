// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

// ELIMINAMOS EL COMPONENTE ShortcutSection DE AQUÍ

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
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

  const productSliderSettings = {
    dots: true,
    infinite: true,      // CORREGIDO: Debe ser true para un bucle infinito
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,      // AÑADIDO: Activa la rotación automática
    autoplaySpeed: 4000, // AÑADIDO: Velocidad de rotación
    pauseOnHover: false, // CORREGIDO: No se detiene al pasar el mouse
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
       {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      }
    ]
  };

  return (
    // Ajustamos el espacio entre secciones
    <div className="space-y-16">
      <Hero />
      
      {/* HEMOS ELIMINADO LA SECCIÓN DE ATAJOS DE AQUÍ */}

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Novedades</h2>

        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <>
            {featuredProducts.length > 0 && (
              <Slider {...productSliderSettings}>
                {featuredProducts.map(product => (
                  <div key={product._id} className="px-2 h-full"> {/* Aseguramos altura completa para el slide */}
                    <ProductCard product={product} />
                  </div>
                ))}
              </Slider>
            )}
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