"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, NotebookPen, Plus, Search, Trash2 } from "lucide-react"

interface Trip {
  _id: string
  title: string
}

interface Note {
  _id: string
  tripId: string
  title?: string
  content: string
  tags?: string[]
  updatedAt?: string
}

export default function TripNotesPage() {
  const searchParams = useSearchParams()
  const requestedTripId = searchParams.get("tripId")
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripId, setSelectedTripId] = useState("")
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [form, setForm] = useState({ title: "", content: "", tags: "" })

  useEffect(() => {
    let active = true
    fetch("/api/trips")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        const nextTrips = Array.isArray(data) ? data : []
        setTrips(nextTrips)
        setSelectedTripId(requestedTripId || nextTrips[0]?._id || "")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [requestedTripId])

  useEffect(() => {
    if (!selectedTripId) return
    let active = true
    fetch(`/api/notes?tripId=${selectedTripId}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) setNotes(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [selectedTripId])

  const currentTrip = trips.find((trip) => trip._id === selectedTripId)
  const filteredNotes = useMemo(() => {
    const needle = query.toLowerCase()
    return notes.filter((note) => [note.title, note.content, ...(note.tags || [])].join(" ").toLowerCase().includes(needle))
  }, [notes, query])

  async function createNote() {
    if (!selectedTripId || !form.content.trim()) return
    const optimistic: Note = {
      _id: `temp-${Date.now()}`,
      tripId: selectedTripId,
      title: form.title || "Untitled note",
      content: form.content,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    }
    setNotes((items) => [optimistic, ...items])
    setForm({ title: "", content: "", tags: "" })
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(optimistic),
    })
    const saved = await res.json()
    if (res.ok) setNotes((items) => items.map((note) => (note._id === optimistic._id ? saved : note)))
    else setNotes((items) => items.filter((note) => note._id !== optimistic._id))
  }

  async function deleteNote(id: string) {
    const previous = notes
    setNotes((items) => items.filter((note) => note._id !== id))
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
    if (!res.ok) setNotes(previous)
  }

  if (loading) return <div className="space-y-4 p-6"><Skeleton className="h-10 w-72" /><Skeleton className="h-24" /><Skeleton className="h-96" /></div>

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 rounded-md">{currentTrip?.title || "No trip selected"}</Badge>
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">Trip Journal & Notes <NotebookPen className="h-6 w-6 text-indigo-500" /></h1>
          <p className="mt-1 text-sm text-muted-foreground">Search, tag, create, and remove notes synced to MongoDB.</p>
        </div>
      </div>

      {!selectedTripId ? (
        <Card className="border-dashed"><CardContent className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">Create a trip to start writing notes.</CardContent></Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
            <Card>
              <CardHeader><CardTitle>New Note</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm((value) => ({ ...value, title: e.target.value }))} />
                <textarea className="min-h-32 w-full resize-none rounded-md border bg-background px-3 py-2 text-sm" placeholder="Markdown, booking refs, reminders..." value={form.content} onChange={(e) => setForm((value) => ({ ...value, content: e.target.value }))} />
                <Input placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm((value) => ({ ...value, tags: e.target.value }))} />
                <Button className="w-full" onClick={createNote}><Plus className="h-4 w-4" /> Save note</Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search notes..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredNotes.length === 0 ? (
                  <Card className="border-dashed md:col-span-2"><CardContent className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">No notes found.</CardContent></Card>
                ) : filteredNotes.map((note) => (
                  <Card key={note._id} className="flex min-h-56 flex-col">
                    <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                      <div>
                        <CardTitle className="text-lg">{note.title || "Untitled note"}</CardTitle>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(note.tags || []).map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteNote(note._id)}><Trash2 className="h-4 w-4" /></Button>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{note.content}</p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground"><Clock className="mr-1 h-3 w-3" /> Autosaved to TravelLoop</CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
