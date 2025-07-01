// src/pages/admin/AdminProductFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import ProductForm from '../../components/admin/ProductForm';

function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); // El estado para las categorías
  const [loading, setLoading] = useState(true); // Estado de carga general
  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos las dos peticiones en paralelo para más eficiencia
        const categoriesPromise = axios.get('http://localhost:4000/api/categories');
        const productPromise = isEditing ? axios.get(`http://localhost:4000/api/products/${id}`) : Promise.resolve(null);

        const [categoriesResponse, productResponse] = await Promise.all([categoriesPromise, productPromise]);

        setCategories(categoriesResponse.data);
        if (productResponse) {
          setProduct(productResponse.data);
        }
      } catch (error) {
        toast.error('No se pudieron cargar los datos necesarios.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleFormSubmit = async (formData) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const toastId = toast.loading('Guardando producto...');
    try {
      if (isEditing) {
        await axios.put(`http://localhost:4000/api/products/${id}`, formData, config);
        toast.success('¡Producto actualizado con éxito!', { id: toastId });
      } else {
        await axios.post('http://localhost:4000/api/products', formData, config);
        toast.success('¡Producto creado con éxito!', { id: toastId });
      }
      navigate('/admin/productos');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ocurrió un error.', { id: toastId });
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h1>
      <div className="bg-slate-800 p-8 rounded-lg">
        <ProductForm 
          onSubmit={handleFormSubmit} 
          initialData={product} 
          isEditing={isEditing}
          categories={categories} // Pasamos las categorías al formulario
        />
      </div>
    </div>
  );
}

export default AdminProductFormPage;