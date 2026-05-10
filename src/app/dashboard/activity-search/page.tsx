"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Clock, DollarSign, Star, Plus, Filter } from "lucide-react";

const activities = [
  // { id: 1, title: "Eiffel Tower Summit Access", type: "Sightseeing", duration: "2h", cost: 45, rating: 4.8, reviews: 1240 },
  { id: 2, title: "Seine River Dinner Cruise", type: "Food & Drink", duration: "2.5h", cost: 120, rating: 4.6, reviews: 856 },
  { id: 3, title: "Louvre Museum Skip-the-line", type: "Art & Culture", duration: "3h", cost: 35, rating: 4.9, reviews: 3420 },
  { id: 4, title: "Montmartre Walking Tour", type: "Tour", duration: "1.5h", cost: 20, rating: 4.7, reviews: 512 },
  { id: 5, title: "Croissant Baking Class", type: "Experience", duration: "2h", cost: 65, rating: 4.9, reviews: 210 },
  { id: 6, title: "Catacombs Underground Tour", type: "History", duration: "2h", cost: 55, rating: 4.5, reviews: 1105 }
];

export default function ActivitySearchPage() {
  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <Badge className="mb-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none">Paris, France</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Find Things to Do</h1>
          <p className="text-neutral-500 mt-1">Discover experiences, tours, and sights to add to your itinerary.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input placeholder="Search activities..." className="pl-9" />
          </div>
          
          <Card className="shadow-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Category</h4>
                <div className="space-y-2">
                  {["Sightseeing", "Food & Drink", "Art & Culture", "Tours", "Adventure"].map(cat => (
                    <div key={cat} className="flex items-center gap-2">
                      <input type="checkbox" id={cat} className="rounded border-neutral-300" />
                      <label htmlFor={cat} className="text-sm text-neutral-600">{cat}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Price Range</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">$</Button>
                  <Button variant="outline" size="sm" className="flex-1">$$</Button>
                  <Button variant="outline" size="sm" className="flex-1">$$$</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardContent className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="font-normal text-xs">{activity.type}</Badge>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    {activity.rating} <span className="text-neutral-400 font-normal">({activity.reviews})</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg leading-tight mb-3">{activity.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {activity.duration}
                  </div>
                  <div className="flex items-center gap-1 font-medium text-neutral-900 dark:text-neutral-100">
                    <DollarSign className="h-4 w-4" /> {activity.cost}
                  </div>
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <Button className="w-full gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50">
                  <Plus className="h-4 w-4" /> Add to Itinerary
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
