
import React, { createContext, useContext, useState, useEffect } from "react";

// Define our types
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  timestamp: Date;
};

export type Order = {
  id: string;
  customerName: string;
  tableNumber: string; // Changed from roomNumber to tableNumber
  items: OrderItem[];
  status: "pending" | "confirmed" | "completed" | "cancelled";
  timestamp: Date;
  total: number;
};

// Our context type
type HotelContextType = {
  menuItems: MenuItem[];
  orders: Order[];
  cart: OrderItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addToCart: (menuItemId: string, quantity: number, specialInstructions?: string) => void;
  removeFromCart: (orderItemId: string) => void;
  updateCartItem: (orderItemId: string, quantity: number, specialInstructions?: string) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, tableNumber: string) => Order; // Changed parameter name
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
};

// Create the context
const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Sample menu items
const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and our special sauce",
    price: 15.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVyZ2VyfGVufDB8fDB8fHww",
  },
  {
    id: "2",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomatoes, and basil on our homemade crust",
    price: 18.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGl6emF8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, croutons, parmesan, and Caesar dressing",
    price: 12.99,
    category: "Starter",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Flc2FyJTIwc2FsYWR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 9.99,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1617305855058-336d9ce3eb2a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwbGF2YSUyMGNha2V8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "5",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet, grilled to perfection with lemon herb butter",
    price: 24.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JpbGxlZCUyMHNhbG1vbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "6",
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
    price: 10.99,
    category: "Starter",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FwcmVzZSUyMHNhbGFkfGVufDB8fDB8fHww",
  }
];

// Provider component
export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Add a new menu item
  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    setMenuItems([...menuItems, newItem]);
  };

  // Update a menu item
  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenuItems(
      menuItems.map((menuItem) =>
        menuItem.id === id ? { ...menuItem, ...item } : menuItem
      )
    );
  };

  // Delete a menu item
  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  // Add an item to the cart
  const addToCart = (menuItemId: string, quantity: number, specialInstructions?: string) => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      menuItemId,
      quantity,
      specialInstructions,
      timestamp: new Date(),
    };
    setCart([...cart, newItem]);
  };

  // Remove an item from the cart
  const removeFromCart = (orderItemId: string) => {
    setCart(cart.filter((item) => item.id !== orderItemId));
  };

  // Update a cart item
  const updateCartItem = (orderItemId: string, quantity: number, specialInstructions?: string) => {
    setCart(
      cart.map((item) =>
        item.id === orderItemId
          ? { ...item, quantity, specialInstructions }
          : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Place an order
  const placeOrder = (customerName: string, tableNumber: string): Order => { // Changed parameter name
    const total = cart.reduce((sum, item) => {
      const menuItem = menuItems.find((menu) => menu.id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      tableNumber, // Changed from roomNumber to tableNumber
      items: [...cart],
      status: "pending",
      timestamp: new Date(),
      total,
    };

    setOrders([...orders, newOrder]);
    clearCart();
    return newOrder;
  };

  // Update an order's status
  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <HotelContext.Provider
      value={{
        menuItems,
        orders,
        cart,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

// Custom hook to use the context
export const useHotel = () => {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};
