// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

import ProfilePage from './pages/ProfilePage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx'; // Importa la nueva página
import PlaceOrderPage from './pages/PlaceOrderPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';

import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductFormPage from './pages/admin/AdminProductFormPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tienda", element: <ProductsPage /> },
      { path: "producto/:id", element: <ProductDetailPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "registro", element: <RegisterPage /> },
      { path: "sobre-nosotros", element: <AboutPage /> },
      { path: "contacto", element: <ContactPage /> },
      { path: "envio", element: <ProtectedRoute><ShippingPage /></ProtectedRoute> },
      { path: "pago", element: <ProtectedRoute><PaymentPage /></ProtectedRoute> },
      { path: "realizar-pedido", element: <ProtectedRoute><PlaceOrderPage /></ProtectedRoute> },
      { path: "perfil", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: "pedido/:id", element: <ProtectedRoute><OrderDetailPage /></ProtectedRoute> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "productos", element: <AdminProductsPage /> },
      { path: "productos/nuevo", element: <AdminProductFormPage /> },
      { path: "productos/editar/:id", element: <AdminProductFormPage /> },
      { path: "pedidos", element: <AdminOrdersPage /> },
      { path: "usuarios", element: <AdminUsersPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);