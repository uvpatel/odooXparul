"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Briefcase, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react"

interface Trip {
  _id: string
  title: string
}

interface PackingItem {
  _id: string
  tripId: string
  item_name: string
  category?: string
  checked?: boolean
}

export default function PackingChecklistPage() {
  const searchParams = useSearchParams()
  const requestedTripId = searchParams.get("tripId")
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripId, setSelectedTripId] = useState("")
  const [items, setItems] = useState<PackingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState("")
  const [category, setCategory] = useState("Essentials")

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
    fetch(`/api/packing?tripId=${selectedTripId}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) setItems(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [selectedTripId])

  const currentTrip = trips.find((trip) => trip._id === selectedTripId)
  const packedItems = items.filter((item) => item.checked).length
  const progress = items.length ? Math.round((packedItems / items.length) * 100) : 0
  const groupedItems = useMemo(() => {
    const groups = new Map<string, PackingItem[]>()
    for (const item of items) {
      const key = item.category || "Essentials"
      groups.set(key, [...(groups.get(key) || []), item])
    }
    return Array.from(groups, ([name, groupItems]) => ({ name, items: groupItems }))
  }, [items])

  async function addItem() {
    if (!selectedTripId || !newItem.trim()) return
    const optimistic: PackingItem = { _id: `temp-${Date.now()}`, tripId: selectedTripId, item_name: newItem, category, checked: false }
    setItems((value) => [...value, optimistic])
    setNewItem("")
    const res = await fetch("/api/packing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId: selectedTripId, title: optimistic.item_name, category }),
    })
    const saved = await res.json()
    if (res.ok) setItems((value) => value.map((item) => (item._id === optimistic._id ? saved : item)))
    else setItems((value) => value.filter((item) => item._id !== optimistic._id))
  }

  async function toggleItem(item: PackingItem) {
    setItems((value) => value.map((entry) => (entry._id === item._id ? { ...entry, checked: !entry.checked } : entry)))
    const res = await fetch(`/api/packing/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked: !item.checked }),
    })
    if (!res.ok) setItems((value) => value.map((entry) => (entry._id === item._id ? item : entry)))
  }

  async function deleteItem(id: string) {
    const previous = items
    setItems((value) => value.filter((item) => item._id !== id))
    const res = await fetch(`/api/packing/${id}`, { method: "DELETE" })
    if (!res.ok) setItems(previous)
  }

  if (loading) return <div className="space-y-4 p-6"><Skeleton className="h-10 w-72" /><Skeleton className="h-28" /><Skeleton className="h-96" /></div>

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 rounded-md">{currentTrip?.title || "No trip selected"}</Badge>
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">Packing Checklist <Briefcase className="h-6 w-6 text-indigo-500" /></h1>
          <p className="mt-1 text-sm text-muted-foreground">Sync packing items with MongoDB and track completion in real time.</p>
        </div>
      </div>

      {!selectedTripId ? (
        <Card className="border-dashed"><CardContent className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">Create a trip to start a packing list.</CardContent></Card>
      ) : (
        <>
          <Card className="bg-indigo-50 dark:bg-indigo-950/20">
            <CardContent className="p-5">
              <div className="mb-3 flex items-end justify-between">
                <div><p className="text-sm text-indigo-700 dark:text-indigo-300">Packing Progress</p><h2 className="text-2xl font-semibold">{packedItems} of {items.length} items</h2></div>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-indigo-200/60"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_180px_auto]">
              <Input placeholder="Add item..." value={newItem} onChange={(e) => setNewItem(e.target.value)} />
              <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <Button onClick={addItem}><Plus className="h-4 w-4" /> Add</Button>
            </CardContent>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            {groupedItems.map((group) => (
              <Card key={group.name}>
                <CardHeader className="border-b pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="secondary">{group.items.filter((item) => item.checked).length}/{group.items.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 p-4">
                  {group.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-muted/50">
                      <button className="flex items-center gap-3 text-left" onClick={() => toggleItem(item)}>
                        {item.checked ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                        <span className={item.checked ? "text-sm font-medium text-muted-foreground line-through" : "text-sm font-medium"}>{item.item_name}</span>
                      </button>
                      <Button variant="ghost" size="icon" onClick={() => deleteItem(item._id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
