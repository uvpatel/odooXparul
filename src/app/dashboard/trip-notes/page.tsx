"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotebookPen, Search, Plus, Clock, MoreVertical, MapPin } from "lucide-react";

export default function TripNotesPage() {
  const [notes] = useState([
    {
      id: 1,
      title: "Hotel Check-in Details",
      content: "Booking ref: #PARIS1234\nCheck-in is at 3:00 PM. Contact host 30 mins before arrival at +33 6 12 34 56 78.",
      date: "May 10, 2026",
      location: "Paris, France",
      color: "bg-amber-100 dark:bg-amber-900/20"
    },
    {
      id: 2,
      title: "Must-try Foods",
      content: "- Escargot at Le Marais\n- Crepes near Eiffel Tower\n- Onion Soup at Montmartre",
      date: "May 12, 2026",
      location: "General",
      color: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      id: 3,
      title: "Flight PNR & Gate",
      content: "AirFrance AF1234\nPNR: X7Y8Z9\nTerminal 2E, Gate K42\nBoarding at 08:15 AM.",
      date: "May 15, 2026",
      location: "Airport",
      color: "bg-emerald-100 dark:bg-emerald-900/20"
    }
  ]);

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Trip Journal & Notes <NotebookPen className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-neutral-500 mt-1">Jot down important details, booking references, or travel memories.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="h-4 w-4" /> New Note
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
        <Input 
          placeholder="Search notes by title or content..." 
          className="pl-10 h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Note Card */}
        <Card className="shadow-sm border-dashed border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/20 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-medium text-lg text-neutral-700 dark:text-neutral-300">Create New Note</h3>
          <p className="text-sm text-neutral-500 text-center px-6 mt-1">Save quick thoughts, links, or addresses.</p>
        </Card>

        {/* Note Cards */}
        {notes.map((note) => (
          <Card key={note.id} className={`shadow-sm overflow-hidden flex flex-col ${note.color} border-none`}>
            <CardHeader className="pb-3 pt-5 px-5 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg leading-tight text-neutral-900 dark:text-neutral-100">{note.title}</CardTitle>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  <MapPin className="h-3 w-3" /> {note.location}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 shrink-0 text-neutral-600">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="px-5 flex-1">
              <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                {note.content}
              </p>
            </CardContent>
            <CardFooter className="px-5 pb-4 pt-0 text-xs text-neutral-500 flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> Last edited {note.date}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
