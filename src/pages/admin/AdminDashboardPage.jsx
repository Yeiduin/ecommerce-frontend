// src/pages/admin/AdminDashboardPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../stores/authStore";
import {
  FaMoneyBillWave,
  FaBoxOpen,
  FaUsers,
  FaTags,
  FaTicketAlt,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCogs,
  FaLock,
} from "react-icons/fa";
import toast from "react-hot-toast";

// Componente para las tarjetas de resumen principales
const SummaryCard = ({ icon, title, value, color }) => (
  <div className={`bg-slate-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// Componente para las tarjetas de desglose de estado
const StatusCard = ({ icon, title, value, color }) => (
  <div className={`bg-slate-800 p-4 rounded-lg shadow-md flex justify-between items-center ${color}`}>
    <div className="flex items-center space-x-3">
      <div className="text-xl">{icon}</div>
      <span className="text-white font-medium">{title}</span>
    </div>
    <span className="text-xl font-bold text-white bg-slate-700 px-3 py-1 rounded-full">{value}</span>
  </div>
);

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get("http://localhost:4000/api/summary", config);
        setSummary(data);
      } catch (error) {
        toast.error("No se pudo cargar el resumen del dashboard.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  if (loading) {
    return <p className="text-center text-lg">Cargando dashboard...</p>;
  }

  if (!summary) {
    return <p className="text-center text-lg text-red-500">No se pudo cargar la información.</p>;
  }

  // Datos para el desglose de pedidos
  const orderStatusDetails = [
    { title: "Pendiente", value: summary.orderStatusCounts?.Pendiente, icon: <FaHourglassHalf className="text-yellow-400"/> },
    { title: "Enviado", value: summary.orderStatusCounts?.Enviado, icon: <FaShippingFast className="text-blue-400"/> },
    { title: "Entregado", value: summary.orderStatusCounts?.Entregado, icon: <FaCheckCircle className="text-green-400"/> },
    { title: "Cancelado", value: summary.orderStatusCounts?.Cancelado, icon: <FaTimesCircle className="text-red-400"/> },
  ];

  // Datos para el desglose de tickets
  const ticketStatusDetails = [
    { title: "Abierto", value: summary.ticketStatusCounts?.Abierto, icon: <FaBoxOpen className="text-yellow-400"/> },
    { title: "En Proceso", value: summary.ticketStatusCounts?.['En proceso'], icon: <FaCogs className="text-blue-400"/> },
    { title: "Cerrado", value: summary.ticketStatusCounts?.Cerrado, icon: <FaLock className="text-green-400"/> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>

      {/* Tarjetas de Resumen Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          icon={<FaMoneyBillWave className="text-green-500" />}
          title="Ingresos (Entregados)"
          value={new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(summary.totalRevenue)}
          color="border-green-500"
        />
        <SummaryCard
          icon={<FaBoxOpen className="text-blue-500" />}
          title="Pedidos Activos"
          value={summary.totalActiveOrders}
          color="border-blue-500"
        />
        <SummaryCard
          icon={<FaUsers className="text-yellow-500" />}
          title="Total de Usuarios"
          value={summary.totalUsers}
          color="border-yellow-500"
        />
        <SummaryCard
          icon={<FaTags className="text-purple-500" />}
          title="Total de Productos"
          value={summary.totalProducts}
          color="border-purple-500"
        />
      </div>

      {/* Secciones de Desglose */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Desglose de Pedidos */}
        <div className="bg-slate-900 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center"><FaShippingFast className="mr-2"/>Estado de Pedidos</h2>
          <div className="space-y-3">
            {orderStatusDetails.map(item => (
              <StatusCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        {/* Desglose de Tickets */}
        <div className="bg-slate-900 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center"><FaTicketAlt className="mr-2"/>Tickets de Soporte</h2>
          <div className="space-y-3">
            {ticketStatusDetails.map(item => (
              <StatusCard key={item.title} {...item} />
            ))}
             <div className="text-right mt-4">
                <p className="text-gray-400">Total de Tickets: <span className="font-bold text-white">{summary.totalTickets}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;