"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { AlertTriangle, Home, Shield } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-destructive rounded-full p-3">
                <Shield className="h-8 w-8 text-destructive-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this resource
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your current role doesn't have the required permissions to view
                this page.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              If you believe this is an error, please contact your system
              administrator.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
