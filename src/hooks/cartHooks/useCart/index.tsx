import { useState } from "react";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<any[]>(() => {
    const savedItems = localStorage.getItem("cartItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const removeItem = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("storage"));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 0) return;

    if (newQuantity === 0) {
      removeItem(index);
    } else {
      const updatedItems = cartItems.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  };

  return {
    cartItems,
    setCartItems,
    removeItem,
    updateQuantity,
  };
};
