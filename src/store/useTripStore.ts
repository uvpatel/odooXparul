import { create } from "zustand"

interface TripStore {
  trips: any[]
  currentTrip: any | null
  loading: boolean

  fetchTrips: () => Promise<void>
  fetchTrip: (id: string) => Promise<void>
  createTrip: (data: any) => Promise<any>
  updateTrip: (id: string, data: any) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  currentTrip: null,
  loading: false,

  fetchTrips: async () => {
    set({ loading: true })
    try {
      const res = await fetch("/api/trips")
      const data = await res.json()
      set({ trips: Array.isArray(data) ? data : [], loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchTrip: async (id: string) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/trips/${id}`)
      const data = await res.json()
      set({ currentTrip: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  createTrip: async (data: any) => {
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const trip = await res.json()
    if (res.ok) {
      set((state) => ({ trips: [trip, ...state.trips] }))
    }
    return trip
  },

  updateTrip: async (id: string, data: any) => {
    const res = await fetch(`/api/trips/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({
        trips: state.trips.map((t) => (t._id === id ? updated : t)),
        currentTrip: state.currentTrip?._id === id ? updated : state.currentTrip,
      }))
    }
  },

  deleteTrip: async (id: string) => {
    const res = await fetch(`/api/trips/${id}`, { method: "DELETE" })
    if (res.ok) {
      set((state) => ({
        trips: state.trips.filter((t) => t._id !== id),
        currentTrip: state.currentTrip?._id === id ? null : state.currentTrip,
      }))
    }
  },
}))
