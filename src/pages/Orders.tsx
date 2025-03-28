
import React, { useState } from "react";
import { useHotel } from "@/context/HotelContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, PackageCheck } from "lucide-react";
import { format } from "date-fns";

const Orders = () => {
  const { orders, menuItems } = useHotel();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getMenuItem = (id: string) => {
    return menuItems.find((item) => item.id === id);
  };

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <PackageCheck className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Button
            onClick={() => window.location.href = "/"}
            className="bg-hotel-primary hover:bg-hotel-primary/90"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-hotel-primary mb-8 text-center">Your Orders</h1>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(order.timestamp), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <Badge className={`${getStatusColor(order.status)} capitalize px-3 py-1`}>
                      {order.status}
                    </Badge>
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion
                  type="single"
                  collapsible
                  value={expandedOrder === order.id ? order.id : undefined}
                  onValueChange={(value) => setExpandedOrder(value)}
                >
                  <AccordionItem value={order.id} className="border-0">
                    <AccordionTrigger className="px-6 py-3 hover:no-underline">
                      <span className="text-sm font-medium">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"} • View Details
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-600 mb-2">Guest Information</h3>
                          <p className="text-sm">Name: {order.customerName}</p>
                          <p className="text-sm">Room: {order.roomNumber}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-sm text-gray-600 mb-2">Order Items</h3>
                          <div className="space-y-3">
                            {order.items.map((item) => {
                              const menuItem = getMenuItem(item.menuItemId);
                              return (
                                <div key={item.id} className="flex justify-between items-start">
                                  <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                      <img
                                        src={menuItem?.image}
                                        alt={menuItem?.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {menuItem?.name} <span className="text-gray-600">x{item.quantity}</span>
                                      </p>
                                      {item.specialInstructions && (
                                        <p className="text-xs text-gray-500 mt-1 italic">
                                          Note: {item.specialInstructions}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <span className="font-medium">
                                    ${((menuItem?.price || 0) * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="border-t pt-3 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
