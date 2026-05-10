"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, Clock, DollarSign, GripVertical, MapPin, Navigation, Plus, Trash2 } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destination: string
  budget?: number
}

interface Activity {
  _id: string
  tripId: string
  title: string
  type?: string
  cost?: number
  duration?: string
  time?: string
  location?: string
  day?: number
}

export default function ItineraryBuilderPage() {
  const searchParams = useSearchParams()
  const requestedTripId = searchParams.get("tripId")
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripId, setSelectedTripId] = useState("")
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [newActivity, setNewActivity] = useState({ title: "", location: "", time: "", cost: "", day: "1", type: "Sightseeing" })

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
    fetch(`/api/activities?tripId=${selectedTripId}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) setActivities(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [selectedTripId])

  const currentTrip = trips.find((trip) => trip._id === selectedTripId)
  const itineraryDays = useMemo(() => {
    const grouped = new Map<number, Activity[]>()
    for (const activity of activities) {
      const day = activity.day || 1
      grouped.set(day, [...(grouped.get(day) || []), activity])
    }
    return Array.from(grouped, ([day, dayActivities]) => ({ day, activities: dayActivities })).sort((a, b) => a.day - b.day)
  }, [activities])
  const totalCost = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0)

  async function addActivity() {
    if (!selectedTripId || !newActivity.title.trim()) return
    const optimisticId = `temp-${Date.now()}`
    const optimistic: Activity = {
      _id: optimisticId,
      tripId: selectedTripId,
      title: newActivity.title,
      location: newActivity.location,
      time: newActivity.time,
      cost: Number(newActivity.cost) || 0,
      day: Number(newActivity.day) || 1,
      type: newActivity.type,
    }
    setActivities((items) => [...items, optimistic])
    setNewActivity({ title: "", location: "", time: "", cost: "", day: "1", type: "Sightseeing" })

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...optimistic, _id: undefined }),
    })
    const saved = await res.json()
    if (res.ok) {
      setActivities((items) => items.map((item) => (item._id === optimisticId ? saved : item)))
    } else {
      setActivities((items) => items.filter((item) => item._id !== optimisticId))
    }
  }

  async function deleteActivity(id: string) {
    const previous = activities
    setActivities((items) => items.filter((item) => item._id !== id))
    const res = await fetch(`/api/activities/${id}`, { method: "DELETE" })
    if (!res.ok) setActivities(previous)
  }

  if (loading) return <ItinerarySkeleton />

  if (!selectedTripId) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 p-10 text-center">
        <CalendarDays className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">No trip selected</h1>
        <p className="text-sm text-muted-foreground">Create a trip first, then your itinerary timeline will appear here.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 rounded-md">{currentTrip?.title || "Selected trip"}</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Itinerary Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">{currentTrip?.destination || "Destination"} - {activities.length} activities, INR {totalCost.toLocaleString()} planned</p>
        </div>
        <Button variant="outline"><Navigation className="h-4 w-4" /> Map placeholder</Button>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_120px_120px_120px_auto]">
          <Input placeholder="Activity title" value={newActivity.title} onChange={(e) => setNewActivity((value) => ({ ...value, title: e.target.value }))} />
          <Input placeholder="Location" value={newActivity.location} onChange={(e) => setNewActivity((value) => ({ ...value, location: e.target.value }))} />
          <Input placeholder="Time" value={newActivity.time} onChange={(e) => setNewActivity((value) => ({ ...value, time: e.target.value }))} />
          <Input placeholder="Day" type="number" value={newActivity.day} onChange={(e) => setNewActivity((value) => ({ ...value, day: e.target.value }))} />
          <Input placeholder="Cost" type="number" value={newActivity.cost} onChange={(e) => setNewActivity((value) => ({ ...value, cost: e.target.value }))} />
          <Button onClick={addActivity}><Plus className="h-4 w-4" /> Add</Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader><CardTitle>Trip Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <SummaryLine label="Days" value={itineraryDays.length.toString()} />
            <SummaryLine label="Activities" value={activities.length.toString()} />
            <SummaryLine label="Activity cost" value={`INR ${totalCost.toLocaleString()}`} />
            <SummaryLine label="Trip budget" value={`INR ${(currentTrip?.budget || 0).toLocaleString()}`} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {itineraryDays.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">No activities yet. Add the first one above.</CardContent>
            </Card>
          ) : (
            itineraryDays.map((day) => (
              <section key={day.day} className="space-y-3">
                <div className="sticky top-12 z-10 flex items-center gap-3 border-b bg-background/90 py-3 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white">{day.day}</div>
                  <h2 className="text-xl font-semibold">Day {day.day}</h2>
                </div>
                {day.activities.map((activity, index) => (
                  <motion.div key={activity._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="relative pl-8">
                    <div className="absolute left-[11px] top-7 h-full w-px bg-border" />
                    <div className="absolute left-1.5 top-6 h-3 w-3 rounded-full border-2 border-indigo-600 bg-background" />
                    <Card className="transition-colors hover:border-indigo-300">
                      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                        <GripVertical className="hidden h-5 w-5 text-muted-foreground md:block" />
                        <div className="flex min-w-24 items-center gap-2 text-sm font-medium text-muted-foreground"><Clock className="h-4 w-4" /> {activity.time || "TBD"}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{activity.title}</h3>
                          <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {activity.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {activity.location}</span>}
                            {!!activity.cost && <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> INR {activity.cost}</span>}
                          </p>
                        </div>
                        {activity.type && <Badge variant="secondary">{activity.type}</Badge>}
                        <Button variant="ghost" size="icon" onClick={() => deleteActivity(activity._id)}><Trash2 className="h-4 w-4" /></Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between border-b pb-2 last:border-0"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>
}

function ItinerarySkeleton() {
  return <div className="space-y-4 p-6"><Skeleton className="h-10 w-72" /><Skeleton className="h-24" /><Skeleton className="h-96" /></div>
}
