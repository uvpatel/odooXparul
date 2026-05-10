"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AlertTriangle, Plus, TrendingUp, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface Trip {
  _id: string
  title: string
  destination: string
  budget?: number
}

interface Expense {
  _id: string
  tripId: string
  category: string
  amount: number
  description?: string
}

const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"]

export default function TripBudgetPage() {
  const searchParams = useSearchParams()
  const requestedTripId = searchParams.get("tripId")
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripId, setSelectedTripId] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ category: "Food", amount: "", description: "" })

  useEffect(() => {
    let active = true
    fetch("/api/trips")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        const nextTrips = Array.isArray(data) ? data : []
        setTrips(nextTrips)
        setSelectedTripId(requestedTripId || nextTrips[0]?._id || "")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [requestedTripId])

  useEffect(() => {
    if (!selectedTripId) return
    let active = true
    fetch(`/api/expenses?tripId=${selectedTripId}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) setExpenses(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [selectedTripId])

  const trip = trips.find((item) => item._id === selectedTripId)
  const totalBudget = trip?.budget || 0
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = totalBudget - totalSpent
  const percentageSpent = totalBudget ? Math.min((totalSpent / totalBudget) * 100, 100) : 0
  const categories = useMemo(() => {
    const totals = new Map<string, number>()
    for (const expense of expenses) {
      totals.set(expense.category, (totals.get(expense.category) || 0) + expense.amount)
    }
    return Array.from(totals, ([name, value], index) => ({ name, value, color: colors[index % colors.length] }))
  }, [expenses])
  const dailyData = expenses.slice(0, 8).map((expense, index) => ({ day: `#${index + 1}`, spent: expense.amount, budget: totalBudget ? Math.round(totalBudget / Math.max(expenses.length, 1)) : 0 }))

  async function addExpense() {
    if (!selectedTripId || !form.amount) return
    const optimistic: Expense = {
      _id: `temp-${Date.now()}`,
      tripId: selectedTripId,
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
    }
    setExpenses((items) => [optimistic, ...items])
    setForm({ category: "Food", amount: "", description: "" })

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId: selectedTripId, category: optimistic.category, amount: optimistic.amount, description: optimistic.description }),
    })
    const saved = await res.json()
    if (res.ok) setExpenses((items) => items.map((item) => (item._id === optimistic._id ? saved : item)))
    else setExpenses((items) => items.filter((item) => item._id !== optimistic._id))
  }

  if (loading) return <div className="space-y-4 p-6"><Skeleton className="h-10 w-72" /><Skeleton className="h-32" /><Skeleton className="h-96" /></div>

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 rounded-md">{trip?.title || "No trip selected"}</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Trip Budget & Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track live spending for {trip?.destination || "your selected trip"}.</p>
        </div>
      </div>

      {!selectedTripId ? (
        <Card className="border-dashed"><CardContent className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">Create a trip to start tracking expenses.</CardContent></Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <BudgetMetric label="Total Budget" value={`INR ${totalBudget.toLocaleString()}`} helper={`${expenses.length} expenses`} />
            <BudgetMetric label="Total Spent" value={`INR ${totalSpent.toLocaleString()}`} helper={`${percentageSpent.toFixed(0)}% used`} />
            <BudgetMetric label="Remaining" value={`INR ${remaining.toLocaleString()}`} helper={remaining < 0 ? "Over budget" : "Available"} alert={remaining < 0} />
          </div>

          <Card>
            <CardContent className="grid gap-3 p-4 md:grid-cols-[160px_160px_1fr_auto]">
              <Input placeholder="Category" value={form.category} onChange={(e) => setForm((value) => ({ ...value, category: e.target.value }))} />
              <Input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm((value) => ({ ...value, amount: e.target.value }))} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm((value) => ({ ...value, description: e.target.value }))} />
              <Button onClick={addExpense}><Plus className="h-4 w-4" /> Add expense</Button>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Card>
              <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95}>
                      {categories.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expense Pace</CardTitle>
                {remaining < 0 && <Badge variant="destructive"><AlertTriangle className="h-3.5 w-3.5" /> Over budget</Badge>}
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="spent" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="budget" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function BudgetMetric({ label, value, helper, alert }: { label: string; value: string; helper: string; alert?: boolean }) {
  return (
    <Card className={alert ? "border-red-200" : ""}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={alert ? "rounded-lg bg-red-50 p-3 text-red-600" : "rounded-lg bg-indigo-50 p-3 text-indigo-600"}>
          {alert ? <TrendingUp className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-xs text-muted-foreground">{helper}</p>
        </div>
      </CardContent>
    </Card>
  )
}
