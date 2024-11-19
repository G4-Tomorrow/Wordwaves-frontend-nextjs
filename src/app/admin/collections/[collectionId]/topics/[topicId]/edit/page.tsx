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
import { Button, Input } from "antd";

export default function EditTopicPage({
  params,
}: {
  params: { topicId: string; collectionId: string };
}) {
  const router = useRouter();
  const { topicId, collectionId } = params;

  const [topicName, setTopicName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Ảnh cũ
  const [thumbnail, setThumbnail] = useState<File | null>(null); // Ảnh mới
  const [selectedCollectionId, setSelectedCollectionId] =
    useState(collectionId);
  const [collections, setCollections] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy danh sách Collections
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          router.push("/login");
          return;
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
          description: "Không thể tải danh sách collections!",
          duration: 3000,
          type: "foreground",
        });
      }
    };

    loadCollections();
  }, []);

  // Lấy danh sách Topics từ Collection và tìm Topic cần chỉnh sửa
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const url = `/collections/${collectionId}/topics?pageNumber=1&pageSize=100`;

        const response = await http.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.code === 1000) {
          const topic = response.data.result.data.find(
            (t: any) => t.id === topicId
          );
          if (!topic) {
            toast({
              title: "Lỗi",
              description: "Không tìm thấy chủ đề!",
              duration: 3000,
              type: "foreground",
            });
            router.push(`/admin/collections/${collectionId}`);
            return;
          }

          setTopicName(topic.name || "");
          setThumbnailUrl(topic.thumbnailName || "");
          setSelectedCollectionId(topic.collectionId || collectionId);
        } else {
          toast({
            title: "Lỗi",
            description:
              response.data.message || "Không thể tải danh sách chủ đề!",
            duration: 3000,
            type: "foreground",
          });
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast({
          title: "Lỗi",
          description: "Đã có lỗi xảy ra khi tải danh sách chủ đề!",
          duration: 3000,
          type: "foreground",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [collectionId, topicId, router]);

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

      const updatedTopic = {
        name: topicName,
        thumbnailName: linkThumbnail,
        collectionId: selectedCollectionId,
      };

      const response = await http.put(`/topics/${topicId}`, updatedTopic, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.code === 1000) {
        toast({
          title: "Thành công",
          description: "Chủ đề đã được cập nhật thành công!",
          duration: 3000,
          type: "foreground",
        });

        router.push(`/admin/collections/${selectedCollectionId}`);
      } else {
        toast({
          title: "Lỗi",
          description:
            response.data.message || "Có lỗi xảy ra khi cập nhật chủ đề!",
          duration: 3000,
          type: "foreground",
        });
      }
    } catch (error) {
      console.error("Error updating topic:", error);
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
        <p>Đang tải thông tin chủ đề...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa Chủ Đề</h1>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>

      <form onSubmit={handleSave} className="bg-white shadow-md rounded-lg p-6">
        {/* Tên chủ đề */}
        <div className="mb-4">
          <label
            htmlFor="topic-name"
            className="block text-gray-700 font-medium mb-2"
          >
            Tên chủ đề
          </label>
          <Input
            type="text"
            id="topic-name"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Nhập tên chủ đề..."
            required
          />
        </div>

        {/* Collection */}
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
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn một Collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ảnh */}
        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-gray-700 font-medium mb-2"
          >
            Ảnh
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
