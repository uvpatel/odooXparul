"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, DollarSign, Sparkles, Plane, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { useTripStore } from "@/store/useTripStore";

interface AiTripActivity {
  title: string;
  time?: string;
  location?: string;
}

interface AiTripDay {
  day: number;
  city?: string;
  activities?: AiTripActivity[];
}

interface AiTripResult {
  trip?: {
    _id?: string;
    title?: string;
    destination?: string;
    budget?: number;
  };
  itinerary?: AiTripDay[];
  packingList?: Array<{ item: string; category?: string }>;
  budgetBreakdown?: Array<{ category: string; amount: number }>;
}

const promptSuggestions = [
  "5-day Himachal trip from Delhi for friends under INR 30000",
  "Romantic 4-day Goa itinerary with beaches, food, and nightlife",
  "7-day Kerala family trip with relaxed pace and nature stays",
];

export default function CreateTripPage() {
  const router = useRouter();
  const { createTrip } = useTripStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [pace, setPace] = useState("medium");
  const [startingPoint, setStartingPoint] = useState("");
  const [aiResult, setAiResult] = useState<AiTripResult | null>(null);
  const [aiError, setAiError] = useState("");

  const [manualData, setManualData] = useState({
    title: "",
    destination: "",
    budget: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [manualLoading, setManualLoading] = useState(false);

  const totalActivities = useMemo(() => {
    return aiResult?.itinerary?.reduce((count, day) => count + (day.activities?.length || 0), 0) || 0;
  }, [aiResult]);

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

      const data = (await res.json()) as AiTripResult & { error?: string };

      if (!res.ok) {
        setAiError(data.error || "Failed to generate trip");
        return;
      }

      setAiResult(data);
    } catch {
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
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Badge variant="outline" className="h-6 gap-1.5 rounded-md">
            <Sparkles className="h-3.5 w-3.5" />
            Gemini trip planner
          </Badge>
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
            Create a Trip
            <Plane className="h-7 w-7 text-indigo-500" />
          </h1>
          <p className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
            Generate a full itinerary, packing list, and starter budget, or create a simple trip manually.
          </p>
        </div>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid h-11 w-full grid-cols-2 bg-neutral-100/80 p-1 dark:bg-neutral-900">
          <TabsTrigger value="ai" className="gap-2 rounded-md">
            <Sparkles className="h-4 w-4" /> AI Generator
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2 rounded-md">
            <MapPin className="h-4 w-4" /> Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <Card className="overflow-hidden border-indigo-100 shadow-sm dark:border-indigo-950">
              <CardHeader className="border-b bg-neutral-50/70 dark:bg-neutral-950/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  AI Smart Generator
                </CardTitle>
                <CardDescription>
                  Tell Gemini what kind of trip you want. The result is saved into your dashboard automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAIGenerate} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="ai-prompt" className="text-sm font-medium">
                      What&apos;s your vision?
                    </Label>
                    <textarea
                      id="ai-prompt"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex min-h-[150px] w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Example: A 7-day budget trip to Goa under INR 25000 for couples, focused on hidden beaches and adventure activities."
                      required
                    />
                    <div className="flex flex-wrap gap-2">
                      {promptSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          className="rounded-full border bg-background px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                          onClick={() => setAiPrompt(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
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
                          <SelectItem value="relaxed">Relaxed</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="fast">Fast-paced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Starting Point</Label>
                      <Input
                        placeholder="City or airport"
                        value={startingPoint}
                        onChange={(e) => setStartingPoint(e.target.value)}
                      />
                    </div>
                  </div>

                  {aiError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                      {aiError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="h-11 w-full bg-indigo-600 text-white hover:bg-indigo-700"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating trip
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate with Gemini
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm dark:border-neutral-800">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Generated Preview</CardTitle>
                <CardDescription>Your saved AI plan will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                {!aiResult && (
                  <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
                    <Sparkles className="mb-3 h-8 w-8 text-neutral-300" />
                    <p className="text-sm font-medium">Ready when your prompt is.</p>
                    <p className="mt-1 text-xs text-neutral-500">Gemini will return itinerary days, activities, packing items, and budget categories.</p>
                  </div>
                )}

                {aiResult && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <CheckCircle className="mt-0.5 h-5 w-5" />
                      <div>
                        <p className="text-sm font-semibold">Trip generated and saved</p>
                        <p className="text-xs opacity-80">You can continue editing it from My Trips.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <ResultTile label="Trip" value={aiResult.trip?.title || "Generated trip"} />
                      <ResultTile label="Destination" value={aiResult.trip?.destination || "Destination"} />
                      <ResultTile label="Days" value={`${aiResult.itinerary?.length || 0}`} />
                      <ResultTile label="Activities" value={`${totalActivities}`} />
                      <ResultTile label="Packing" value={`${aiResult.packingList?.length || 0} items`} />
                      <ResultTile label="Budget" value={`INR ${aiResult.trip?.budget || 0}`} />
                    </div>

                    {!!aiResult.itinerary?.[0]?.activities?.length && (
                      <div className="rounded-lg border p-3">
                        <p className="mb-2 text-xs font-medium uppercase text-neutral-500">First day sample</p>
                        <div className="space-y-2">
                          {aiResult.itinerary[0].activities.slice(0, 3).map((activity, index) => (
                            <div key={`${activity.title}-${index}`} className="flex gap-2 text-sm">
                              <span className="w-16 shrink-0 text-neutral-500">{activity.time || "TBD"}</span>
                              <span className="font-medium">{activity.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="h-10 w-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => router.push("/dashboard/mytrip")}>
                      View My Trips
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-5">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Manual Trip Details</CardTitle>
              <CardDescription>Build your itinerary from scratch by defining the basic details first.</CardDescription>
            </CardHeader>
            <form onSubmit={handleManualSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">Trip Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="Summer Euro Trip 2026"
                    className="h-11"
                    required
                    value={manualData.title}
                    onChange={(e) => setManualData((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="destinations">Primary Destination <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                      <Input
                        id="destinations"
                        placeholder="Paris, Rome, etc."
                        className="h-11 pl-10"
                        required
                        value={manualData.destination}
                        onChange={(e) => setManualData((prev) => ({ ...prev, destination: e.target.value }))}
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
                        className="h-11 pl-10"
                        value={manualData.budget}
                        onChange={(e) => setManualData((prev) => ({ ...prev, budget: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                      <Input
                        id="start-date"
                        type="date"
                        className="h-11 pl-10"
                        value={manualData.startDate}
                        onChange={(e) => setManualData((prev) => ({ ...prev, startDate: e.target.value }))}
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
                        className="h-11 pl-10"
                        value={manualData.endDate}
                        onChange={(e) => setManualData((prev) => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Trip Description / Notes</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[100px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any specific goals or places you must see?"
                    value={manualData.description}
                    onChange={(e) => setManualData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pb-2 pt-6">
                <Button type="button" variant="outline" className="px-6" onClick={() => router.back()}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={manualLoading}
                  className="px-8 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  {manualLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving</>
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

function ResultTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900">
      <span className="text-xs text-neutral-500">{label}</span>
      <p className="truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
