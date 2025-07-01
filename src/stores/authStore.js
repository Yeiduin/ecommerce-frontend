// src/stores/authStore.js
import { create } from "zustand";

// Función para obtener el estado inicial desde localStorage
const getInitialState = () => {
  try {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : { user: null, token: null };
  } catch (error) {
    console.log("no has iniciado sesion " + error);
    // Si hay un error (ej. JSON malformado), empezamos sin usuario
    return { user: null, token: null };
  }
};

const useAuthStore = create((set) => ({
  // El estado inicial se toma de lo que haya en localStorage
  user: getInitialState().user,
  token: getInitialState().token,

  // Acción para el login: guarda el usuario y el token en el estado Y en localStorage
  login: (userData) => {
    const userInfo = {
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
      token: userData.token,
    };
    localStorage.setItem("user_info", JSON.stringify(userInfo));
    set(userInfo);
  },

  // Acción para el logout: limpia el estado y el localStorage
  logout: () => {
    localStorage.removeItem("user_info");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
