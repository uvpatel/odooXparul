"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, MoreVertical, Plus, PlaneTakeoff } from "lucide-react";
import Link from "next/link";

const mockTrips = [
  {
    id: 1,
    title: "Summer Euro Trip 2026",
    destinations: ["Paris", "Rome", "Barcelona"],
    startDate: "2026-06-15",
    endDate: "2026-06-30",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Bali Retreat",
    destinations: ["Ubud", "Seminyak"],
    startDate: "2026-09-10",
    endDate: "2026-09-20",
    status: "Planning",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Weekend in NYC",
    destinations: ["New York City"],
    startDate: "2025-11-20",
    endDate: "2025-11-23",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80"
  }
];

export default function MyTripsPage() {
  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            My Trips <PlaneTakeoff className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your upcoming adventures and past memories.
          </p>
        </div>
        <Link href="/dashboard/createtrip">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTrips.map((trip) => (
          <Card key={trip.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-neutral-200/60 dark:border-neutral-800">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={trip.image} 
                alt={trip.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge className={`${
                  trip.status === 'Upcoming' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                  trip.status === 'Planning' ? 'bg-amber-500 hover:bg-amber-600' : 
                  'bg-neutral-500 hover:bg-neutral-600'
                } border-none`}>
                  {trip.status}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl line-clamp-1">{trip.title}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                  <MoreVertical className="h-4 w-4 text-neutral-500" />
                </Button>
              </div>
              <CardDescription className="flex items-center gap-1.5 mt-2">
                <Calendar className="h-3.5 w-3.5" />
                {trip.startDate} to {trip.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-indigo-500" />
                <span className="line-clamp-2">{trip.destinations.join(" • ")}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 border-t mt-4 flex justify-between">
              <Link href="/dashboard/itinerary" className="w-full mt-4">
                <Button variant="outline" className="w-full">View Itinerary</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
