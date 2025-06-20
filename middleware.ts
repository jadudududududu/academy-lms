// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  const publicPaths = [
    "/modules/staff-management/instructor",
    "/modules/staff-management/admin",
    "/modules"
  ]

  const isPublic = publicPaths.some(path => url.pathname.startsWith(path))

  if (isPublic) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/login", req.url))
}
