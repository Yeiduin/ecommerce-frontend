// src/components/admin/ProductForm.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function ProductForm({ onSubmit, initialData = null, isEditing = false, categories = [], cloudinaryCloudName, cloudinaryApiKey }) {
  // Estado para todos los campos del formulario del producto
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    description: '',
    price: '', // Usamos strings vacíos para que los campos se muestren vacíos
    stock: '',
    category: '',
    image: '',
  });

  // Estado para mostrar feedback al usuario mientras sube una imagen
  const [isUploading, setIsUploading] = useState(false);
  
  // Obtenemos el token del store para autorizar la petición de firma
  const { token } = useAuthStore();

  // Efecto para poblar el formulario con datos existentes si estamos en modo "Editar"
  useEffect(() => {
    if (isEditing && initialData) {
      setProduct({
        name: initialData.name || '',
        brand: initialData.brand || '',
        description: initialData.description || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        category: initialData.category?._id || '',
        image: initialData.image || '',
      });
    } else if (!isEditing && categories.length > 0) {
      // Si estamos creando, seleccionamos la primera categoría por defecto
      if (!product.category) {
        setProduct(prevState => ({ ...prevState, category: categories[0]._id }));
      }
    }
  }, [initialData, isEditing, categories]);

  // Manejador para actualizar el estado cuando el usuario escribe en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  // Función completa para manejar la subida de la imagen
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Subiendo imagen...');

    try {
      // 1. Pedimos la firma a nuestro backend
      const signatureResponse = await axios.get('http://localhost:4000/api/upload/signature', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Preparamos los datos para enviar a Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', cloudinaryApiKey);
      formData.append('timestamp', signatureResponse.data.timestamp);
      formData.append('signature', signatureResponse.data.signature);
      
      // 3. Hacemos la petición POST directamente a la API de Cloudinary
      const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, formData);
      
      // 4. Actualizamos el estado de nuestro producto con la nueva URL segura de la imagen
      setProduct(prevState => ({ ...prevState, image: cloudinaryResponse.data.secure_url }));
      
      toast.success('¡Imagen subida con éxito!', { id: toastId });
    } catch (error) {
      toast.error('Error al subir la imagen.', { id: toastId });
      console.error('Error en Cloudinary:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Manejador para enviar el formulario completo con validación
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.category || !product.price || !product.stock || !product.name || !product.brand || !product.description) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return; 
    }
    onSubmit(product);
  };

  // Clases de Tailwind para reutilizar en los inputs y labels
  const inputClasses = "mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500";
  const labelClasses = "block text-sm font-medium text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClasses}>Nombre del Producto</label>
        <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className={inputClasses}/>
      </div>

      <div>
        <label htmlFor="brand" className={labelClasses}>Marca</label>
        <input type="text" name="brand" id="brand" value={product.brand} onChange={handleChange} required className={inputClasses}/>
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>Descripción</label>
        <textarea name="description" id="description" rows="3" value={product.description} onChange={handleChange} required className={inputClasses}></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className={labelClasses}>Precio</label>
          <input type="number" name="price" id="price" value={product.price} onChange={handleChange} required className={inputClasses} step="0.01" min="0"/>
        </div>
        <div>
          <label htmlFor="stock" className={labelClasses}>Stock</label>
          <input type="number" name="stock" id="stock" value={product.stock} onChange={handleChange} required className={inputClasses} min="0"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className={labelClasses}>Categoría</label>
          <select name="category" id="category" value={product.category} onChange={handleChange} required className={inputClasses}>
            <option value="" disabled>Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Imagen del Producto</label>
          <div className="mt-2 flex items-center space-x-6">
            <div className="shrink-0">
              {product.image ? (
                <img className="h-20 w-20 object-cover rounded-md" src={product.image} alt="Vista previa" />
              ) : (
                <div className="h-20 w-20 bg-slate-700 rounded-md flex items-center justify-center text-gray-400 text-xs text-center">Sin imagen</div>
              )}
            </div>
            <label className="block">
              <span className="sr-only">Elegir foto de perfil</span>
              <input type="file" onChange={handleImageUpload} accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
            </label>
            {isUploading && <p className="text-xs text-yellow-400">Subiendo...</p>}
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button type="submit" disabled={isUploading} className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
          {isUploading ? 'Espere...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;