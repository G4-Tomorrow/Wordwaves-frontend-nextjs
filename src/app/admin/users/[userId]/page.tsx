"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";
import AvatarUser from "@/components/ui/avatar-user";

interface UserDetail {
  id: string;
  email: string;
  fullName: string | null;
  avatarName: string | null;
  createdAt: string;
  updatedAt: string;
  roles: Array<{
    name: string;
    description: string | null;
  }>;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await http.get(`/users/${params.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.code === 1000) {
          setUser(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.userId) {
      fetchUserDetail();
    }
  }, [params.userId]);

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await http.delete(`/users/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.code === 1000) {
        toast({
          title: "User deleted successfully",
          description: "User has been deleted successfully",
        });
        router.push("/admin/users");
      } else {
        toast({
          title: "Failed to delete user",
          description: "Failed to delete user",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Failed to delete user",
        description: "Failed to delete user",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-500">User not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">User ID</label>
              <p className="font-medium">{user.id}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Full Name</label>
              <p className="font-medium">{user.fullName || "Not set"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.roles.map((role, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                >
                  <span className="font-medium">{role.name}</span>
                  {role.description && (
                    <span className="text-sm text-muted-foreground">
                      {role.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Created At
              </label>
              <p className="font-medium">
                {format(new Date(user.createdAt), "PPpp")}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Last Updated
              </label>
              <p className="font-medium">
                {format(new Date(user.updatedAt), "PPpp")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Avatar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              {user.avatarName ? (
                <AvatarUser className="size-32" avatarName={user.avatarName} />
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/users/${user?.id}/edit`)}
        >
          Edit User
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⚪</span>
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                user account and remove their data from our servers.
                <div className="mt-2 p-2 bg-muted rounded-lg">
                  <p>
                    <strong>User:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>ID:</strong> {user?.id}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteUser();
                }}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
