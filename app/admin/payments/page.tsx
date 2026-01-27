"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"
import { getPayments, getPaymentStats, exportPayments } from "@/lib/supabase/actions/payments"
import { toast } from "sonner"

interface Payment {
  id: string
  invoice_id: string
  student_id: string
  course_id?: string
  amount: string
  currency: string
  payment_method: string
  payment_date: string
  due_date?: string
  status: string
  profiles?: { full_name: string; email: string }
  courses?: { name: string }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState({
    monthlyRevenue: "0",
    revenueChange: "0",
    pending: 0,
    overdue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [paymentsResult, statsResult] = await Promise.all([
        getPayments(),
        getPaymentStats(),
      ])

      if (paymentsResult.data) {
        setPayments(paymentsResult.data as Payment[])
      }
      if (statsResult.data) {
        setStats(statsResult.data)
      }
    } catch (err) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const { data, error } = await exportPayments('csv')
      if (error) {
        toast.error("Failed to export payments", { description: error.message })
        return
      }

      // Create blob and download
      const blob = new Blob([data as string], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Payments exported successfully")
    } catch (err) {
      toast.error("Failed to export payments")
    } finally {
      setExporting(false)
    }
  }

  const filteredPayments = payments.filter(
    (payment) =>
      (payment.profiles?.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>
      case "pending":
        return <Badge className="bg-[#ffb800]/10 text-[#ffb800]">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-700">Overdue</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a5c]">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage student payments
          </p>
        </div>
        <Button
          className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
          onClick={handleExport}
          disabled={exporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? "Exporting..." : "Export Report"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a5c]">{stats.monthlyRevenue} EGP</p>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[#3abafb]/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#3abafb]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a5c]">+{stats.revenueChange}%</p>
              <p className="text-sm text-muted-foreground">vs Last Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[#ffb800]/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-[#ffb800]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a5c]">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a5c]">{stats.overdue}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Payments ({filteredPayments.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "No payments found matching your search." : "No payments yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.invoice_id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.profiles?.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {payment.profiles?.email || ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{payment.courses?.name || "-"}</TableCell>
                    <TableCell className="font-medium">{payment.amount} {payment.currency}</TableCell>
                    <TableCell>
                      {new Date(payment.payment_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
