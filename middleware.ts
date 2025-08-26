// import { clerkMiddleware } from '@clerk/nextjs/server'

// export default clerkMiddleware()

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// }
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
