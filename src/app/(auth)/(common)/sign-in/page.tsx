"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import http from "@/utils/http";

const formSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ.",
  }),
  password: z.string(),
});

export default function TrangDangNhap() {
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await http.post(
        "/auth/login",
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.code === 1000) {
        setLoginStatus("Đăng nhập thành công!");

        const user = response.data.result.user;
        const accessToken = response.data.result.accessToken;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Xóa dữ liệu không cần thiết
        localStorage.removeItem("collectionsData");

        // Kiểm tra nếu là admin, điều hướng tới trang admin
        if (user.roles.some((role) => role.name === "ADMIN")) {
          router.push("/admin");
        } else {
          router.push("/vocabulary");
        }
      } else if (response.data.code === 1008) {
        setLoginStatus(response.data.message || "Tài khoản không tồn tại.");
      } else {
        setLoginStatus(
          response.data.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
      }
    } catch (error: any) {
      setLoginStatus(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="nguyenvan@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-gray-500">
          Bằng cách tạo tài khoản, bạn đồng ý với{" "}
          <a href="#" className="text-gray-700 underline">
            điều khoản và điều kiện
          </a>{" "}
          và{" "}
          <a href="#" className="text-gray-700 underline">
            chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" className="text-white">
            Đăng nhập
          </Button>

          {loginStatus && (
            <p
              className={`text-center ${loginStatus.includes("thành công")
                  ? "text-green-600"
                  : "text-red-600"
                }`}
            >
              {loginStatus}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Bạn đã có tài khoản?{" "}
            <a href="#" className="text-gray-700 underline">
              Đăng nhập
            </a>
            .
          </p>
        </div>
        <p className="text-sm text-gray-500 text-center">
          <a href="/forgot-password" className="text-gray-700 underline">
            Quên mật khẩu?
          </a>
        </p>
      </form>
    </Form>
  );
}
