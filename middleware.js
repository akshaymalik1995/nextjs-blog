import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

export const config = {
    matcher: ["/admin/:path*", "/blog/create", "/api/blog/:path*", "/blog/edit/:path*" ],
  };