
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type AdminAuthProps = {
  onAuthenticate: () => void;
};

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { toast } = useToast();

  // This would typically be a secure, hashed password stored on a backend
  // For demo purposes, we're using a simple string comparison
  const correctPassword = "admin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      setError(false);
      toast({
        title: "Authentication successful",
        description: "Welcome to the admin dashboard",
      });
      onAuthenticate();
    } else {
      setError(true);
      toast({
        title: "Authentication failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Authentication</CardTitle>
          <CardDescription className="text-center">
            Enter your password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  className={`pl-10 ${error ? 'border-red-500' : ''}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">Incorrect password. Please try again.</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-hotel-primary hover:bg-hotel-primary/90">
              Login to Admin
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminAuth;
