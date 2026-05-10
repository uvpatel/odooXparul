"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, MapPin, NotebookPen, PackageCheck, PlaneTakeoff, Plus, Wallet } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destination: string
  budget?: number
  startDate?: string
  endDate?: string
  createdAt?: string
}

interface Expense {
  _id: string
  tripId: string
  category: string
  amount: number
}

interface Activity {
  _id: string
  title: string
  tripId: string
  day?: number
  createdAt?: string
}

interface Note {
  _id: string
  title?: string
  content: string
  createdAt?: string
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    Promise.all([
      fetch("/api/trips").then((res) => res.json()),
      fetch("/api/expenses").then((res) => res.json()),
      fetch("/api/activities").then((res) => res.json()),
    ])
      .then(([tripData, expenseData, activityData]) => {
        if (!active) return
        const nextTrips = Array.isArray(tripData) ? tripData : []
        setTrips(nextTrips)
        setExpenses(Array.isArray(expenseData) ? expenseData : [])
        setActivities(Array.isArray(activityData) ? activityData : [])
        const firstTripId = nextTrips[0]?._id
        return firstTripId ? fetch(`/api/notes?tripId=${firstTripId}`).then((res) => res.json()) : []
      })
      .then((noteData) => {
        if (!active) return
        setNotes(Array.isArray(noteData) ? noteData : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0)
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const upcomingTrips = trips.slice(0, 3)

  const chartData = useMemo(() => {
    return trips.slice(0, 6).reverse().map((trip) => {
      const spent = expenses.filter((expense) => expense.tripId === trip._id).reduce((sum, expense) => sum + expense.amount, 0)
      return {
        name: trip.destination,
        budget: trip.budget || 0,
        spent,
      }
    })
  }, [expenses, trips])

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 rounded-md">TravelLoop command center</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live trip analytics, upcoming plans, spending, and recent activity.</p>
        </div>
        <Button asChild className="bg-indigo-600 text-white hover:bg-indigo-700">
          <Link href="/dashboard/createtrip"><Plus className="h-4 w-4" /> Create trip</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={PlaneTakeoff} label="Trips" value={trips.length.toString()} helper={`${upcomingTrips.length} upcoming`} />
        <MetricCard icon={Wallet} label="Total budget" value={`INR ${totalBudget.toLocaleString()}`} helper={`INR ${totalSpent.toLocaleString()} spent`} />
        <MetricCard icon={CalendarDays} label="Activities" value={activities.length.toString()} helper="Across itineraries" />
        <MetricCard icon={NotebookPen} label="Recent notes" value={notes.length.toString()} helper="For latest trip" />
      </div>

      {trips.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-center">
            <PlaneTakeoff className="h-10 w-10 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">No trips yet</h2>
              <p className="text-sm text-muted-foreground">Create or generate a trip to unlock the dashboard.</p>
            </div>
            <Button asChild><Link href="/dashboard/createtrip">Create your first trip</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Budget Health</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="budget" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="spent" stroke="#10b981" fill="#10b981" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Trips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{trip.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {trip.destination}</p>
                    </div>
                    <Badge variant="secondary">INR {(trip.budget || 0).toLocaleString()}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button asChild size="sm" variant="outline"><Link href={`/dashboard/itinerary?tripId=${trip._id}`}>Itinerary</Link></Button>
                    <Button asChild size="sm" variant="outline"><Link href={`/dashboard/trip-budget?tripId=${trip._id}`}>Budget</Link></Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <QuickLink href="/dashboard/citysearch" icon={MapPin} title="Discover cities" />
        <QuickLink href="/dashboard/packing-checklist" icon={PackageCheck} title="Packing checklist" />
        <QuickLink href="/dashboard/trip-notes" icon={NotebookPen} title="Trip notes" />
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, helper }: { icon: React.ElementType; label: string; value: string; helper: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/40">
          <Icon className="h-5 w-5" />
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

function QuickLink({ href, icon: Icon, title }: { href: string; icon: React.ElementType; title: string }) {
  return (
    <Link href={href} className="group rounded-lg border p-4 transition-colors hover:bg-muted/40">
      <Icon className="mb-3 h-5 w-5 text-indigo-500" />
      <span className="font-medium group-hover:text-indigo-600">{title}</span>
    </Link>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}
      </div>
      <Skeleton className="h-[360px]" />
    </div>
  )
}
