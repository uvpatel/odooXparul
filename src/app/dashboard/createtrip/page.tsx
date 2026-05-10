"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, DollarSign, Sparkles, Plane, Loader2 } from "lucide-react";

export default function CreateTripPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      // Here we would typically redirect to the itinerary page
      // router.push("/dashboard/itinerary?id=new_trip_id")
    }, 3000);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-3">
          Plan Your Next Journey <Plane className="h-8 w-8 text-indigo-500" />
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          How would you like to build your itinerary? Use our AI assistant or plan manually.
        </p>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-neutral-100/50 dark:bg-neutral-800/50 p-1">
          <TabsTrigger value="ai" className="text-base rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all flex gap-2">
            <Sparkles className="h-5 w-5" /> AI Smart Generator
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-base rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex gap-2">
            <MapPin className="h-5 w-5" /> Manual Planning
          </TabsTrigger>
        </TabsList>
        
        {/* AI GENERATOR TAB */}
        <TabsContent value="ai" className="mt-6">
          <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-md relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-indigo-500" /> Let AI Do the Heavy Lifting
              </CardTitle>
              <CardDescription className="text-base">
                Describe your dream trip, and our AI will generate a complete day-by-day itinerary, budget, and packing list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAIGenerate} className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <Label htmlFor="ai-prompt" className="text-base font-medium">What's your vision?</Label>
                  <div className="relative">
                    <textarea 
                      id="ai-prompt"
                      className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none"
                      placeholder="e.g. A 7-day budget trip to Goa under ₹25,000 for couples, focusing on hidden beaches and adventure activities."
                      required
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/30 dark:text-indigo-300">Quick prompt</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Travel Style</Label>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Backpacker / Budget</SelectItem>
                        <SelectItem value="balanced">Balanced / Standard</SelectItem>
                        <SelectItem value="luxury">Luxury / Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pace</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select pace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relaxed">Relaxed (1-2 activities/day)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="fast">Fast-paced (See everything)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Point</Label>
                    <Input placeholder="City or Airport" className="bg-background" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-medium bg-linear-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white shadow-lg transition-all"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate AI Trip
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MANUAL PLANNING TAB */}
        <TabsContent value="manual" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Manual Trip Details</CardTitle>
              <CardDescription>
                Build your itinerary from scratch by defining the basic parameters first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">Trip Name <span className="text-red-500">*</span></Label>
                <Input id="title" placeholder="e.g. Summer Euro Trip 2026" className="h-12 text-lg" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destinations">Primary Destination(s)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <Input id="destinations" placeholder="Paris, Rome, etc." className="pl-10 h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <Input id="budget" type="number" placeholder="5000" className="pl-10 h-11" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <Input id="start-date" type="date" className="pl-10 h-11 [&::-webkit-calendar-picker-indicator]:opacity-0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <Input id="end-date" type="date" className="pl-10 h-11 [&::-webkit-calendar-picker-indicator]:opacity-0" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Trip Description / Notes (Optional)</Label>
                <textarea 
                  id="description"
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
                  placeholder="Any specific goals or places you must see?"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6 pb-2">
              <Button variant="outline" className="px-6">Cancel</Button>
              <Button className="px-8 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200">
                Continue to Itinerary Builder
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
