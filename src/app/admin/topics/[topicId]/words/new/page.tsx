"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";
import { Button } from "@/components/ui/button";

export default function AddWordPage({
  params,
}: {
  params: { topicId: string };
}) {
  const router = useRouter();
  const { topicId } = params;

  const [wordName, setWordName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wordName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên từ!",
        duration: 3000,
        type: "foreground",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await http.post(
        `/words`,
        { name: wordName, topicId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 1000) {
        toast({
          title: "Thành công",
          description: "Từ đã được thêm thành công!",
          duration: 3000,
          type: "foreground",
        });

        setWordName("");

        router.push(`/admin/topics/${topicId}`);
      } else {
        toast({
          title: "Lỗi",
          description: response.data.message || "Có lỗi xảy ra khi thêm từ!",
          duration: 3000,
          type: "foreground",
        });
      }
    } catch (error) {
      console.error("Error adding word:", error);
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
        <h1 className="text-3xl font-bold">Thêm Từ Mới</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        {/* Tên từ */}
        <div className="mb-4">
          <label
            htmlFor="word-name"
            className="block text-gray-700 font-medium mb-2"
          >
            Tên Từ
          </label>
          <input
            type="text"
            id="word-name"
            value={wordName}
            onChange={(e) => setWordName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập tên từ..."
            required
          />
        </div>

        {/* Nút Gửi */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang Thêm..." : "Thêm Từ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
