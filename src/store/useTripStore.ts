import { create } from "zustand"

interface TripStore {
  trips: any[]
  loading: boolean
  fetchTrips: () => Promise<void>
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  loading: false,

  fetchTrips: async () => {
    set({ loading: true })
    try {
      const res = await fetch("/api/trips")
      const data = await res.json()
      set({ trips: data, loading: false })
    } catch (error) {
      console.error(error)
      set({ loading: false })
    }
  },
}))
