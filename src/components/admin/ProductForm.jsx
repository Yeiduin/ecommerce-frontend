// src/components/admin/ProductForm.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function ProductForm({ 
  onSubmit, 
  initialData = null, 
  isEditing = false, 
  categories = [], 
  brands = [], 
  onListRefresh, 
  cloudinaryCloudName, 
  cloudinaryApiKey 
}) {
  // --- Estado del Componente ---
  const { token } = useAuthStore();
  
  // Estado para manejar todos los campos del producto
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
  });

  // Estado para la UI, como la carga de imágenes
  const [isUploading, setIsUploading] = useState(false);

  // --- Efectos (Lifecycle) ---

  // Efecto para inicializar el formulario con datos existentes o valores por defecto
  useEffect(() => {
    if (isEditing && initialData) {
      // MODO EDICIÓN: Rellenamos el formulario con los datos del producto
      setProduct({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        image: initialData.image || '',
        category: initialData.category?._id || '', // Aseguramos usar el ID de la categoría
        brand: initialData.brand || '', // Usamos el nombre de la marca
      });
    } else if (!isEditing) {
      // MODO CREACIÓN: Asignamos valores por defecto si existen
      setProduct(prevState => ({
        ...prevState,
        category: categories.length > 0 ? categories[0]._id : '',
        brand: brands.length > 0 ? brands[0].name : ''
      }));
    }
  }, [initialData, isEditing, categories, brands]);
  
  // --- Manejadores de Eventos ---

  // Actualiza el estado del producto cuando el usuario escribe en un campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  // Maneja la subida de una nueva imagen a Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Subiendo imagen...');

    try {
      const signatureResponse = await axios.get('http://localhost:4000/api/upload/signature', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', cloudinaryApiKey);
      formData.append('timestamp', signatureResponse.data.timestamp);
      formData.append('signature', signatureResponse.data.signature);
      
      const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, formData);
      
      setProduct(prevState => ({ ...prevState, image: cloudinaryResponse.data.secure_url }));
      toast.success('¡Imagen subida con éxito!', { id: toastId });
    } catch (error) {
      toast.error('Error al subir la imagen.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Función genérica para crear una nueva categoría o marca
  const handleCreateNewItem = async (itemType) => {
    const promptMessage = `Introduce el nombre de la nueva ${itemType}:`;
    const newItemName = window.prompt(promptMessage);

    if (!newItemName || newItemName.trim() === '') {
      return; // El usuario canceló o no escribió nada
    }

    const endpoint = itemType === 'categoría' ? 'categories' : 'brands';
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const toastId = toast.loading(`Creando nueva ${itemType}...`);

    try {
      const { data: newItem } = await axios.post(`http://localhost:4000/api/${endpoint}`, { name: newItemName.trim() }, config);
      
      toast.success(`¡${itemType.charAt(0).toUpperCase() + itemType.slice(1)} creada!`, { id: toastId });

      await onListRefresh(); // Refresca las listas en el componente padre

      // Selecciona el nuevo item en el formulario
      if (itemType === 'categoría') {
        setProduct(prevState => ({ ...prevState, category: newItem._id }));
      } else {
        setProduct(prevState => ({ ...prevState, brand: newItem.name }));
      }

    } catch (error) {
      toast.error(error.response?.data?.message || `Error al crear la ${itemType}.`, { id: toastId });
    }
  };

  // Envía el formulario final
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación simple para asegurar que los campos principales no estén vacíos
    if (!product.name || !product.brand || !product.category || !product.price || !product.stock) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return; 
    }
    onSubmit(product);
  };

  // --- Clases de Estilo Reutilizables ---
  const inputClasses = "mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500";
  const labelClasses = "block text-sm font-medium text-gray-300";

  // --- Renderizado del Componente ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campos de texto */}
      <div>
        <label htmlFor="name" className={labelClasses}>Nombre del Producto</label>
        <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className={inputClasses}/>
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>Descripción</label>
        <textarea name="description" id="description" rows="3" value={product.description} onChange={handleChange} required className={inputClasses}></textarea>
      </div>

      {/* Campos numéricos */}
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

      {/* Selectores de Categoría y Marca con botón de añadir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className={labelClasses}>Categoría</label>
          <div className="flex items-center gap-2">
            <select name="category" id="category" value={product.category} onChange={handleChange} required className={inputClasses}>
              <option value="" disabled>Selecciona una categoría</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            <button type="button" onClick={() => handleCreateNewItem('categoría')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-md mt-1" title="Añadir nueva categoría">+</button>
          </div>
        </div>
        <div>
          <label htmlFor="brand" className={labelClasses}>Marca</label>
          <div className="flex items-center gap-2">
            <select name="brand" id="brand" value={product.brand} onChange={handleChange} required className={inputClasses}>
              <option value="" disabled>Selecciona una marca</option>
              {brands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
            </select>
            <button type="button" onClick={() => handleCreateNewItem('marca')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-md mt-1" title="Añadir nueva marca">+</button>
          </div>
        </div>
      </div>

      {/* Carga de Imagen */}
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
      
      {/* Botón de envío */}
      <div className="pt-4">
        <button type="submit" disabled={isUploading} className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
          {isUploading ? 'Espere...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;