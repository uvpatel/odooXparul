"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Navigation, Star, ArrowRight, Plus } from "lucide-react";

const cities = [
  { name: "Paris", country: "France", index: "$$$", popular: true, image: "https://images.unsplash.com/photo-1502602898657-3e9076295eb1?auto=format&fit=crop&w=600&q=80" },
  { name: "Tokyo", country: "Japan", index: "$$$", popular: true, image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&q=80" },
  { name: "Bali", country: "Indonesia", index: "$", popular: true, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80" },
  { name: "Rome", country: "Italy", index: "$$", popular: false, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80" },
  { name: "Cape Town", country: "South Africa", index: "$$", popular: false, image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80" },
  { name: "Rio de Janeiro", country: "Brazil", index: "$", popular: false, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80" }
];

export default function CitySearchPage() {
  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Discover Destinations</h1>
        <p className="text-lg text-neutral-500">
          Search over 10,000 cities to add to your personalized itinerary.
        </p>
        
        <div className="relative mt-8">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
          <Input 
            placeholder="Search for a city, country, or region..." 
            className="pl-12 h-14 text-lg rounded-full shadow-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
          />
          <Button className="absolute right-1.5 top-1.5 rounded-full px-6 bg-indigo-600 hover:bg-indigo-700">
            Search
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
          <span className="text-sm text-neutral-500">Popular:</span>
          {["London", "Dubai", "Singapore", "New York"].map(tag => (
            <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Trending Destinations <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <Card key={i} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-neutral-50 dark:bg-neutral-900/50">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={city.image} 
                  alt={city.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold">{city.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-white/80 mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {city.country}
                      </p>
                    </div>
                    <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none">
                      {city.index}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 flex gap-2">
                <Button className="w-full bg-neutral-900 dark:bg-white dark:text-neutral-900 gap-2">
                  <Plus className="h-4 w-4" /> Add to Trip
                </Button>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Navigation className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
