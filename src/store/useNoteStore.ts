import { create } from "zustand"

interface NoteStore {
  notes: any[]
  loading: boolean
  fetchNotes: (tripId: string) => Promise<void>
  createNote: (data: any) => Promise<any>
  updateNote: (id: string, data: any) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  loading: false,

  fetchNotes: async (tripId: string) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/notes?tripId=${tripId}`)
      const data = await res.json()
      set({ notes: Array.isArray(data) ? data : [], loading: false })
    } catch {
      set({ loading: false })
    }
  },

  createNote: async (data: any) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const note = await res.json()
    if (res.ok) set((s) => ({ notes: [note, ...s.notes] }))
    return note
  },

  updateNote: async (id: string, data: any) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      set((s) => ({ notes: s.notes.map((n) => (n._id === id ? updated : n)) }))
    }
  },

  deleteNote: async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
    if (res.ok) set((s) => ({ notes: s.notes.filter((n) => n._id !== id) }))
  },
}))
