import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_REGION_ID, REGIONS } from "@/lib/regions";

/**
 * Redirect the bare root `/` to the default region (/us). The three region
 * routes (/us /latam /eu) are real pages and pass through untouched.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/${REGIONS[DEFAULT_REGION_ID].routeSlug}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
