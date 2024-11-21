"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";
import { Button } from "antd";
import DragAndDropFile from "@/components/admin/drag-and-dropFile";

// Thêm chủ đề mới dựa trên collectionId
export default function AddTopicPage({
  params,
}: {
  params: { collectionId: string };
}) {
  const router = useRouter();
  const { collectionId } = params;

  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        : undefined;

      const topicFormData = {
        name,
        collectionId,
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
        router.push(`/admin/collections/${collectionId}`);
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
        description: "Đã có lỗi xảy ra. Vui lòng thử lại!",
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
        <h1 className="text-2xl font-bold">Thêm Chủ Đề Mới</h1>
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

        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-gray-700 font-medium mb-2"
          >
            Ảnh của Chủ Đề
          </label>
          <DragAndDropFile onFileChange={setThumbnail} />
        </div>

        <div className="flex justify-end">
          <Button
            htmlType="submit"
            className={`p-4 ${
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
