import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /chat)
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup'];
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // For now, we'll just allow all routes since we're using localStorage for auth
  // In a real app, you'd check for valid JWT tokens here
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};