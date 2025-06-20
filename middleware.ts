// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  // 로그인 없이 접근 허용할 경로들
  const publicPaths = [
    "/modules/staff-management/instructor",
    "/modules/staff-management/admin",
    "/modules", // 모듈 선택 인덱스
  ]

  const isPublic = publicPaths.some((path) => url.pathname.startsWith(path))

  if (isPublic) {
    return NextResponse.next()
  }

  // 로그인 안 됐다고 가정하고 무조건 로그인 페이지로 이동
  // 실제 로그인 쿠키 확인하려면 조건 추가 가능
  return NextResponse.redirect(new URL("/login", req.url))
}
