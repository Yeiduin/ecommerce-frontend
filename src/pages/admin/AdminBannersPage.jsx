// ecommerce-frontend/src/pages/admin/AdminBannersPage.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente para cada banner arrastrable
function SortableBanner({ banner, handleDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: banner._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group border-2 border-dashed border-slate-600 rounded-lg p-1 touch-none"
    >
      <img src={banner.imageUrl} alt="Banner" className="rounded-lg w-full" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <button onClick={() => handleDelete(banner._id)} className="bg-red-600 text-white font-bold py-2 px-4 rounded">Eliminar</button>
      </div>
    </div>
  );
}


function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [upImg, setUpImg] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef(null);
  const { token } = useAuthStore();
  const sensors = useSensors(useSensor(PointerSensor));

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/banners');
      setBanners(data);
    } catch (error) {
      toast.error('No se pudieron cargar los banners.');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);
  
  const handleDragEnd = async (event) => {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      const oldIndex = banners.findIndex(b => b._id === active.id);
      const newIndex = banners.findIndex(b => b._id === over.id);
      
      const newOrder = arrayMove(banners, oldIndex, newIndex);
      setBanners(newOrder);

      try {
        const bannerIds = newOrder.map(item => item._id);
        const config = { headers: { Authorization: `Bearer ${token}`}};
        await axios.put('http://localhost:4000/api/banners/order', { bannerIds }, config);
        toast.success('¡Orden actualizado!');
      } catch (error) {
        toast.error('No se pudo guardar el nuevo orden.');
        fetchBanners(); // Revertir al orden original
      }
    }
  };


  // El resto de las funciones (onSelectFile, onImageLoad, etc.) no cambian.
    const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    const aspect = 16 / 6; // Proporción del banner (ajusta si es necesario)
    setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height), width, height));
  };
  
  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob(blob => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            blob.name = fileName;
            resolve(blob);
        }, 'image/jpeg');
    });
  };

  const handleUploadCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsUploading(true);
    const toastId = toast.loading('Subiendo imagen...');

    try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop, 'banner.jpg');
        
        const signatureResponse = await axios.get('http://localhost:4000/api/upload/signature', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const formData = new FormData();
        formData.append('file', croppedImageBlob);
        formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
        formData.append('timestamp', signatureResponse.data.timestamp);
        formData.append('signature', signatureResponse.data.signature);
        
        const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        const { secure_url } = cloudinaryResponse.data;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post('http://localhost:4000/api/banners', { imageUrl: secure_url }, config);

        toast.success('¡Banner añadido con éxito!', { id: toastId });
        fetchBanners();
        setUpImg(null);

    } catch (error) {
        toast.error('Error al subir la imagen.', { id: toastId });
        console.error('Error en Cloudinary:', error);
    } finally {
        setIsUploading(false);
    }
  };

  const handleDelete = async (bannerId) => {
      if (window.confirm('¿Estás seguro?')) {
          try {
              const config = { headers: { Authorization: `Bearer ${token}`}};
              await axios.delete(`http://localhost:4000/api/banners/${bannerId}`, config);
              toast.success('Banner eliminado');
              fetchBanners();
          } catch (error) {
              toast.error('No se pudo eliminar el banner');
          }
      }
  }


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionar Banners del Carrusel</h1>
      <div className="bg-slate-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Añadir Nuevo Banner</h2>
        <input type="file" accept="image/*" onChange={onSelectFile} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 mb-4"/>
        
        {upImg && (
          <div>
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              aspect={16 / 6}
            >
              <img ref={imgRef} src={upImg} onLoad={onImageLoad} />
            </ReactCrop>
            <button onClick={handleUploadCroppedImage} disabled={isUploading} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">
              {isUploading ? 'Subiendo...' : 'Guardar Banner'}
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Banners Actuales</h2>
        <p className="text-sm text-gray-400 mb-4">Arrastra y suelta las imágenes para cambiar su orden.</p>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={banners.map(b => b._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map(banner => (
                <SortableBanner key={banner._id} banner={banner} handleDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default AdminBannersPage;