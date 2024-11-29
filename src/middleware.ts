import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Các route cần token
  const protectedRoutes = ["/", "/vocabulary", "/profile", "/dashboard"];

  if (protectedRoutes.includes(pathname)) {
    return NextResponse.next(); // Cho phép đi tiếp, kiểm tra chi tiết ở client
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/vocabulary", "/profile", "/dashboard"], // Chỉ áp dụng với các route này
};
