// src/stores/cartStore.js
import { create } from "zustand";

const getInitialCartState = () => {
  try {
    const cartInfo = localStorage.getItem("cart_info");
    if (!cartInfo) {
      return { items: [], shippingAddress: {}, paymentMethod: "PayPal" };
    }
    const parsedInfo = JSON.parse(cartInfo);
    return {
      items: parsedInfo.items || [],
      shippingAddress: parsedInfo.shippingAddress || {},
      paymentMethod: parsedInfo.paymentMethod || "PayPal",
    };
  } catch (error) {
    console.error("Error al leer el carrito de localStorage", error);
    return { items: [], shippingAddress: {}, paymentMethod: "PayPal" };
  }
};

const updateLocalStorage = (state) => {
  const { items, shippingAddress, paymentMethod } = state;
  localStorage.setItem(
    "cart_info",
    JSON.stringify({ items, shippingAddress, paymentMethod })
  );
};

const useCartStore = create((set) => ({
  items: getInitialCartState().items,
  shippingAddress: getInitialCartState().shippingAddress,
  paymentMethod: getInitialCartState().paymentMethod,

  addItem: (product, qty = 1) =>
    set((state) => {
      const existingItem = state.items.find((item) => item._id === product._id);
      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...product, quantity: qty }];
      }
      const newState = { ...state, items: updatedItems };
      updateLocalStorage(newState);
      return { items: updatedItems };
    }),

  removeItem: (productId) =>
    set((state) => {
      const updatedItems = state.items.filter((item) => item._id !== productId);
      const newState = { ...state, items: updatedItems };
      updateLocalStorage(newState);
      return { items: updatedItems };
    }),

  increaseQuantity: (productId) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      const newState = { ...state, items: updatedItems };
      updateLocalStorage(newState);
      return { items: updatedItems };
    }),

  decreaseQuantity: (productId) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      const newState = { ...state, items: updatedItems };
      updateLocalStorage(newState);
      return { items: updatedItems };
    }),

  saveShippingAddress: (address) =>
    set((state) => {
      const newState = { ...state, shippingAddress: address };
      updateLocalStorage(newState);
      return { shippingAddress: address };
    }),

  savePaymentMethod: (method) =>
    set((state) => {
      const newState = { ...state, paymentMethod: method };
      updateLocalStorage(newState);
      return { paymentMethod: method };
    }),

  clearCart: () =>
    set((state) => {
      const newState = { ...state, items: [] };
      localStorage.setItem(
        "cart_info",
        JSON.stringify({
          items: [],
          shippingAddress: state.shippingAddress,
          paymentMethod: state.paymentMethod,
        })
      );
      return { items: [] };
    }),
}));

export default useCartStore;
