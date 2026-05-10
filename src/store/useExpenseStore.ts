import { create } from "zustand"

export interface ExpenseRecord {
  _id: string
  tripId: string
  category: string
  amount: number
  description?: string
  date?: string
}

export type ExpensePayload = Omit<Partial<ExpenseRecord>, "_id">

interface ExpenseStore {
  expenses: ExpenseRecord[]
  loading: boolean
  fetchExpenses: (tripId: string) => Promise<void>
  createExpense: (data: ExpensePayload) => Promise<ExpenseRecord | { error?: string }>
  updateExpense: (id: string, data: ExpensePayload) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  loading: false,

  fetchExpenses: async (tripId: string) => {
    set({ loading: true })
    try {
      const res = await fetch(`/api/expenses?tripId=${tripId}`)
      const data = await res.json()
      set({ expenses: Array.isArray(data) ? data : [], loading: false })
    } catch {
      set({ loading: false })
    }
  },

  createExpense: async (data: ExpensePayload) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const expense = await res.json()
    if (res.ok) set((state) => ({ expenses: [expense, ...state.expenses] }))
    return expense
  },

  updateExpense: async (id: string, data: ExpensePayload) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({ expenses: state.expenses.map((expense) => (expense._id === id ? updated : expense)) }))
    }
  },

  deleteExpense: async (id: string) => {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
    if (res.ok) set((state) => ({ expenses: state.expenses.filter((expense) => expense._id !== id) }))
  },
}))
