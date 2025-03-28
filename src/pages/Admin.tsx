import React, { useState } from "react";
import { useHotel, MenuItem } from "@/context/HotelContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Check, Clock, Ban, EyeIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const { menuItems, orders, addMenuItem, updateMenuItem, deleteMenuItem, updateOrderStatus } = useHotel();
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [viewOrderDetails, setViewOrderDetails] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state for new/edit menu item
  const [formData, setFormData] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleAddMenuItem = () => {
    if (!formData.name || !formData.description || !formData.category || !formData.image) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addMenuItem(formData);
    toast({
      title: "Menu item added",
      description: `${formData.name} has been added to the menu`,
    });
    resetForm();
    setIsAddingMenuItem(false);
  };

  const handleEditMenuItem = () => {
    if (editingItemId) {
      updateMenuItem(editingItemId, formData);
      toast({
        title: "Menu item updated",
        description: `${formData.name} has been updated`,
      });
      resetForm();
      setEditingItemId(null);
    }
  };

  const startEditingItem = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
    });
    setEditingItemId(item.id);
    setIsAddingMenuItem(false);
  };

  const handleDeleteMenuItem = (id: string) => {
    deleteMenuItem(id);
    toast({
      title: "Menu item deleted",
      description: "The menu item has been removed",
    });
  };

  const handleStatusChange = (orderId: string, status: "pending" | "confirmed" | "completed" | "cancelled") => {
    updateOrderStatus(orderId, status);
    toast({
      title: "Order status updated",
      description: `Order #${orderId.slice(0, 8)} has been marked as ${status}`,
    });
  };

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Get menu item by id
  const getMenuItem = (id: string) => {
    return menuItems.find((item) => item.id === id);
  };

  // Form for adding/editing menu items
  const renderMenuItemForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{editingItemId ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Dish name"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the dish"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Main Course">Main Course</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                  <SelectItem value="Beverage">Beverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAddingMenuItem(false);
                setEditingItemId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingItemId ? handleEditMenuItem : handleAddMenuItem}
              className="bg-hotel-primary hover:bg-hotel-primary/90"
            >
              {editingItemId ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render order details
  const renderOrderDetails = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Details #{order.id.slice(0, 8)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold">Customer Information</h3>
                <p className="text-sm mt-1">Name: {order.customerName}</p>
                <p className="text-sm">Table: {order.tableNumber}</p>
                <p className="text-sm">Date: {format(new Date(order.timestamp), "MMM d, yyyy h:mm a")}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Order Status</h3>
                <Badge className="mt-1 capitalize">{order.status}</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Ordered Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => {
                    const menuItem = getMenuItem(item.menuItemId);
                    if (!menuItem) return null;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded overflow-hidden">
                              <img
                                src={menuItem.image}
                                alt={menuItem.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{menuItem.name}</p>
                              {item.specialInstructions && (
                                <p className="text-xs text-gray-500 italic">Note: {item.specialInstructions}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${menuItem.price.toFixed(2)}</TableCell>
                        <TableCell>${(menuItem.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-2">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={order.status === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(order.id, "pending")}
                  disabled={order.status === "pending"}
                  className={order.status === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                >
                  <Clock className="mr-1 h-4 w-4" /> Pending
                </Button>
                <Button
                  variant={order.status === "confirmed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(order.id, "confirmed")}
                  disabled={order.status === "confirmed"}
                  className={order.status === "confirmed" ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  <Check className="mr-1 h-4 w-4" /> Confirm
                </Button>
                <Button
                  variant={order.status === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(order.id, "completed")}
                  disabled={order.status === "completed"}
                  className={order.status === "completed" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  <Check className="mr-1 h-4 w-4" /> Complete
                </Button>
                <Button
                  variant={order.status === "cancelled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(order.id, "cancelled")}
                  disabled={order.status === "cancelled"}
                  className={order.status === "cancelled" ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Ban className="mr-1 h-4 w-4" /> Cancel
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setViewOrderDetails(null)}>
                Close Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-hotel-primary mb-6 text-center">Admin Dashboard</h1>

      <Tabs defaultValue="orders" className="max-w-6xl mx-auto">
        <TabsList className="mx-auto mb-6">
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            {!isAddingMenuItem && !editingItemId && (
              <Button
                onClick={() => setIsAddingMenuItem(true)}
                className="bg-hotel-primary hover:bg-hotel-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Item
              </Button>
            )}
          </div>

          {(isAddingMenuItem || editingItemId) && renderMenuItemForm()}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge>{item.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditingItem(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <h2 className="text-xl font-semibold mb-6">Orders</h2>

          {viewOrderDetails && renderOrderDetails(viewOrderDetails)}

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No orders have been placed yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
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
                      <Badge 
                        className={`
                          ${order.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${order.status === "confirmed" ? "bg-blue-100 text-blue-800" : ""}
                          ${order.status === "completed" ? "bg-green-100 text-green-800" : ""}
                          ${order.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
                          capitalize px-3 py-1
                        `}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Customer</h3>
                        <p>{order.customerName}</p>
                        <p className="text-sm text-gray-600">Table: {order.tableNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Order Summary</h3>
                        <p>{order.items.length} items</p>
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setViewOrderDetails(order.id)}
                        className="border-hotel-primary text-hotel-primary"
                      >
                        <EyeIcon className="mr-1 h-4 w-4" /> View Order Details
                      </Button>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={order.status === "pending" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(order.id, "pending")}
                          disabled={order.status === "pending"}
                          className={order.status === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        >
                          <Clock className="mr-1 h-4 w-4" /> Pending
                        </Button>
                        <Button
                          variant={order.status === "confirmed" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(order.id, "confirmed")}
                          disabled={order.status === "confirmed"}
                          className={order.status === "confirmed" ? "bg-blue-500 hover:bg-blue-600" : ""}
                        >
                          <Check className="mr-1 h-4 w-4" /> Confirm
                        </Button>
                        <Button
                          variant={order.status === "completed" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(order.id, "completed")}
                          disabled={order.status === "completed"}
                          className={order.status === "completed" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          <Check className="mr-1 h-4 w-4" /> Complete
                        </Button>
                        <Button
                          variant={order.status === "cancelled" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(order.id, "cancelled")}
                          disabled={order.status === "cancelled"}
                          className={order.status === "cancelled" ? "bg-red-500 hover:bg-red-600" : ""}
                        >
                          <Ban className="mr-1 h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
