// src/pages/AboutPage.jsx

function AboutPage() {
  return (
    <div className="py-12 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Sobre BestDeal
          </h1>
          <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
            Tu destino número uno para los mejores periféricos y accesorios de PC. Nacimos de una pasión, y crecimos con una misión: equiparte para la victoria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              BestDeal comenzó en 2024 como el sueño de un grupo de entusiastas del gaming y la tecnología. Frustrados por la dificultad de encontrar componentes de alta calidad a precios justos, decidimos crear la tienda que siempre quisimos como clientes: un lugar con una selección curada de los mejores productos, un servicio al cliente excepcional y una comunidad para gente como nosotros.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Hoy, somos un equipo dedicado a buscar, probar y ofrecer solo lo mejor. Cada teclado, mouse o monitor en nuestro catálogo ha sido seleccionado por su rendimiento, durabilidad y valor.
            </p>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070" // Usamos una imagen de placeholder
              alt="Equipo de BestDeal trabajando" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Nuestra Misión</h2>
          <p className="text-lg text-emerald-400 max-w-4xl mx-auto font-semibold">
            "Empoderar a cada gamer, creador y profesional con las herramientas que necesitan para alcanzar su máximo potencial, ofreciendo la mejor tecnología con un servicio y una comunidad inigualables."
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;