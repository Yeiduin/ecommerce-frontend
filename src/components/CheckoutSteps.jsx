// src/components/CheckoutSteps.jsx
import { Link } from 'react-router-dom';

function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <nav className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8 text-xs sm:text-sm">
      <div>
        {step1 ? (
          <span className="text-emerald-400 font-semibold">Iniciar Sesión</span>
        ) : (
          <span className="text-gray-500 cursor-not-allowed">Iniciar Sesión</span>
        )}
      </div>
      <span className="text-gray-500">&gt;</span>
      <div>
        {step2 ? (
          <Link to='/envio' className="text-emerald-400 font-semibold">Envío</Link>
        ) : (
          <span className="text-gray-500 cursor-not-allowed">Envío</span>
        )}
      </div>
      <span className="text-gray-500">&gt;</span>
      <div>
        {step3 ? (
          <Link to='/pago' className="text-emerald-400 font-semibold">Pago</Link>
        ) : (
          <span className="text-gray-500 cursor-not-allowed">Pago</span>
        )}
      </div>
      <span className="text-gray-500">&gt;</span>
      <div>
        {step4 ? (
          <Link to='/realizar-pedido' className="text-emerald-400 font-semibold">Realizar Pedido</Link>
        ) : (
          <span className="text-gray-500 cursor-not-allowed">Realizar Pedido</span>
        )}
      </div>
    </nav>
  );
}

export default CheckoutSteps;