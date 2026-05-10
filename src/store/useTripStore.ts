import { create } from "zustand"

export interface TripRecord {
  _id: string
  title: string
  destination: string
  description?: string
  startDate?: string
  endDate?: string
  budget?: number
  travelers?: number
  status?: string
  coverImage?: string
}

export type TripPayload = Omit<Partial<TripRecord>, "_id">

interface TripStore {
  trips: TripRecord[]
  currentTrip: TripRecord | null
  loading: boolean
  fetchTrips: () => Promise<void>
  fetchTrip: (id: string) => Promise<void>
  createTrip: (data: TripPayload) => Promise<TripRecord>
  updateTrip: (id: string, data: TripPayload) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
}

export const useTripStore = create<TripStore>((set) => ({
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
      set({ currentTrip: res.ok ? data : null, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  createTrip: async (data: TripPayload) => {
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const trip = await res.json() as TripRecord
    if (res.ok) {
      set((state) => ({ trips: [trip, ...state.trips] }))
    }
    return trip
  },

  updateTrip: async (id: string, data: TripPayload) => {
    const res = await fetch(`/api/trips/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({
        trips: state.trips.map((trip) => (trip._id === id ? updated : trip)),
        currentTrip: state.currentTrip?._id === id ? updated : state.currentTrip,
      }))
    }
  },

  deleteTrip: async (id: string) => {
    const res = await fetch(`/api/trips/${id}`, { method: "DELETE" })
    if (res.ok) {
      set((state) => ({
        trips: state.trips.filter((trip) => trip._id !== id),
        currentTrip: state.currentTrip?._id === id ? null : state.currentTrip,
      }))
    }
  },
}))
