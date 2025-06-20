
// 🔽 여기에 v0에서 복사한 코드 붙여넣기
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Download,
  Send,
  AlertTriangle,
  Clock,
  Users,
  FileSpreadsheet,
  CalendarDays,
  Filter,
  Search,
  RefreshCw,
  Bell,
} from "lucide-react"
import { mockAttendance } from "@/data/mock-instructor-data"
import type { AttendanceRecord } from "@/types/instructor"

const statusConfig = {
  출근: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "🟢",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  지각: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "🟡",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
  },
  결근: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "🔴",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
  조퇴: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "🟠",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
  },
  미기록: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "⚪",
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
  },
}

export function AttendanceMonitoring() {
  const [selectedDate, setSelectedDate] = useState("2024-01-15")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showUnrecordedOnly, setShowUnrecordedOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendance || [])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredData = (attendanceData || []).filter((record) => {
    const matchesDate = record?.date === selectedDate
    const matchesStatus = statusFilter === "all" || record?.status === statusFilter
    const matchesUnrecorded = !showUnrecordedOnly || record?.status === "미기록"
    const matchesSearch = !searchTerm || record?.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDate && matchesStatus && matchesUnrecorded && matchesSearch
  })

  const stats = {
    total: filteredData.length,
    unrecorded: filteredData.filter((r) => r?.status === "미기록").length,
    late: filteredData.filter((r) => r?.status === "지각").length,
    absent: filteredData.filter((r) => r?.status === "결근").length,
    present: filteredData.filter((r) => r?.status === "출근").length,
  }

  const handleSendNotification = async (instructorId: string, instructorName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(`${instructorName} 강사에게 출근 확인 알림이 발송되었습니다.`)
  }

  const handleDownloadData = async (period: "weekly" | "monthly", format: "csv" | "excel") => {
    setIsDownloading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert(`${period === "weekly" ? "주간" : "월간"} 출근 데이터를 ${format.toUpperCase()} 형식으로 다운로드합니다.`)
    setIsDownloading(false)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-6">
      {/* 실시간 통계 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => {
          const isTotal = key === "total"
          const statusKey =
            key === "present"
              ? "출근"
              : key === "late"
                ? "지각"
                : key === "absent"
                  ? "결근"
                  : key === "unrecorded"
                    ? "미기록"
                    : "total"
          const config = statusKey !== "total" ? statusConfig[statusKey as keyof typeof statusConfig] : null

          return (
            <Card
              key={key}
              className={`border-0 shadow-sm ring-1 ${isTotal ? "ring-blue-200" : config ? `ring-${config.textColor.split("-")[1]}-200` : "ring-gray-200"} ${isTotal ? "bg-gradient-to-br from-blue-50 to-blue-100" : config?.bgColor || "bg-gray-50"}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${isTotal ? "text-blue-700" : config?.textColor || "text-gray-700"}`}
                    >
                      {key === "total"
                        ? "총 강사"
                        : key === "present"
                          ? "출근"
                          : key === "late"
                            ? "지각"
                            : key === "absent"
                              ? "결근"
                              : "미기록"}
                    </p>
                    <p
                      className={`text-3xl font-bold ${isTotal ? "text-blue-900" : config?.textColor.replace("700", "900") || "text-gray-900"}`}
                    >
                      {value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${isTotal ? "bg-blue-200" : config ? `bg-${config.textColor.split("-")[1]}-200` : "bg-gray-200"}`}
                  >
                    {key === "total" ? (
                      <Users className={`h-6 w-6 ${isTotal ? "text-blue-700" : "text-gray-700"}`} />
                    ) : key === "unrecorded" || key === "absent" ? (
                      <AlertTriangle className={`h-6 w-6 ${config?.textColor || "text-gray-700"}`} />
                    ) : (
                      <Clock className={`h-6 w-6 ${config?.textColor || "text-gray-700"}`} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 필터 및 검색 */}
        <Card className="lg:col-span-1 shadow-sm border-0 ring-1 ring-gray-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Filter className="h-5 w-5" />
              필터 및 검색
            </CardTitle>
            <CardDescription>조회 조건을 설정하세요</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">날짜 선택</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">강사 검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="강사명으로 검색"
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">상태 필터</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      전체 상태
                    </div>
                  </SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        {status}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
              <Checkbox id="unrecorded-only" checked={showUnrecordedOnly} onCheckedChange={setShowUnrecordedOnly} />
              <Label htmlFor="unrecorded-only" className="text-sm font-medium cursor-pointer">
                미기록자만 보기
              </Label>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button onClick={handleRefresh} variant="outline" className="w-full h-11" disabled={isRefreshing}>
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    새로고침 중
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    실시간 새로고침
                  </>
                )}
              </Button>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleDownloadData("weekly", "csv")}
                  variant="outline"
                  size="sm"
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  주간 CSV
                </Button>
                <Button
                  onClick={() => handleDownloadData("monthly", "excel")}
                  variant="outline"
                  size="sm"
                  disabled={isDownloading}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  월간 Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 출근 현황 테이블 */}
        <Card className="lg:col-span-3 shadow-sm border-0 ring-1 ring-gray-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CalendarDays className="h-5 w-5" />
                  출근 현황 ({filteredData.length}명)
                </CardTitle>
                <CardDescription>
                  {selectedDate} 기준 • 마지막 업데이트: {new Date().toLocaleTimeString("ko-KR")}
                </CardDescription>
              </div>
              {stats.unrecorded > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <Bell className="h-3 w-3 mr-1" />
                  미기록 {stats.unrecorded}명
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">강사명</TableHead>
                    <TableHead className="font-semibold">상태</TableHead>
                    <TableHead className="font-semibold">출근 시간</TableHead>
                    <TableHead className="font-semibold">퇴근 시간</TableHead>
                    <TableHead className="font-semibold">비고</TableHead>
                    <TableHead className="font-semibold text-center">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record, index) => {
                    const config = statusConfig[record?.status as keyof typeof statusConfig] || statusConfig.미기록
                    return (
                      <TableRow
                        key={record?.id}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-blue-50/50 transition-colors`}
                      >
                        <TableCell className="font-medium">{record?.instructorName || "-"}</TableCell>
                        <TableCell>
                          <Badge className={`${config.color} font-medium`}>
                            <span className="mr-1">{config.icon}</span>
                            {record?.status || "미기록"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {record?.checkInTime ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {record.checkInTime}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {record?.checkOutTime ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {record.checkOutTime}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {record?.notes ? (
                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded truncate block">
                              {record.notes}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {record?.status === "미기록" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleSendNotification(record?.instructorId || "", record?.instructorName || "")
                              }
                              className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <Send className="h-3 w-3 mr-1" />
                              알림 발송
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">선택한 조건에 해당하는 데이터가 없습니다</p>
                <p className="text-sm">다른 날짜나 필터를 선택해보세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
