// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

// Ahora recibe una prop 'adminOnly' que por defecto es false
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuthStore();

  // Si no hay usuario, siempre redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere admin y el usuario no lo es, redirige al inicio
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si pasa todas las validaciones, muestra el contenido
  return children;
}

export default ProtectedRoute;