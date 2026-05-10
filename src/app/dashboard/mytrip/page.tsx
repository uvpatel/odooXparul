"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, MoreVertical, Plus, PlaneTakeoff, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTripStore } from "@/store/useTripStore";

const statusColors: Record<string, string> = {
  upcoming: "bg-emerald-500 hover:bg-emerald-600",
  planning: "bg-amber-500 hover:bg-amber-600",
  ongoing: "bg-blue-500 hover:bg-blue-600",
  completed: "bg-neutral-500 hover:bg-neutral-600",
};

const coverImages = [
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
];

export default function MyTripsPage() {
  const { trips, loading, fetchTrips, deleteTrip } = useTripStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      await deleteTrip(id);
    }
  };

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="ml-3 text-neutral-500">Loading your trips...</span>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <PlaneTakeoff className="h-16 w-16 text-neutral-300 mx-auto" />
          <h2 className="text-2xl font-semibold text-neutral-600 dark:text-neutral-400">No trips yet</h2>
          <p className="text-neutral-500">Create your first trip to get started!</p>
          <Link href="/dashboard/createtrip">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 mt-2">
              <Sparkles className="h-4 w-4" />
              Create Your First Trip
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <Card key={trip._id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-neutral-200/60 dark:border-neutral-800">
              <div className="h-48 overflow-hidden relative">
                <img
                  src={trip.coverImage || coverImages[index % coverImages.length]}
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={`${statusColors[trip.status] || statusColors.planning} border-none capitalize`}>
                    {trip.status || "Planning"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl line-clamp-1">{trip.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mr-2 -mt-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(trip._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {(trip.startDate || trip.endDate) && (
                  <CardDescription className="flex items-center gap-1.5 mt-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {trip.startDate || "TBD"} → {trip.endDate || "TBD"}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-indigo-500" />
                  <span className="line-clamp-2">{trip.destination}</span>
                </div>
                {trip.budget && (
                  <p className="text-sm text-emerald-600 font-medium mt-2">
                    Budget: ${trip.budget.toLocaleString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0 border-t mt-4 flex justify-between">
                <Link href={`/dashboard/itinerary?tripId=${trip._id}`} className="w-full mt-4">
                  <Button variant="outline" className="w-full">View Itinerary</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/><path d="M22 5h-4"/>
    </svg>
  );
}
