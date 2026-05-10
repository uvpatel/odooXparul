"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, MapPin, Search, Sparkles, Star } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destination: string
  budget?: number
  travelers?: number
}

const cityImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
]

export default function CitySearchPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch("/api/trips")
      .then((res) => res.json())
      .then((data) => {
        if (active) setTrips(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const destinations = useMemo(() => {
    const grouped = new Map<string, Trip[]>()
    for (const trip of trips) {
      const key = trip.destination.trim()
      if (!key) continue
      grouped.set(key, [...(grouped.get(key) || []), trip])
    }

    return Array.from(grouped, ([destination, destinationTrips], index) => ({
      destination,
      trips: destinationTrips,
      image: cityImages[index % cityImages.length],
      totalBudget: destinationTrips.reduce((sum, trip) => sum + (trip.budget || 0), 0),
      travelers: destinationTrips.reduce((sum, trip) => sum + (trip.travelers || 1), 0),
    })).filter((city) => city.destination.toLowerCase().includes(query.toLowerCase()))
  }, [query, trips])

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <Badge variant="outline" className="rounded-md"><Sparkles className="h-3.5 w-3.5" /> Dynamic destinations</Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Discover Destinations</h1>
        <p className="text-muted-foreground">Search cities already connected to your real TravelLoop trips.</p>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your destinations..." className="h-12 rounded-full pl-12" />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-72 rounded-xl" />)}
        </div>
      ) : destinations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-center">
            <MapPin className="h-10 w-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No destinations found</h2>
            <p className="max-w-md text-sm text-muted-foreground">Create a trip or generate one with AI, and its destination will appear here automatically.</p>
            <Button asChild><Link href="/dashboard/createtrip">Create trip</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((city, index) => (
            <motion.div key={city.destination} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              <Card className="group overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <img src={city.image} alt={city.destination} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-semibold">{city.destination}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/80"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {city.trips.length} trip{city.trips.length === 1 ? "" : "s"} planned</p>
                  </div>
                </div>
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-muted p-3"><p className="text-muted-foreground">Budget</p><p className="font-semibold">INR {city.totalBudget.toLocaleString()}</p></div>
                    <div className="rounded-lg bg-muted p-3"><p className="text-muted-foreground">Travelers</p><p className="font-semibold">{city.travelers}</p></div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/itinerary?tripId=${city.trips[0]._id}`}>Open itinerary <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
