
import React, { useState } from "react";
import { useHotel, MenuItem as MenuItemType } from "@/context/HotelContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type MenuItemProps = {
  item: MenuItemType;
};

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addToCart } = useHotel();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { toast } = useToast();

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(item.id, quantity, specialInstructions);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${item.name} added to your cart`,
    });
    setQuantity(1);
    setSpecialInstructions("");
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-hotel-secondary text-white px-2 py-1 rounded-full text-sm font-semibold">
          ${item.price.toFixed(2)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        <div className="mt-2">
          <label className="text-sm text-gray-700 mb-1 block">Special Instructions</label>
          <Input
            placeholder="Any special requests?"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="mb-2"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 p-3">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={quantity === 1}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-3 font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleAddToCart}
          className="bg-hotel-primary hover:bg-hotel-primary/90 text-white"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItem;
