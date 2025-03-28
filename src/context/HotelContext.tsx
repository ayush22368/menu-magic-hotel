
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
  tableNumber: string;
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
  placeOrder: (customerName: string, tableNumber: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
};

// Create the context
const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Sample menu items with Indian dishes
const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Butter Chicken",
    description: "Tender chicken cooked in a rich, creamy tomato sauce with butter and spices",
    price: 350,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnV0dGVyJTIwY2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "2",
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in a spiced tomato gravy",
    price: 300,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuZWVyJTIwdGlra2F8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "3",
    name: "Masala Dosa",
    description: "Crispy rice pancake filled with spiced potato, served with sambar and chutney",
    price: 180,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9zYXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "4",
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in rose flavored sugar syrup",
    price: 120,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1601303516477-408fa5a8a271?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3VsYWIlMjBqYW11bnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "5",
    name: "Biryani",
    description: "Fragrant basmati rice cooked with aromatic spices and your choice of meat or vegetables",
    price: 280,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "6",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas, served with mint chutney",
    price: 80,
    category: "Starter",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftb3NhfGVufDB8fDB8fHww",
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
  const placeOrder = (customerName: string, tableNumber: string): Order => {
    const total = cart.reduce((sum, item) => {
      const menuItem = menuItems.find((menu) => menu.id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      tableNumber,
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
