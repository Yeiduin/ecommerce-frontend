// src/App.jsx
import { Outlet } from 'react-router-dom'; // 1. Importamos Outlet
import { Toaster } from 'react-hot-toast'; // 1. Importamos Toaster
import Header from './components/Header.jsx';
import './App.css';

function App() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
       <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Estilos para que se vea bien en nuestro tema oscuro
          style: {
            background: '#334155', // bg-slate-700
            color: '#fff',
          },
        }}
      />
      <Header />
      <main className="container mx-auto p-8">
        <Outlet /> {/* 2. Aquí se renderizará el contenido de la página actual */}
      </main>
      {/* En el futuro, aquí podríamos poner un Footer */}
    </div>
  )
}

export default App;