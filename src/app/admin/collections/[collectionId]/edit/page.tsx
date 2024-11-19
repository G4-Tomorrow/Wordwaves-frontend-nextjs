"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import DragAndDropFile from "@/components/admin/drag-and-dropFile";
import { fetchCollections } from "@/lib/api";
import { Button, Input } from "antd";
import http from "@/utils/http";

export default function EditCollectionPage({
  params,
}: {
  params: { collectionId: string };
}) {
  const router = useRouter();
  const { collectionId } = params;

  const [collectionName, setCollectionName] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Hiển thị ảnh cũ
  const [thumbnail, setThumbnail] = useState<File | null>(null); // Ảnh mới
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetchCollections({
          page: 1, // Tải toàn bộ danh sách
          size: 1000, // Đảm bảo có đủ collections để tìm
          token: token || "",
        });

        const allCollections = response.data;

        const collection = allCollections.find(
          (col: any) => col.id === collectionId
        );
        if (!collection) {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy bộ sưu tập!",
            duration: 3000,
            type: "foreground",
          });
          router.back();
          return;
        }

        // Gán thông tin ban đầu vào state
        setCollectionName(collection.name || "");
        setCategory(collection.wordCollectionCategory.name || "");
        setThumbnailUrl(collection.thumbnailName || "");
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast({
          title: "Lỗi",
          description: "Đã có lỗi xảy ra khi tải danh sách bộ sưu tập!",
          duration: 3000,
          type: "foreground",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, [collectionId, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      let uploadedFileName = "";
      if (thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);

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
        : thumbnailUrl;

      const updatedCollection = {
        name: collectionName,
        category,
        thumbnailName: linkThumbnail,
      };

      const response = await http.put(
        `/collections/${collectionId}`,
        updatedCollection,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 1000) {
        toast({
          title: "Thành công",
          description: "Bộ sưu tập đã được cập nhật thành công!",
          duration: 3000,
          type: "foreground",
        });

        router.push("/admin/vocabulary");
      } else {
        toast({
          title: "Lỗi",
          description:
            response.data.message || "Có lỗi xảy ra khi cập nhật bộ sưu tập!",
          duration: 3000,
          type: "foreground",
        });
      }
    } catch (error) {
      console.error("Error updating collection:", error);
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Đang tải thông tin bộ sưu tập...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa bộ sưu tập</h1>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>

      <form onSubmit={handleSave} className="bg-white shadow-md rounded-lg p-6">
        {/* Tên bộ sưu tập */}
        <div className="mb-4">
          <label
            htmlFor="collection-name"
            className="block text-gray-700 font-medium mb-2"
          >
            Tên bộ sưu tập
          </label>
          <Input
            type="text"
            id="collection-name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Nhập tên bộ sưu tập..."
            required
          />
        </div>

        {/* Thể loại */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-medium mb-2"
          >
            Thể loại
          </label>
          <Input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Nhập thể loại..."
            required
          />
        </div>

        {/* Ảnh */}
        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-gray-700 font-medium mb-2"
          >
            Ảnh bộ sưu tập
          </label>
          {thumbnailUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
          <DragAndDropFile onFileChange={setThumbnail} />
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end">
          <Button
            htmlType="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
