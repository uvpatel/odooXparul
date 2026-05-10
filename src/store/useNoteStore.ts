import { create } from "zustand"

export interface NoteRecord {
  _id: string
  tripId: string
  title?: string
  content: string
  tags?: string[]
}

export type NotePayload = Omit<Partial<NoteRecord>, "_id">

interface NoteStore {
  notes: NoteRecord[]
  loading: boolean
  fetchNotes: (tripId: string) => Promise<void>
  createNote: (data: NotePayload) => Promise<NoteRecord | { error?: string }>
  updateNote: (id: string, data: NotePayload) => Promise<void>
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

  createNote: async (data: NotePayload) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const note = await res.json()
    if (res.ok) set((state) => ({ notes: [note, ...state.notes] }))
    return note
  },

  updateNote: async (id: string, data: NotePayload) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({ notes: state.notes.map((note) => (note._id === id ? updated : note)) }))
    }
  },

  deleteNote: async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
    if (res.ok) set((state) => ({ notes: state.notes.filter((note) => note._id !== id) }))
  },
}))
