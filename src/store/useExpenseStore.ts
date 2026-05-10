import { create } from "zustand"

interface ExpenseStore {
  expenses: any[]
  loading: boolean
  fetchExpenses: (tripId: string) => Promise<void>
  createExpense: (data: any) => Promise<any>
  updateExpense: (id: string, data: any) => Promise<void>
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

  createExpense: async (data: any) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const expense = await res.json()
    if (res.ok) set((s) => ({ expenses: [expense, ...s.expenses] }))
    return expense
  },

  updateExpense: async (id: string, data: any) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      set((s) => ({ expenses: s.expenses.map((e) => (e._id === id ? updated : e)) }))
    }
  },

  deleteExpense: async (id: string) => {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
    if (res.ok) set((s) => ({ expenses: s.expenses.filter((e) => e._id !== id) }))
  },
}))
