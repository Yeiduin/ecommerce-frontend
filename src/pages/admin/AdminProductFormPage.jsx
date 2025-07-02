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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    
    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };
console.log('FRONTEND: Datos que se van a enviar ->', dataToSend);

    try {
      if (isEditing) {
        await axios.put(`http://localhost:4000/api/products/${id}`, dataToSend, config);
        toast.success('¡Producto actualizado con éxito!', { id: toastId });
      } else {
        await axios.post('http://localhost:4000/api/products', dataToSend, config);
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
        {(isEditing && !product) ? (
          <p>Cargando datos del producto...</p>
        ) : (
          <ProductForm 
            onSubmit={handleFormSubmit} 
            initialData={product} 
            isEditing={isEditing}
            categories={categories}
            cloudinaryCloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
            cloudinaryApiKey={import.meta.env.VITE_CLOUDINARY_API_KEY}
          />
        )}
      </div>
    </div>
  );
}
export default AdminProductFormPage;