// src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('relevance');
  
  const [searchParams, setSearchParams] = useSearchParams();

  // useEffect para obtener las categorías de la API (no cambia)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("No se pudieron cargar las categorías para los filtros:", error);
      }
    };
    fetchCategories();
  }, []);

  // useEffect para obtener los productos según los filtros (no cambia)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(searchParams);
        if (sort && sort !== 'relevance') {
          params.set('sort', sort);
        } else {
          params.delete('sort');
        }
        
        const response = await axios.get(`http://localhost:4000/api/products?${params.toString()}`);
        setProducts(response.data);
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, sort]);

  // ===== FUNCIÓN CORREGIDA Y MÁS INTELIGENTE =====
  const handleCategoryChange = (categoryName) => {
    // Creamos una nueva instancia de los parámetros para trabajar con ella
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Eliminamos el parámetro de búsqueda anterior para evitar conflictos
    newSearchParams.delete('search');

    // Establecemos la nueva categoría
    if (categoryName === 'Todos') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', categoryName);
    }
    
    // Actualizamos la URL con los nuevos parámetros
    setSearchParams(newSearchParams);
  };
  
  const currentCategory = searchParams.get('category') || 'Todos';
  const currentSearch = searchParams.get('search') || '';

  return (
    <div>
      <div className="text-center py-5 bg-slate-800 rounded-lg mb-8">
        <h1 className="text-4xl font-extrabold">{currentSearch ? `Resultados para: "${currentSearch}"` : 'Nuestra Tienda'}</h1>
        <p className="text-gray-400 mt-2">Encuentra los mejores periféricos y accesorios para tu PC</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <div className="bg-slate-800 p-4 rounded-lg sticky top-28">
            <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Filtros</h2>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Categorías</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleCategoryChange('Todos')} className={`w-full text-left transition-colors ${currentCategory === 'Todos' && !currentSearch ? 'text-emerald-400 font-bold' : 'text-gray-300 hover:text-emerald-400'}`}>Todos</button></li>
                {categories.map(cat => (
                  <li key={cat._id}>
                    <button onClick={() => handleCategoryChange(cat.name)} className={`w-full text-left transition-colors ${currentCategory.toLowerCase() === cat.name.toLowerCase() ? 'text-emerald-400 font-bold' : 'text-gray-300 hover:text-emerald-400'}`}>{cat.name}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-gray-400 text-sm">{products.length} {products.length === 1 ? 'resultado' : 'resultados'}</p>
            <div>
              <label htmlFor="sort" className="mr-2 text-sm">Ordenar por:</label>
              <select id="sort" className="bg-slate-700 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
          {loading ? (<p className="text-center py-20">Cargando productos...</p>) : error ? (<p className="text-center py-20 text-red-500">{error}</p>) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (<ProductCard key={product._id} product={product} />))}
                </div>
              ) : (
                <div className="text-center py-20"><p className="text-gray-400">No se encontraron productos que coincidan con tus filtros.</p></div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductsPage;