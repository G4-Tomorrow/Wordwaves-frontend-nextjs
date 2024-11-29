import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const refresh_token = request.cookies.get("refresh_token");

    // Danh sách các route yêu cầu đăng nhập
    const protectedRoutes = ['/', '/vocabulary', '/profile', '/dashboard'];

    // Nếu không có refresh_token và truy cập các route yêu cầu đăng nhập, redirect tới /sign-in
    if (!refresh_token && protectedRoutes.includes(pathname)) {
        const redirectUrl = new URL('/sign-in', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Nếu đã có refresh_token và đang ở /sign-in hoặc /sign-up, redirect về /
    if (refresh_token && (pathname === '/sign-in' || pathname === '/sign-up')) {
        const redirectUrl = new URL('/vocabulary', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Cho phép truy cập bình thường nếu không cần redirect
    return NextResponse.next();
}

export const config = {
    matcher: ['/sign-in', '/sign-up', '/', '/vocabulary', '/profile', '/dashboard'], // Áp dụng middleware cho các route cần kiểm tra
};
