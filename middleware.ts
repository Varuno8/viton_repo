// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Configure public routes that don’t require auth:
  publicRoutes: ["/", "/products(.*)", "/api/try-on/status(.*)"],
});

export const config = {
  matcher: [
    // Run middleware on all routes except static files
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
