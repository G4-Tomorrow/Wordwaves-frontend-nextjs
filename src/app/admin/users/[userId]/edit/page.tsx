"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";
import AvatarUser from "@/components/ui/avatar-user";

interface UserDetail {
  id: string;
  email: string;
  fullName: string | null;
  avatarName: string | null;
}

interface UpdateUserData {
  fullName: string;
  avatarName?: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({
    fullName: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      setIsLoading(true);
      try {
        const response = await http.get(`/users/${params.userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (response.data.code === 1000) {
          const userData = response.data.result;
          setUser(userData);
          setFormData({
            fullName: userData.fullName || "",
            avatarName: userData.avatarName || undefined,
          });
          if (userData.avatarName) {
            setPreviewUrl(`/api/avatars/${userData.avatarName}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          title: "Failed to load user data",
          description: "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.userId) {
      fetchUserDetail();
    }
  }, [params.userId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        console.log("revokeObjectURL", URL.revokeObjectURL(previewUrl));
        console.log("previewUrl", previewUrl);
      }

      setSelectedFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await http.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.data.code === 1000) {
        // Lấy fileName từ response
        return response.data.result.fileName;
      }
      return null;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw new Error("Failed to upload avatar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updateData: UpdateUserData = {
        fullName: formData.fullName,
      };

      // Chỉ upload và cập nhật avatar nếu có file mới được chọn
      if (selectedFile) {
        const fileName = await uploadAvatar();
        if (fileName) {
          updateData.avatarName = fileName;
        }
      }

      const response = await http.put(`/users/${params.userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.data.code === 1000) {
        toast({
          title: "User updated successfully",
        });
        router.push(`/admin/users/${params.userId}`);
      } else {
        toast({
          title: "Failed to update user",
          description: "Please try again later",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Failed to update user",
        description: "Please try again later",
      });
    } finally {
      setIsSaving(false);
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
          onClick={() => router.push(`/admin/users/${params.userId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit User</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="max-w-md"
                placeholder="Enter full name"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-4">
              <Label>Avatar</Label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {selectedFile && previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="avatar"
                        className="size-32 rounded-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                        onClick={handleRemoveFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <AvatarUser
                      className="size-32"
                      avatarName={user?.avatarName || null}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSaving}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG. Max size: 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⚪</span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
