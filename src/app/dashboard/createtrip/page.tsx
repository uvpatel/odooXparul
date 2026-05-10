"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, DollarSign, Sparkles, Plane, Loader2, CheckCircle } from "lucide-react";
import { useTripStore } from "@/store/useTripStore";

export default function CreateTripPage() {
  const router = useRouter();
  const { createTrip } = useTripStore();

  // AI tab state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [pace, setPace] = useState("medium");
  const [startingPoint, setStartingPoint] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState("");

  // Manual tab state
  const [manualData, setManualData] = useState({
    title: "",
    destination: "",
    budget: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [manualLoading, setManualLoading] = useState(false);

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setAiError("");
    setAiResult(null);

    try {
      const res = await fetch("/api/ai/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, travelStyle, pace, startingPoint }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiError(data.error || "Failed to generate trip");
        return;
      }

      setAiResult(data);
    } catch (err) {
      setAiError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualLoading(true);

    try {
      const trip = await createTrip({
        title: manualData.title,
        destination: manualData.destination,
        budget: manualData.budget ? Number(manualData.budget) : undefined,
        startDate: manualData.startDate,
        endDate: manualData.endDate,
        description: manualData.description,
      });

      if (trip?._id) {
        router.push("/dashboard/mytrip");
      }
    } catch {
      // handle error
    } finally {
      setManualLoading(false);
    }
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
                  <Label htmlFor="ai-prompt" className="text-base font-medium">What&apos;s your vision?</Label>
                  <textarea
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none"
                    placeholder="e.g. A 7-day budget trip to Goa under ₹25,000 for couples, focusing on hidden beaches and adventure activities."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Travel Style</Label>
                    <Select value={travelStyle} onValueChange={setTravelStyle}>
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
                    <Select value={pace} onValueChange={setPace}>
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
                    <Input
                      placeholder="City or Airport"
                      value={startingPoint}
                      onChange={(e) => setStartingPoint(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                {aiError && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    {aiError}
                  </div>
                )}

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

              {/* AI Result Preview */}
              {aiResult && (
                <div className="mt-8 space-y-4 border-t pt-6">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Trip Generated Successfully!</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                      <span className="text-neutral-500">Trip</span>
                      <p className="font-semibold">{aiResult.trip?.title}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                      <span className="text-neutral-500">Destination</span>
                      <p className="font-semibold">{aiResult.trip?.destination}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                      <span className="text-neutral-500">Days</span>
                      <p className="font-semibold">{aiResult.itinerary?.length || 0} days</p>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                      <span className="text-neutral-500">Est. Budget</span>
                      <p className="font-semibold">${aiResult.trip?.budget || 0}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => router.push("/dashboard/mytrip")}
                  >
                    View My Trip →
                  </Button>
                </div>
              )}
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
            <form onSubmit={handleManualSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">Trip Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="e.g. Summer Euro Trip 2026"
                    className="h-12 text-lg"
                    required
                    value={manualData.title}
                    onChange={(e) => setManualData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="destinations">Primary Destination(s) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                      <Input
                        id="destinations"
                        placeholder="Paris, Rome, etc."
                        className="pl-10 h-11"
                        required
                        value={manualData.destination}
                        onChange={(e) => setManualData(prev => ({ ...prev, destination: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Estimated Budget</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                      <Input
                        id="budget"
                        type="number"
                        placeholder="5000"
                        className="pl-10 h-11"
                        value={manualData.budget}
                        onChange={(e) => setManualData(prev => ({ ...prev, budget: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                      <Input
                        id="start-date"
                        type="date"
                        className="pl-10 h-11"
                        value={manualData.startDate}
                        onChange={(e) => setManualData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                      <Input
                        id="end-date"
                        type="date"
                        className="pl-10 h-11"
                        value={manualData.endDate}
                        onChange={(e) => setManualData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Trip Description / Notes (Optional)</Label>
                  <textarea
                    id="description"
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
                    placeholder="Any specific goals or places you must see?"
                    value={manualData.description}
                    onChange={(e) => setManualData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6 pb-2">
                <Button type="button" variant="outline" className="px-6" onClick={() => router.back()}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={manualLoading}
                  className="px-8 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  {manualLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    "Create Trip"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
