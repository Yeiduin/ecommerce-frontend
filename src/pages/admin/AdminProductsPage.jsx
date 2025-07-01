// src/pages/admin/AdminProductsPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        toast.error('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:4000/api/products/${productId}`, config);
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Producto eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        toast.error(error.response?.data?.message || 'Error al eliminar el producto.');
      }
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Productos</h1>
        <Link to="/admin/productos/nuevo">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded">
            + Añadir Producto
          </button>
        </Link>
      </div>

      <div className="bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">Producto</th>
              <th scope="col" className="px-6 py-3">Categoría</th>
              <th scope="col" className="px-6 py-3">Precio</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{product.name}</th>

                {/* ===== AQUÍ ESTÁ LA CORRECCIÓN CLAVE ===== */}
                <td className="px-6 py-4">{product.category?.name || 'Sin categoría'}</td>

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
    </div>
  );
}

export default AdminProductsPage;