import AttendanceMonitoring from "./components/AttendanceMonitoring"

export default function AdminStaffPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">관리자 / 출결 관리</h1>
      <AttendanceMonitoring />
    </div>
  )
}
