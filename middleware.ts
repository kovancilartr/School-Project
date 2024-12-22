import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

// console.log(matchers);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      if (req.url === "/") {
        return NextResponse.next(); // Ana sayfaya herkes erişebilir
      }
      if (req.url.includes("/auth")) {
        if (!role) {
          // Rolü olmayan kullanıcılar için yönlendirme
          return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        if (req.url === "/auth/profile" && !allowedRoles.includes(role!)) {
          // Giriş yapmış kullanıcılar için /auth/profile kontrolü
          return NextResponse.redirect(new URL("/403", req.url)); // 403 sayfasına yönlendirme
        }
      }
      if (!allowedRoles.includes(role!)) {
        return NextResponse.redirect(new URL("/403", req.url)); // Yetkisiz erişim için 403 yönlendirmesi
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
