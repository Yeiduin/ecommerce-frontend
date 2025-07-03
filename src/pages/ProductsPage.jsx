// src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/ui/Pagination.jsx';

function ProductsPage() {
  // Estado para los datos y la UI
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Estado para el ordenamiento
  const [sort, setSort] = useState('relevance');
  
  // Hook para leer y escribir en los parámetros de la URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Efecto para obtener las listas de filtros (categorías y marcas)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get('http://localhost:4000/api/categories'),
          axios.get('http://localhost:4000/api/products/brands')
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (error) {
        console.error("No se pudieron cargar los filtros", error);
      }
    };
    fetchFilters();
  }, []);

  // Efecto principal para obtener los productos
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
        
        const { data } = await axios.get(`http://localhost:4000/api/products?${params.toString()}`);
        
        setProducts(data.products);
        setPagination({
          currentPage: data.page,
          totalPages: data.pages,
          totalProducts: data.total,
        });
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, sort]);

  // ===== FUNCIÓN CORREGIDA Y DEFINITIVA =====
  const handleFilterChange = (filterType, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Al hacer clic en un filtro de categoría o marca, SIEMPRE borramos la búsqueda anterior.
    newSearchParams.delete('search');

    if (value === 'Todos') {
      newSearchParams.delete(filterType);
    } else {
      newSearchParams.set(filterType, value);
    }
    
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };
  
  // Función para cambiar de página (sin cambios)
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    setSearchParams(newParams);
  };
  
  // Leemos los filtros actuales de la URL para el estado de la UI
  const currentCategory = searchParams.get('category') || 'Todos';
  const currentBrand = searchParams.get('brand') || 'Todos';
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
                <li><button onClick={() => handleFilterChange('category', 'Todos')} className={`w-full text-left transition-colors ${currentCategory === 'Todos' ? 'text-emerald-400 font-bold' : 'text-gray-300 hover:text-emerald-400'}`}>Todas</button></li>
                {categories.map(cat => (
                  <li key={cat._id}>
                    <button onClick={() => handleFilterChange('category', cat.name)} className={`w-full text-left transition-colors ${currentCategory.toLowerCase() === cat.name.toLowerCase() ? 'text-emerald-400 font-bold' : 'text-gray-300 hover:text-emerald-400'}`}>{cat.name}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Marcas</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleFilterChange('brand', 'Todos')} className={`w-full text-left transition-colors ${currentBrand === 'Todos' ? 'text-emerald-400 font-bold' : 'text-gray-300 hover:text-emerald-400'}`}>Todas</button></li>
                {brands.map(brand => (
                  <li key={brand}>
                    <button onClick={() => handleFilterChange('brand', brand)} className={`w-full text-left transition-colors ${currentBrand.toLowerCase() === brand.toLowerCase() ? 'text-emerald-400 font-bold' : 'text-gray-300 hover:text-emerald-400'}`}>{brand}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-gray-400 text-sm">{pagination.totalProducts || 0} {pagination.totalProducts === 1 ? 'resultado' : 'resultados'}</p>
            <div>
              <label htmlFor="sort" className="mr-2 text-sm">Ordenar por:</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="bg-slate-700 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                <option value="relevance">Relevancia</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center py-20">Cargando productos...</p>
          ) : error ? (
            <p className="text-center py-20 text-red-500">{error}</p>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20"><p className="text-gray-400">No se encontraron productos que coincidan con tus filtros.</p></div>
              )}

              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductsPage;