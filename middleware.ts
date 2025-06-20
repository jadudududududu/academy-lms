// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname

  const publicPaths = [
    "/modules/staff-management/instructor",
    "/modules/staff-management/admin",
    "/modules"
  ]

  const isPublic = publicPaths.some(path => pathname.startsWith(path))

  if (isPublic) {
    return NextResponse.next()
  }

  const isLoggedIn = request.cookies.get("token")?.value

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  return NextResponse.next()
}
