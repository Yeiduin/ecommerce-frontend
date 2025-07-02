// src/App.jsx
import { Outlet, ScrollRestoration  } from 'react-router-dom'; // 1. Importamos Outlet
import { Toaster } from 'react-hot-toast'; // 1. Importamos Toaster
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  return (
     <div className="bg-slate-900 text-white flex flex-col min-h-screen">
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: { background: '#334155', color: '#fff' },
        }}
      />
      <Header />
      {/* 3. La clase flex-grow en 'main' hace que ocupe todo el espacio disponible,
          empujando el footer hacia abajo. */}
      <main className="container mx-auto p-8 flex-grow">
        <Outlet />
      </main>
      <Footer /> {/* 4. Añadimos nuestro componente Footer al final */}
      <ScrollRestoration />
    </div>
  )
}

export default App;