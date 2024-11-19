"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import DragAndDropFile from "@/components/admin/drag-and-dropFile";
import http from "@/utils/http";
import { Button } from "antd";

// Thêm bộ từ vựng mới (new collection)
export default function AddVocabularyCollection() {
  const router = useRouter();

  const [collectionName, setCollectionName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!collectionName.trim() || !category.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ tên bộ từ vựng và thể loại!",
        duration: 3000,
        type: "foreground",
      });
      return;
    }

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
        : undefined;

      // Tạo dữ liệu bộ sưu tập mới
      const newCollectionData = {
        name: collectionName,
        thumbnailName: linkThumbnail,
        category,
      };

      const response = await http.post("/collections", newCollectionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.code === 1000) {
        toast({
          title: "Thành công",
          description: "Bộ sưu tập đã được thêm thành công!",
          duration: 3000,
          type: "foreground",
        });

        // Xử lý khi thêm thành công
        setCollectionName("");
        setThumbnail(null);
        setCategory("");
        router.push("/admin/vocabulary");
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi thêm bộ sưu tập!");
      }
    } catch (error) {
      console.error("Error adding collection:", error);
      alert("Đã có lỗi xảy ra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Thêm bộ từ vựng</h1>
        <Button onClick={() => router.back()}>Hủy</Button>
      </div>

      {/* General Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
        <Input
          placeholder="Nhập tên bộ từ vựng..."
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          className="mb-4"
        />
      </div>

      {/* Media */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Ảnh nền</h2>
        <DragAndDropFile onFileChange={setThumbnail} />
      </div>

      {/* Category */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thể loại</h2>
        <Input
          placeholder="Thêm thể loại (category) cho bộ từ vựng"
          className="mt-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Lưu bộ từ vựng</Button>
      </div>
    </div>
  );
}
