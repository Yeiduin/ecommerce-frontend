// src/components/Hero.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';

function Hero() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // ... (la lógica para obtener banners no cambia)
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/banners');
        setBanners(data);
      } catch (error) {
        console.error("Error al cargar banners", error);
      }
    };
    fetchBanners();
  }, []);

  const settings = {
    // ... (la configuración del slider no cambia)
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    // Aplicamos altura responsiva: 40vh en móvil, 70vh en escritorio
    <div className="relative h-[40vh] md:h-[70vh] rounded-lg overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner._id}>
            {/* Altura responsiva también en cada slide */}
            <div
              className="h-[40vh] md:h-[70vh] bg-cover bg-center"
              style={{ backgroundImage: `url('${banner.imageUrl}')` }}
            />
          </div>
        ))}
      </Slider>

      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center text-white">
        <div className="relative z-10 p-4">
          {/* Tamaño de fuente responsivo */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            La Mejor Oferta en Tecnología
          </h1>
          {/* Párrafo con tamaño de fuente responsivo */}
          <p className="text-base md:text-xl max-w-2xl mx-auto mb-8 text-gray-200 drop-shadow-md">
            Equipa tu setup con los periféricos de más alta calidad al mejor precio del mercado.
          </p>
          <Link 
            to="/tienda" 
            className="bg-emerald-500 text-white font-bold py-3 px-6 md:px-8 rounded-full text-base md:text-lg hover:bg-emerald-600 transition-transform duration-300 transform hover:scale-105"
          >
            Explorar Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;