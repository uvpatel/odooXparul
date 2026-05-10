"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, MoreHorizontal, DollarSign, GripVertical, Loader2, Navigation } from "lucide-react";
import { useTripStore } from "@/store/useTripStore";

export default function ItineraryBuilderPage() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const { currentTrip, fetchTrip } = useTripStore();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      fetchTrip(tripId);
      fetch(`/api/activities?tripId=${tripId}`)
        .then((res) => res.json())
        .then((data) => {
          setActivities(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [tripId, fetchTrip]);

  // Group activities by day
  const itineraryDays = useMemo(() => {
    const grouped: Record<number, any[]> = {};
    for (const act of activities) {
      const day = act.day || 1;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(act);
    }
    return Object.entries(grouped)
      .map(([day, acts]) => ({ day: Number(day), activities: acts }))
      .sort((a, b) => a.day - b.day);
  }, [activities]);

  const totalCost = activities.reduce((sum, a) => sum + (a.cost || 0), 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Food": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "Sightseeing": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Activity": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Stay": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Transport": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <span className="ml-3 text-neutral-500">Loading itinerary...</span>
      </div>
    );
  }

  if (!tripId) {
    return (
      <div className="container mx-auto max-w-5xl p-6 text-center py-20 space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-600">No trip selected</h2>
        <p className="text-neutral-500">Go to My Trips and select a trip to view its itinerary.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {currentTrip && (
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none mb-2">
              {currentTrip.title}
            </Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight">Itinerary Builder</h1>
          <p className="text-neutral-500 mt-1">
            {currentTrip?.destination || "Your trip"} — {itineraryDays.length} days, {activities.length} activities
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Navigation className="h-4 w-4" /> Map View
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar / Quick Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-neutral-500">Total Days</span>
                <span className="font-semibold">{itineraryDays.length} Days</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-neutral-500">Est. Cost</span>
                <span className="font-semibold text-emerald-600">${totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-neutral-500">Budget</span>
                <span className="font-semibold">${(currentTrip?.budget || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Activities</span>
                <span className="font-semibold">{activities.length} Planned</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3 space-y-8">
          {itineraryDays.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-neutral-500 text-lg">No activities yet.</p>
              <p className="text-neutral-400 text-sm">Use AI to generate a trip or add activities manually.</p>
            </div>
          ) : (
            itineraryDays.map((day) => (
              <div key={day.day} className="relative">
                {/* Day Header */}
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-3 flex items-center justify-between border-b mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 text-white rounded-md h-10 w-10 flex items-center justify-center font-bold text-lg">
                      {day.day}
                    </div>
                    <h2 className="text-xl font-bold">Day {day.day}</h2>
                  </div>
                </div>

                {/* Activities */}
                <div className="space-y-3 pl-2">
                  {day.activities.map((activity: any) => (
                    <div key={activity._id} className="relative pl-8 group">
                      <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-neutral-200 dark:bg-neutral-800" />
                      <div className="absolute left-1.5 top-5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-background z-10" />

                      <Card className="hover:border-indigo-300 transition-colors cursor-pointer group shadow-sm">
                        <div className="flex flex-row items-center p-4 gap-4">
                          <div className="cursor-grab text-neutral-300 hover:text-neutral-500">
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div className="min-w-[80px] text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                            {activity.time || "—"}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-base">{activity.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                              {activity.location && (
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activity.location}</span>
                              )}
                              {activity.cost > 0 && (
                                <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {activity.cost}</span>
                              )}
                              {activity.duration && (
                                <span className="text-xs text-neutral-400">{activity.duration}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {activity.type && (
                              <Badge className={`border-none ${getTypeColor(activity.type)}`}>
                                {activity.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
