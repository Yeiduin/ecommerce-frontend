// src/pages/admin/AdminProductFormPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import ProductForm from '../../components/admin/ProductForm';

function AdminProductFormPage() {
  // --- Hooks y Estado ---
  const { id } = useParams(); // Obtiene el ID del producto de la URL (si se está editando)
  const navigate = useNavigate();
  const { token } = useAuthStore();
  
  // Estado para los datos del formulario
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Estado para la UI
  const [loading, setLoading] = useState(true);
  const isEditing = Boolean(id); // Determina si estamos en modo "crear" o "editar"

  // --- Lógica de Carga de Datos ---

  // Usamos useCallback para memorizar la función y evitar re-creaciones innecesarias.
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Cargamos todos los datos necesarios en paralelo para mayor eficiencia
      const [categoriesRes, brandsRes, productRes] = await Promise.all([
        axios.get('http://localhost:4000/api/categories'),
        axios.get('http://localhost:4000/api/brands'),
        isEditing ? axios.get(`http://localhost:4000/api/products/${id}`) : Promise.resolve(null)
      ]);
      
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);

      if (productRes) {
        setProduct(productRes.data);
      }
    } catch (error) {
      toast.error('No se pudieron cargar los datos necesarios para el formulario.');
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, [id, isEditing]); // Dependencias del useCallback

  // Efecto para cargar los datos cuando el componente se monta o las dependencias cambian
  useEffect(() => {
    fetchData();
  }, [fetchData]); // La dependencia ahora es la función memorizada

  // --- Manejadores de Eventos ---

  // Función para enviar los datos del formulario (crear o actualizar)
  const handleFormSubmit = async (formData) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const toastId = toast.loading('Guardando producto...');
    
    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

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
      toast.error(error.response?.data?.message || 'Ocurrió un error al guardar.', { id: toastId });
    }
  };
  
  // Función para recargar las listas de categorías y marcas desde el componente hijo.
  const handleListRefresh = async () => {
      await fetchData(); // Simplemente volvemos a ejecutar la carga de datos principal.
  }

  // --- Renderizado ---

  if (loading) {
    return <p className="text-center text-lg">Cargando formulario...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h1>
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
        {/* En modo edición, esperamos a que los datos del producto se carguen antes de renderizar el form */}
        {isEditing && !product ? (
          <p>Cargando datos del producto...</p>
        ) : (
          <ProductForm 
            onSubmit={handleFormSubmit} 
            initialData={product} 
            isEditing={isEditing}
            categories={categories}
            brands={brands}
            onListRefresh={handleListRefresh}
            cloudinaryCloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
            cloudinaryApiKey={import.meta.env.VITE_CLOUDINARY_API_KEY}
          />
        )}
      </div>
    </div>
  );
}
export default AdminProductFormPage;