"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "antd";
import { BreadcrumbWithCustomSeparator } from "@/components/admin/my-bread-scrumb";

interface Topic {
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
  id: string;
  name: string;
  thumbnailName: string | null;
  numOfTotalWords: number;
  numOfLearningWord: number;
  numOfLearnedWord: number;
}

export default function CollectionDetails({
  params,
}: {
  params: { collectionId: string };
}) {
  const router = useRouter();
  const { collectionId } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      const url = `/collections/${collectionId}/topics?pageNumber=1&pageSize=5`;
      try {
        const response = await http.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.code === 1000) {
          setTopics(response.data.result.data || []);
        } else {
          toast({
            title: "Error",
            description: "Failed to load topics",
            type: "foreground",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load topics",
          type: "background",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [collectionId]);

  const handleDeleteCollection = async (topicId: string) => {
    setIsDeleting(true);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await http.delete(`/topics/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 1000) {
        toast({
          title: "Thành công",
          description: "Đã xóa chủ đề thành công",
          type: "foreground",
        });
        setTopics((prevTopics) =>
          prevTopics.filter((topic) => topic.id !== topicId)
        );
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể xóa chủ đề",
          type: "foreground",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa chủ đề",
        type: "background",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* <Button onClick={() => router.back()} className="mb-4">
        Trở lại
      </Button> */}
      <BreadcrumbWithCustomSeparator />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Các chủ đề</h1>

        <Button
          onClick={() =>
            router.push(`/admin/collections/${collectionId}/topics/new`)
          }
          className="mb-4"
        >
          Thêm chủ đề
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : topics.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên chủ đề</TableHead>
              <TableHead>Tổng số từ</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell>
                  {topic.thumbnailName ? (
                    <Image
                      src={topic.thumbnailName}
                      alt={topic.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell>{topic.name}</TableCell>
                <TableCell>{topic.numOfTotalWords}</TableCell>
                <TableCell>
                  {new Date(topic.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="h-8 w-8 p-0" disabled={isLoading}>
                        <MoreHorizontal className="h-4 w-4 dark:text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/topics/${topic.id}`)}
                      >
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/admin/collections/${collectionId}/topics/${topic.id}/edit`
                          )
                        }
                      >
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Xóa chủ đề
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Bạn có chắc chắn muốn xóa chủ đề này không?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Nếu bạn xóa chủ đề này, tất cả các từ vựng trong
                              chủ đề này cũng sẽ bị xóa.
                              <div className="mt-2 p-2 bg-muted rounded-lg">
                                <p>
                                  <strong>Topic:</strong> {topic.name}
                                </p>
                                <p>
                                  <strong>ID:</strong> {topic.id}
                                </p>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteCollection(topic.id);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={isDeleting}
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center">No topics found for this collection.</div>
      )}
    </div>
  );
}
