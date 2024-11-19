"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";
import { PaginationInfo, QueryOptions } from "../../vocabulary/page";
import { Search } from "lucide-react";
import { IconVolume2 } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "antd";

interface Word {
  id: string;
  name: string;
  thumbnailUrl: string;
  phonetics: { text: string; audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
  }[];
}

// Debounce Utility (consider extracting to utils if reusable)
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function TopicWords({
  params: { topicId },
}: {
  params: { topicId: string };
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    pageNumber: 1,
    pageSize: 5,
    totalPages: 0,
    totalElements: 0,
  });
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({
    sortBy: "name",
    sortDirection: "DESC",
    searchQuery: "",
  });

  const fetchWords = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    const url = `/topics/${topicId}/words?pageNumber=${
      pagination.pageNumber
    }&pageSize=${pagination.pageSize}&sort=${queryOptions.sortBy}${
      queryOptions.searchQuery
        ? `&searchQuery=${encodeURIComponent(queryOptions.searchQuery)}`
        : ""
    }`;

    try {
      const { data } = await http.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.code === 1000) {
        setWords(data.result.data || []);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.result.pagination.totalPages,
        }));
      } else {
        throw new Error("Failed to load words.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: String(error) || "Failed to load words.",
        type: "background",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageNumber, queryOptions.searchQuery, topicId]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  // Debounced Search Handler
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setQueryOptions((prev) => ({ ...prev, searchQuery: term }));
      setPagination((prev) => ({ ...prev, pageNumber: 1 }));
    }, 1000),
    []
  );

  const handleSearch = (term: string) => {
    setSearch(term);
    debouncedSearch(term);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, pageNumber: page }));
  };

  // Pagination Rendering
  const renderPageNumbers = () => {
    const { pageNumber, totalPages } = pagination;

    if (totalPages <= 1) return null;

    const pages = [];
    const start = Math.max(1, pageNumber - 2);
    const end = Math.min(totalPages, pageNumber + 2);

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === pageNumber}
            aria-disabled={isLoading}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  const handleDeleteCollection = async (wordId: string) => {
    setIsDeleting(true);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await http.delete(`/words/${wordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 1000) {
        toast({
          title: "Thành công",
          description: "Xóa từ thành công.",
          type: "foreground",
        });
        fetchWords();
      } else {
        throw new Error("Xóa từ thất bại.");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: String(error) || "Xóa từ thất bại.",
        type: "background",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Button onClick={() => router.back()} className="mb-4">
        Trở lại
      </Button>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Từ vựng trong chủ đề</h1>

        <Button
          onClick={() => router.push(`/admin/topics/${topicId}/words/new`)}
          className="mb-4"
        >
          Thêm từ mới
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="Tìm kiếm từ"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
          disabled={isLoading}
        />
        <Button disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Từ</TableHead>
              <TableHead>Phiên âm</TableHead>
              <TableHead>Ý nghĩa</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.length > 0 ? (
              words.map((word) => (
                <TableRow key={word.id}>
                  <TableCell>
                    {word.thumbnailUrl ? (
                      <Image
                        src={word.thumbnailUrl}
                        alt={word.name}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{word.name}</TableCell>
                  <TableCell>
                    {word.phonetics.map((phonetic, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span>{phonetic.text}</span>
                        {phonetic.audio && (
                          <Button
                            onClick={() => new Audio(phonetic.audio).play()}
                          >
                            <IconVolume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm max-h-24 overflow-auto w-[30rem] whitespace-normal break-words">
                      {word.meanings.map((meaning, idx) => (
                        <div key={idx}>
                          <strong>{meaning.partOfSpeech}:</strong>{" "}
                          {meaning.definitions.map((def, defIdx) => (
                            <span key={defIdx}>
                              {def.definition}
                              {def.example && (
                                <em> - Example: {def.example}</em>
                              )}
                              {defIdx < meaning.definitions.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
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
                          onClick={() =>
                            router.push(`/admin/words/${word.name}`)
                          }
                        >
                          Xem chi tiết
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              Xóa từ
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắn muốn xóa từ này không?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Nêu bạn xóa từ này, tất cả các thông tin liên
                                quanh đến từ này sẽ bị xóa.
                                <div className="mt-2 p-2 bg-muted rounded-lg">
                                  <p>
                                    <strong>Word:</strong> {word.name}
                                  </p>
                                  <p>
                                    <strong>ID:</strong> {word.id}
                                  </p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteCollection(word.id);
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không có từ nào trong chủ đề này.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              onClick={() =>
                handlePageChange(Math.max(1, pagination.pageNumber - 1))
              }
              aria-disabled={pagination.pageNumber === 1 || isLoading}
            />
            {renderPageNumbers()}
            <PaginationNext
              onClick={() =>
                handlePageChange(
                  Math.min(pagination.totalPages, pagination.pageNumber + 1)
                )
              }
              aria-disabled={
                pagination.pageNumber === pagination.totalPages || isLoading
              }
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
