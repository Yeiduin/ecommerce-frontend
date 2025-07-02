// src/components/Hero.jsx
import { Link } from 'react-router-dom';

function Hero() {
  // Usaremos un estilo en línea para la imagen de fondo para que sea más fácil de configurar.
  const imageUrl = "https://res.cloudinary.com/dpkrrtsdg/image/upload/f_auto,q_auto/v1751406819/assets_task_01jz3ynexteg5aez8mvcgnde25_1751405849_img_1_cnjzuk.webp";

  // El estilo en línea ahora usa nuestra variable imageUrl
  const heroStyle = {
    backgroundImage: `url('${imageUrl}')`
  };

  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white rounded-lg overflow-hidden"
      style={heroStyle}
    >
      {/* Capa oscura semitransparente para que el texto sea más legible */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Contenido del Hero */}
      <div className="relative z-10 p-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
          La Mejor Oferta en Tecnología
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200 drop-shadow-md">
          Equipa tu setup con los periféricos de más alta calidad al mejor precio del mercado.
        </p>
        <Link 
          to="/tienda" 
          className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-emerald-600 transition-transform duration-300 transform hover:scale-105"
        >
          Explorar Tienda
        </Link>
      </div>
    </div>
  );
}

export default Hero;