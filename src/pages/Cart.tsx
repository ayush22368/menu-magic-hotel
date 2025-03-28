
import React, { useState } from "react";
import { useHotel } from "@/context/HotelContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Cart = () => {
  const { cart, menuItems, removeFromCart, updateCartItem, placeOrder } = useHotel();
  const [customerName, setCustomerName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button 
            onClick={() => navigate("/")} 
            className="bg-hotel-primary hover:bg-hotel-primary/90"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  const getMenuItem = (id: string) => {
    return menuItems.find((item) => item.id === id);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const menuItem = getMenuItem(item.menuItemId);
      return total + (menuItem?.price || 0) * item.quantity;
    }, 0);
  };

  const handleQuantityChange = (id: string, quantity: number, specialInstructions?: string) => {
    if (quantity < 1) return;
    updateCartItem(id, quantity, specialInstructions);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to place the order",
        variant: "destructive",
      });
      return;
    }

    if (!roomNumber.trim()) {
      toast({
        title: "Room number required",
        description: "Please enter your room number to place the order",
        variant: "destructive",
      });
      return;
    }

    const order = placeOrder(customerName, roomNumber);
    toast({
      title: "Order placed successfully",
      description: `Your order #${order.id.slice(0, 8)} has been placed and will be delivered soon`,
    });
    navigate("/orders");
  };

  const subtotal = calculateSubtotal();
  const serviceCharge = subtotal * 0.1;
  const total = subtotal + serviceCharge;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-hotel-primary mb-8 text-center">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {cart.map((item) => {
                const menuItem = getMenuItem(item.menuItemId);
                return (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={menuItem?.image}
                            alt={menuItem?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{menuItem?.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ${menuItem?.price.toFixed(2)}
                          </p>
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-600 mt-1 italic">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity - 1,
                                item.specialInstructions
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 rounded-full p-0"
                          >
                            -
                          </Button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity + 1,
                                item.specialInstructions
                              )
                            }
                            className="h-8 w-8 rounded-full p-0"
                          >
                            +
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            ${((menuItem?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Charge (10%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="font-semibold mb-2">Guest Information</h3>
              <div>
                <label htmlFor="name" className="block text-sm mb-1">
                  Your Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="room" className="block text-sm mb-1">
                  Room Number
                </label>
                <Input
                  id="room"
                  placeholder="Enter your room number"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full mt-6 bg-hotel-primary hover:bg-hotel-primary/90 text-white"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
