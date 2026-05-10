import { create } from "zustand"

export interface PackingRecord {
  _id: string
  tripId: string
  item_name: string
  category?: string
  checked?: boolean
}

export type PackingPayload = Omit<Partial<PackingRecord>, "_id">

interface PackingStore {
  items: PackingRecord[]
  loading: boolean
  fetchItems: (tripId: string) => Promise<void>
  createItem: (data: PackingPayload) => Promise<PackingRecord | { error?: string }>
  toggleItem: (id: string, checked: boolean) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export const usePackingStore = create<PackingStore>((set) => ({
  items: [],
  loading: false,

  fetchItems: async (tripId: string) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/packing?tripId=${tripId}`)
      const data = await res.json()
      set({ items: Array.isArray(data) ? data : [], loading: false })
    } catch {
      set({ loading: false })
    }
  },

  createItem: async (data: PackingPayload) => {
    const res = await fetch("/api/packing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const item = await res.json()
    if (res.ok) set((state) => ({ items: [...state.items, item] }))
    return item
  },

  toggleItem: async (id: string, checked: boolean) => {
    const res = await fetch(`/api/packing/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked }),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({ items: state.items.map((item) => (item._id === id ? updated : item)) }))
    }
  },

  deleteItem: async (id: string) => {
    const res = await fetch(`/api/packing/${id}`, { method: "DELETE" })
    if (res.ok) set((state) => ({ items: state.items.filter((item) => item._id !== id) }))
  },
}))
