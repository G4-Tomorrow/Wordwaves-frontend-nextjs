"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { fetchCollections } from "@/lib/api";
import { useRouter } from "next/navigation";
import http from "@/utils/http";
import Image from "next/image";
import { Button } from "antd";
import { BreadcrumbWithCustomSeparator } from "@/components/admin/my-bread-scrumb";

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface QueryOptions {
  sortBy: string;
  sortDirection: "ASC" | "DESC";
  searchQuery: string;
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function VocabularyAdmin() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [collections, setCollections] = useState<any[]>([]);
  const router = useRouter();

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

  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetchCollections({
          page: pagination.pageNumber,
          size: pagination.pageSize,
          sort: `${queryOptions.sortBy}`,
          sortDirection: `${queryOptions.sortDirection}`,
          search: queryOptions.searchQuery,
          token: token || "",
        });

        setCollections(response.data);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.pagination.totalPages,
          totalElements: response.pagination.totalElements,
        }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load collections",
          type: "background",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, [pagination.pageNumber, queryOptions]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setQueryOptions((prev) => ({
        ...prev,
        searchQuery: term,
      }));
      setPagination((prev) => ({
        ...prev,
        pageNumber: 1,
      }));
    }, 1000),
    []
  );

  const handleSearch = (term: string) => {
    setSearch(term);
    debouncedSearch(term);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        pageNumber: page,
      }));
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    setIsDeleting(true);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await http.delete(`/collections/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 1000) {
        toast({
          title: "Xóa bộ sưu tập thành công",
          description: "Bộ sưu tập đã được xóa thành công",
        });
        setCollections((prev) =>
          prev.filter((collection) => collection.id !== collectionId)
        );
      } else {
        toast({
          title: "Xóa bộ sưu tập thất bại",
          description: "Không thể xóa bộ sưu tập",
        });
      }
    } catch (error) {
      toast({
        title: "Xóa bộ sưu tập thất bại",
        description: "Không thể xóa bộ sưu tập",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPageNumbers = () => {
    const { pageNumber, totalPages } = pagination;

    if (totalPages <= 1) return null;

    const start = Math.max(1, pageNumber - 2);
    const end = Math.min(totalPages, pageNumber + 2);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={pageNumber === i}
            aria-disabled={isLoading}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  const handleSort = (column: string) => {
    setQueryOptions((prev) => ({
      ...prev,
      sortBy: column,
      sortDirection: prev.sortDirection === "ASC" ? "DESC" : "ASC",
    }));
  };

  return (
    <div className="container mx-auto p-6 relative">
      <BreadcrumbWithCustomSeparator />
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Quản lí từ vựng</h1>
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => router.push("/admin/collections/new")}
            className=""
          >
            Thêm bộ sưu tập
          </Button>
          <Button
            onClick={() => router.push("/admin/topics/new")}
            className="justify-self-center"
          >
            Thêm chủ đề
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="Nhập tên bộ sưu tập..."
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
              <TableHead onClick={() => handleSort("name")}>
                Bộ sưu tập
                {queryOptions.sortBy === "name" && (
                  <span>
                    {queryOptions.sortDirection === "ASC" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("numOfTotalWords")}>
                Số lượng từ
                {queryOptions.sortBy === "numOfTotalWords" && (
                  <span>
                    {queryOptions.sortDirection === "ASC" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("wordCollectionCategory")}>
                Thể loại
                {queryOptions.sortBy === "wordCollectionCategory" && (
                  <span>
                    {queryOptions.sortDirection === "ASC" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("createdAt")}>
                Ngày tạo
                {queryOptions.sortBy === "createdAt" && (
                  <span>
                    {queryOptions.sortDirection === "ASC" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.length > 0 ? (
              collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    {collection.thumbnailName ? (
                      <Image
                        src={collection.thumbnailName}
                        alt={collection.name}
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
                  <TableCell>{collection.name}</TableCell>
                  <TableCell>{collection.numOfTotalWords}</TableCell>
                  <TableCell>
                    {collection.wordCollectionCategory?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(collection.createdAt).toLocaleDateString()}
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
                            router.push(`/admin/collections/${collection.id}`)
                          }
                        >
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/admin/collections/${collection.id}/edit`
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
                              Xóa bộ từ vựng
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắn muốn xóa bộ từ vựng này không?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Nếu bạn xóa bộ từ vựng này, tất cả các từ vựng
                                trong bộ từ vựng này cũng sẽ bị xóa.
                                <div className="mt-2 p-2 bg-muted rounded-lg">
                                  <p>
                                    <strong>Collection:</strong>{" "}
                                    {collection.name}
                                  </p>
                                  <p>
                                    <strong>ID:</strong> {collection.id}
                                  </p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteCollection(collection.id);
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
                <TableCell colSpan={4} className="text-center">
                  Không có dữ liệu
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
                !isLoading &&
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
