// src/components/admin/ProductForm.jsx
import { useState, useEffect } from "react";

// Recibe 3 props: la función a ejecutar al enviar, los datos iniciales, y un booleano si está en modo edición
function ProductForm({ onSubmit, initialData = null, isEditing = false, categories = [] }) {
  const [product, setProduct] = useState({
    name: '', description: '', price: '', category: '', stock: '', image: '',
  });

  useEffect(() => {
    // Si estamos editando y ya llegaron los datos iniciales
    if (isEditing && initialData) {
      setProduct({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        // Guardamos solo el ID de la categoría en nuestro estado
        category: initialData.category?._id || '', 
        stock: initialData.stock || '',
        image: initialData.image || '',
      });
    } 
    // Si estamos creando y ya tenemos la lista de categorías
    else if (!isEditing && categories.length > 0) {
      // Seleccionamos la primera categoría de la lista por defecto
      setProduct(prevState => ({ ...prevState, category: categories[0]._id }));
    }
  }, [initialData, isEditing, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Nombre */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300"
        >
          Nombre del Producto
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={product.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."
        />
      </div>

      {/* Campo Descripción */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300"
        >
          Descripción
        </label>
        <textarea
          name="description"
          id="description"
          rows="3"
          value={product.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."
        ></textarea>
      </div>

      {/* Campos Precio y Stock en una fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Precio
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={product.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."
          />
        </div>
        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-300"
          >
            Stock
          </label>
          <input
            type="number"
            name="stock"
            id="stock"
            value={product.stock}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."
          />
        </div>
      </div>

      {/* Campos Categoría e Imagen en una fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">Categoría</label>
          <select 
            name="category" 
            id="category" 
            value={product.category} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="" disabled>Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300">URL de la Imagen</label>
          <input type="text" name="image" id="image" value={product.image} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white ..."/>
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-bold transition-colors">
          {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
