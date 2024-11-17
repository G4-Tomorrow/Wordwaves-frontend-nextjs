"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import http from "@/utils/http";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarName: string | null;
  roles: Array<{
    name: string;
    description: string | null;
  }>;
}

interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

interface QueryOptions {
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

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
    totalElements: 0,
  });
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({
    sortBy: "createdAt",
    sortDirection: "DESC",
    searchQuery: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      const queryParams = new URLSearchParams({
        pageNumber: pagination.pageNumber.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy: queryOptions.sortBy,
        sortDirection: queryOptions.sortDirection,
        searchQuery: queryOptions.searchQuery,
      });

      const response = await http.get(`/users?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      if (data.code === 1000) {
        setUsers(data.result.data);
        setPagination(data.result.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
    }, 2000),
    []
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await http.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.code === 1000) {
        toast({
          title: "User deleted successfully",
          description: "User has been deleted successfully",
        });
        fetchUsers(); // Refresh danh sách sau khi xóa
      } else {
        toast({
          title: "Failed to delete user",
          description: "Failed to delete user",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Failed to delete user",
        description: "Failed to delete user",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
          disabled={isLoading}
        />
        <Button variant="outline" size="icon" disabled={isLoading}>
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
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fullName || "N/A"}</TableCell>
                <TableCell>
                  {user.roles.map((role) => role.name).join(", ")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Delete User
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the user account and remove
                              their data from our servers.
                              <div className="mt-2 p-2 bg-muted rounded-lg">
                                <p>
                                  <strong>User:</strong> {user.email}
                                </p>
                                <p>
                                  <strong>ID:</strong> {user.id}
                                </p>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteUser(user.id);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={isDeleting}
                            >
                              Delete
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
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  !isLoading && handlePageChange(pagination.pageNumber - 1)
                }
                aria-disabled={pagination.pageNumber === 1 || isLoading}
                className={isLoading ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => !isLoading && handlePageChange(page)}
                    isActive={pagination.pageNumber === page}
                    aria-disabled={pagination.pageNumber === page || isLoading}
                    className={
                      isLoading ? "pointer-events-none opacity-50" : ""
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  !isLoading && handlePageChange(pagination.pageNumber + 1)
                }
                aria-disabled={
                  pagination.pageNumber === pagination.totalPages || isLoading
                }
                className={isLoading ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
