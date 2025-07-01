// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';

function HomePage() {
  // 1. Creamos un estado para guardar la lista de productos
  const [products, setProducts] = useState([]);
  // Un estado extra para saber si estamos cargando los datos
  const [loading, setLoading] = useState(true);

  // 2. Usamos useEffect para hacer la petición a la API cuando el componente carga
  useEffect(() => {
    // Definimos una función async dentro del useEffect para poder usar await
    const fetchProducts = async () => {
      try {
        // Hacemos la petición GET a nuestro backend
        const response = await axios.get('http://localhost:4000/api/products');
        // Guardamos los productos en nuestro estado
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        // Cuando la petición termina (con éxito o error), dejamos de cargar
        setLoading(false);
      }
    };

    fetchProducts(); // Llamamos a la función
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez

  // 3. Mostramos un mensaje de carga mientras esperamos la respuesta
  if (loading) {
    return <p className="text-center text-lg">Cargando productos...</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Nuestro Producto</h1>
      {/* 4. Mapeamos el estado 'products' para renderizar las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          // Usamos el componente ProductCard, le pasamos el producto y una 'key' única
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;