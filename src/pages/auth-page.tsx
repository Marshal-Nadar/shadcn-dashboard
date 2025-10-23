import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Package2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Package2 className="h-8 w-8" />
            <span className="text-2xl font-bold">Acme Inc</span>
          </div>
          <p className="text-muted-foreground">
            Welcome back! Please sign in to your account or create a new one.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm onSwitchToLogin={handleSwitchToLogin} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sonner Toaster */}
      <Toaster position="bottom-left" />
    </div>
  );
}
