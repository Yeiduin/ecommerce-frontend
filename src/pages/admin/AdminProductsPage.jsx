// src/pages/admin/AdminProductsPage.jsx

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import Pagination from '../../components/ui/Pagination'; // Importamos nuestro nuevo componente

function AdminProductsPage() {
  // Estados para los datos y la UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  
  // Estados para los filtros
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Hook para manejar los parámetros de la URL
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuthStore();

  // Efecto para obtener las listas de categorías y marcas para los filtros
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
        toast.error("No se pudieron cargar los filtros.");
      }
    };
    fetchFilters();
  }, []);

  // Efecto principal para obtener los productos cada vez que cambian los filtros/página
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Pasamos todos los parámetros de la URL a nuestra API
        const { data } = await axios.get(`http://localhost:4000/api/products?${searchParams.toString()}`);
        setProducts(data.products);
        setPagination({
          currentPage: data.page,
          totalPages: data.pages,
          totalProducts: data.total,
        });
      } catch (error) {
        toast.error('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:4000/api/products/${productId}`, config);
        toast.success('Producto eliminado con éxito');
        // Refrescamos la lista de productos actualizando los searchParams para disparar el useEffect
        setSearchParams(new URLSearchParams(searchParams));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error al eliminar el producto.');
      }
    }
  };

  // Función para manejar los cambios en los filtros, búsqueda y ordenamiento
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Siempre reseteamos a la página 1 al cambiar un filtro
    setSearchParams(newParams);
  };
  
  // Función para cambiar de página
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    setSearchParams(newParams);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Productos</h1>
        <Link to="/admin/productos/nuevo" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded">
          + Añadir Producto
        </Link>
      </div>

      {/* SECCIÓN DE FILTROS Y BÚSQUEDA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-slate-800 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Buscar por nombre, marca..."
          defaultValue={searchParams.get('search') || ''}
          // Usamos onKeyUp para buscar mientras se escribe, pero con un debounce sería mejor en una app real
          onKeyUp={(e) => { if (e.key === 'Enter') handleFilterChange('search', e.target.value) }}
          className="bg-slate-700 p-2 rounded w-full placeholder-gray-400"
        />
        <select onChange={(e) => handleFilterChange('category', e.target.value)} value={searchParams.get('category') || ''} className="bg-slate-700 p-2 rounded w-full">
          <option value="">Todas las Categorías</option>
          {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
        </select>
        <select onChange={(e) => handleFilterChange('brand', e.target.value)} value={searchParams.get('brand') || ''} className="bg-slate-700 p-2 rounded w-full">
          <option value="">Todas las Marcas</option>
          {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
        <select onChange={(e) => handleFilterChange('sort', e.target.value)} value={searchParams.get('sort') || ''} className="bg-slate-700 p-2 rounded w-full">
          <option value="">Ordenar por...</option>
          <option value="createdAt-desc">Más Recientes</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <>
          <div className="bg-slate-800 shadow-md rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Producto</th>
                  <th scope="col" className="px-6 py-3">Categoría</th>
                  <th scope="col" className="px-6 py-3">Marca</th>
                  <th scope="col" className="px-6 py-3">Precio</th>
                  <th scope="col" className="px-6 py-3">Stock</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{product.name}</th>
                    <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <Link to={`/admin/productos/editar/${product._id}`} className="font-medium text-blue-500 hover:underline">Editar</Link>
                      <button onClick={() => handleDelete(product._id)} className="font-medium text-red-500 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default AdminProductsPage;