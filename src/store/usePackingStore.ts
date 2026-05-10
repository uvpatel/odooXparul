import { create } from "zustand"

interface PackingStore {
  items: any[]
  loading: boolean
  fetchItems: (tripId: string) => Promise<void>
  createItem: (data: any) => Promise<any>
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

  createItem: async (data: any) => {
    const res = await fetch("/api/packing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const item = await res.json()
    if (res.ok) set((s) => ({ items: [...s.items, item] }))
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
      set((s) => ({ items: s.items.map((i) => (i._id === id ? updated : i)) }))
    }
  },

  deleteItem: async (id: string) => {
    const res = await fetch(`/api/packing/${id}`, { method: "DELETE" })
    if (res.ok) set((s) => ({ items: s.items.filter((i) => i._id !== id) }))
  },
}))
