
import React, { useState } from "react";
import { useHotel } from "@/context/HotelContext";
import MenuItem from "@/components/MenuItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const Menu = () => {
  const { menuItems } = useHotel();
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique categories
  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

  // Filter items based on search query
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-hotel-primary mb-2">Hotel Restaurant Menu</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Explore our delicious selection of dishes, from appetizers to desserts,
          all prepared with the finest ingredients by our talented chefs.
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search for dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="All" className="mb-8">
        <TabsList className="mx-auto flex flex-wrap justify-center">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems
                .filter((item) => category === "All" || item.category === category)
                .map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Menu;
