
import React, { useState } from "react";
import { useHotel } from "@/context/HotelContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { cart } = useHotel();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-hotel-primary font-bold text-xl">Hotel Shivam</span>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="hover:text-hotel-secondary"
            >
              Menu
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/orders")}
              className="hover:text-hotel-secondary"
            >
              My Orders
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="hover:text-hotel-secondary"
            >
              Admin
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 border-hotel-primary hover:bg-hotel-primary hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="ml-1 bg-hotel-secondary text-white">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="outline"
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 mr-2 border-hotel-primary hover:bg-hotel-primary hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="ml-1 bg-hotel-secondary text-white">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hotel-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/");
                setIsOpen(false);
              }}
              className="w-full justify-start"
            >
              Menu
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/orders");
                setIsOpen(false);
              }}
              className="w-full justify-start"
            >
              My Orders
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/admin");
                setIsOpen(false);
              }}
              className="w-full justify-start"
            >
              Admin
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
