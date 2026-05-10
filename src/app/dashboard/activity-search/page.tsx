"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, DollarSign, Filter, Plus, Search, Star } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destination: string
}

interface Activity {
  _id: string
  tripId: string
  title: string
  type?: string
  duration?: string
  cost?: number
  location?: string
}

const categories = ["All", "Sightseeing", "Food", "Activity", "Stay", "Transport"]

export default function ActivitySearchPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      fetch("/api/trips").then((res) => res.json()),
      fetch("/api/activities").then((res) => res.json()),
    ])
      .then(([tripData, activityData]) => {
        if (!active) return
        setTrips(Array.isArray(tripData) ? tripData : [])
        setActivities(Array.isArray(activityData) ? activityData : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesText = [activity.title, activity.location, activity.type].join(" ").toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === "All" || activity.type === category
      return matchesText && matchesCategory
    })
  }, [activities, category, query])

  async function duplicateActivity(activity: Activity) {
    const targetTripId = trips[0]?._id
    if (!targetTripId) return

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripId: targetTripId,
        title: activity.title,
        type: activity.type,
        duration: activity.duration,
        cost: activity.cost,
        location: activity.location,
        day: 1,
      }),
    })
    const saved = await res.json()
    if (res.ok) setActivities((items) => [saved, ...items])
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 rounded-md">From your saved itineraries</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Find Things to Do</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search activities you have already generated or added, then reuse them in your current trip.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search activities..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Filter className="h-4 w-4" /> Filters</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2 md:flex-col">
              {categories.map((item) => (
                <Button key={item} variant={category === item ? "default" : "outline"} size="sm" onClick={() => setCategory(item)}>{item}</Button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-48" />)}
          </div>
        ) : filteredActivities.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-[260px] items-center justify-center text-center text-sm text-muted-foreground">
              No activities found. Generate a trip with AI or add activities in the itinerary builder.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredActivities.map((activity) => (
              <Card key={activity._id} className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="secondary">{activity.type || "Activity"}</Badge>
                    <span className="flex items-center gap-1 text-sm font-medium"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.8</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-tight">{activity.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{activity.location || "Location TBD"}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {activity.duration || "Flexible"}</span>
                    <span className="flex items-center gap-1 font-medium text-foreground"><DollarSign className="h-4 w-4" /> {activity.cost || 0}</span>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button className="w-full" variant="outline" onClick={() => duplicateActivity(activity)}>
                    <Plus className="h-4 w-4" /> Add to latest trip
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
