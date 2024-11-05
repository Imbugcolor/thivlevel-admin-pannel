import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "./libs/interfaces/jwtPayload.interface";

const privatePaths = ["/"];
const authPaths = ["/auth"];
// const productEditRegex = /^\/products\/\d+\/edit$/

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refreshtoken")?.value;

  // Check if path is protected
  const isProtectedPath = privatePaths.some((path) => pathname.startsWith(path));
  
  // Check if path is excluded from protection
  const isExcludedPath = authPaths.some((path) => pathname.startsWith(path));

  // Replace this with your actual authentication check
  const checkAuth = () => {
    if (!token) return false;

    const decode: JwtPayload = jwtDecode(token);

    if (decode.role.some(rl => rl === 'admin')) {
        return true;
    }

    return false;
  }; // Or check for a JWT header, session, etc.

  const isAuthenticaton = checkAuth();

  if (isProtectedPath && !isExcludedPath && !isAuthenticaton) {
    // Redirect to login if not authenticated and trying to access a protected path
    const loginUrl = new URL('/auth', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Continue to the requested page if authenticated or excluded
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
// matcher: ['/auth', '/register', '/products/:path*']
export const config = {
  matcher: ["/", "/products", "/product/:path*", "/categories", "/auth/:path*"],
};
