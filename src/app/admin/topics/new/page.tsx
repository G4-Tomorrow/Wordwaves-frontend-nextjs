"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";
import DragAndDropFile from "@/components/admin/drag-and-dropFile";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { fetchCollections } from "@/lib/api";
import { Button } from "antd";

// Thêm chủ đề mới không cần collectionId, chọn collection từ danh sách
export default function AddTopicPage() {
  const router = useRouter();

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load danh sách collections từ API
  useEffect(() => {
    const loadCollections = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetchCollections({
          page: 1,
          size: 100,
          token,
        });

        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast({
          title: "Lỗi",
          description: "Đã có lỗi xảy ra khi tải danh sách collections!",
          duration: 3000,
          type: "foreground",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedCollectionId.trim() || !name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn Collection và nhập tên chủ đề!",
        duration: 3000,
        type: "foreground",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      let uploadedFileName = "";
      if (thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);

        // Upload thumbnail
        const fileResponse = await http.post("/files", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (fileResponse.data.code === 1000) {
          uploadedFileName = fileResponse.data.result.fileName;
        } else {
          toast({
            title: "Lỗi",
            description:
              fileResponse.data.message || "Có lỗi xảy ra khi tải ảnh!",
            duration: 3000,
            type: "foreground",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const linkThumbnail = uploadedFileName
        ? `https://firebasestorage.googleapis.com/v0/b/wordwaves-40814.appspot.com/o/${uploadedFileName}?alt=media&token=e3149c89-093f-4049-a935-5ad0bd42c2ee`
        : undefined;

      // Dữ liệu topic mới
      const topicFormData = {
        name,
        collectionId: selectedCollectionId,
        thumbnailName: linkThumbnail || undefined,
      };

      const response = await http.post(`/topics`, topicFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.code === 1000) {
        toast({
          title: "Thành công",
          description: "Chủ đề đã được thêm thành công!",
          duration: 3000,
          type: "foreground",
        });

        setName("");
        setThumbnail(null);
        setSelectedCollectionId("");

        router.push(`/admin/collections/${selectedCollectionId}`);
      } else {
        toast({
          title: "Lỗi",
          description:
            response.data.message || "Có lỗi xảy ra khi thêm chủ đề!",
          duration: 3000,
          type: "foreground",
        });
      }
    } catch (error) {
      console.error("Error adding topic:", error);
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra!",
        duration: 3000,
        type: "foreground",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Thêm Chủ Đề Mới</h1>
        <Button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          Quay lại
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        {/* Danh sách Collection */}
        <div className="mb-4">
          <label
            htmlFor="collection-select"
            className="block text-gray-700 font-medium mb-2"
          >
            Chọn Collection
          </label>
          <Select
            onValueChange={setSelectedCollectionId}
            value={selectedCollectionId}
            disabled={isLoading || collections.length === 0}
          >
            <SelectTrigger className="w-full dark:text-black">
              <SelectValue
                placeholder={
                  isLoading
                    ? "Đang tải danh sách collections..."
                    : collections.length > 0
                    ? "Chọn một Collection"
                    : "Không có collection nào"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Đang tải...</div>
              ) : collections.length > 0 ? (
                collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Không có collection nào
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Tên Chủ Đề */}
        <div className="mb-4">
          <label
            htmlFor="topic-name"
            className="block text-gray-700 font-medium mb-2"
          >
            Tên Chủ Đề
          </label>
          <input
            type="text"
            id="topic-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập tên chủ đề..."
            required
          />
        </div>

        {/* Ảnh Chủ Đề */}
        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-gray-700 font-medium mb-2"
          >
            Ảnh của Chủ Đề
          </label>
          <DragAndDropFile onFileChange={setThumbnail} />
        </div>

        {/* Nút Gửi */}
        <div className="flex justify-end">
          <Button
            htmlType="submit"
            className={`p-4 rounded-lg  hover:bg-blue-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang Thêm..." : "Thêm Chủ Đề"}
          </Button>
        </div>
      </form>
    </div>
  );
}
