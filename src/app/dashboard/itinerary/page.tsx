"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Navigation, Plus, MoreHorizontal, DollarSign, GripVertical } from "lucide-react";

// Mock Data
const itineraryDays = [
  {
    day: 1,
    date: "Jun 15, 2026",
    city: "Paris",
    activities: [
      { id: "a1", time: "10:00 AM", title: "Arrival & Hotel Check-in", location: "Le Marais", cost: 0, type: "Stay" },
      { id: "a2", time: "01:00 PM", title: "Lunch at L'As du Fallafel", location: "Le Marais", cost: 25, type: "Food" },
      { id: "a3", time: "03:30 PM", title: "Eiffel Tower Tour", location: "Champ de Mars", cost: 40, type: "Sightseeing" },
    ]
  },
  {
    day: 2,
    date: "Jun 16, 2026",
    city: "Paris",
    activities: [
      { id: "a4", time: "09:00 AM", title: "Louvre Museum", location: "Louvre", cost: 20, type: "Sightseeing" },
      { id: "a5", time: "02:00 PM", title: "Seine River Cruise", location: "Port de la Bourdonnais", cost: 18, type: "Activity" },
      { id: "a6", time: "07:30 PM", title: "Dinner in Montmartre", location: "Montmartre", cost: 55, type: "Food" },
    ]
  }
];

export default function ItineraryBuilderPage() {
  const [viewMode, setViewMode] = useState<"timeline" | "calendar">("timeline");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Food": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "Sightseeing": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Activity": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Stay": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none mb-2">Summer Euro Trip 2026</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Itinerary Builder</h1>
          <p className="text-neutral-500 mt-1">Drag and drop activities to organize your days.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Navigation className="h-4 w-4" /> Map View
          </Button>
          <Button className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 gap-2">
            <Plus className="h-4 w-4" /> Add Day
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar / Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-neutral-500">Total Days</span>
                <span className="font-semibold">15 Days</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-neutral-500">Est. Cost</span>
                <span className="font-semibold text-emerald-600">$5,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Activities</span>
                <span className="font-semibold">24 Planned</span>
              </div>
            </CardContent>
          </Card>
          
          <Button variant="outline" className="w-full justify-start gap-2 border-dashed">
            <Plus className="h-4 w-4" /> Add Note
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 border-dashed">
            <Plus className="h-4 w-4" /> Add Transport
          </Button>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3 space-y-8">
          {itineraryDays.map((day) => (
            <div key={day.day} className="relative">
              {/* Day Header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-3 flex items-center justify-between border-b mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 text-white rounded-md h-10 w-10 flex items-center justify-center font-bold text-lg">
                    {day.day}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {day.date}
                      <Badge variant="secondary" className="ml-2 font-normal text-xs">{day.city}</Badge>
                    </h2>
                  </div>
                </div>
                <Button variant="ghost" size="sm"><Plus className="h-4 w-4 mr-1" /> Activity</Button>
              </div>

              {/* Activities */}
              <div className="space-y-3 pl-2">
                {day.activities.map((activity, index) => (
                  <div key={activity.id} className="relative pl-8 group">
                    {/* Timeline Line */}
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-neutral-200 dark:bg-neutral-800 last:hidden" />
                    {/* Timeline Dot */}
                    <div className="absolute left-1.5 top-5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-background z-10" />

                    <Card className="hover:border-indigo-300 transition-colors cursor-pointer group shadow-sm">
                      <div className="flex flex-row items-center p-4 gap-4">
                        <div className="cursor-grab text-neutral-300 hover:text-neutral-500">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="min-w[80px] text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{activity.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activity.location}</span>
                            {activity.cost > 0 && (
                              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {activity.cost}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`border-none ${getTypeColor(activity.type)}`}>
                            {activity.type}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
