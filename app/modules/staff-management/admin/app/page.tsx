'use client'

import { AttendanceMonitoring } from './modules/staff-management/admin/components/AttendanceMonitoring'

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">출결 관리 테스트 화면</h1>
      <AttendanceMonitoring />
    </main>
  )
}

