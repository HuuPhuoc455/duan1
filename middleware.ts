import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;


  // Chỉ check cho các route admin
  if (pathname.startsWith('/admin')) {
    try {
      // Lấy token từ cookie (middleware chạy server-side nên không thể dùng localStorage)
      const token = request.cookies.get('token')?.value;
      
      // Nếu không có token, redirect về trang đăng nhập
      if (!token) {
        const loginUrl = new URL('/dangnhap', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }


      // Gọi API lấy thông tin user
      const response = await fetch('http://localhost:3000/users/userinfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });


      // Nếu API trả về lỗi
      if (!response.ok) {
        const loginUrl = new URL('/dangnhap', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }


      // Parse thông tin user
      const userInfo = await response.json();
      console.log('User info from middleware:', userInfo);


      // Kiểm tra role có phải admin không
      if (userInfo.role !== 'admin') {
        const loginUrl = new URL('/dangnhap', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }


      // Cho phép truy cập nếu response ok (user là admin)
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      // Nếu có lỗi, redirect về trang đăng nhập
      const loginUrl = new URL('/dangnhap', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }


  return NextResponse.next();
}


// Cấu hình matcher - chỉ chạy middleware cho các route admin
export const config = {
  matcher: '/admin/:path*',
};
