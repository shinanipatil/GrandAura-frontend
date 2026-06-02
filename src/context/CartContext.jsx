import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (dish, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.dish_id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.dish_id === dish.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { dish_id: dish.id, name: dish.name, price: dish.price, image: dish.image, quantity }];
    });
  };

  const updateQuantity = (dishId, quantity) => {
    if (quantity < 1) {
      removeItem(dishId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.dish_id === dishId ? { ...i, quantity } : i)));
  };

  const removeItem = (dishId) => {
    setItems((prev) => prev.filter((i) => i.dish_id !== dishId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
