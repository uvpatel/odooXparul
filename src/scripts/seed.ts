import { connectDB } from "../lib/mongodb"
import { Activity } from "../models/activities.model"
import { Expense } from "../models/expenses.model"
import { Note } from "../models/notes.model"
import { PackingItem } from "../models/packingItems.model"
import { Trip } from "../models/trips.model"

const userId = process.env.SEED_USER_ID || "seed-user"

const destinations = [
  "Goa",
  "Manali",
  "Jaipur",
  "Kerala",
  "Dubai",
  "Singapore",
  "Tokyo",
  "Paris",
  "Bali",
  "New York",
]

async function seed() {
  await connectDB()

  await Promise.all([
    Trip.deleteMany({ userId }),
    Activity.deleteMany({ userId }),
    Expense.deleteMany({ userId }),
    PackingItem.deleteMany({ userId }),
    Note.deleteMany({ userId }),
  ])

  for (const [index, destination] of destinations.entries()) {
    const trip = await Trip.create({
      userId,
      title: `${destination} TravelLoop Plan`,
      description: `Dynamic seed trip for ${destination}`,
      destination,
      budget: 18000 + index * 4500,
      travelers: (index % 4) + 1,
      startDate: `2026-0${(index % 8) + 1}-10`,
      endDate: `2026-0${(index % 8) + 1}-14`,
      status: "planning",
    })

    for (let day = 1; day <= 3; day += 1) {
      await Activity.create({
        userId,
        tripId: String(trip._id),
        title: `${destination} experience day ${day}`,
        type: day === 1 ? "Sightseeing" : day === 2 ? "Food" : "Activity",
        location: `${destination} center`,
        time: `${8 + day}:00 AM`,
        duration: "2h",
        cost: 1200 + day * 600,
        day,
      })
    }

    for (const category of ["Food", "Transport", "Stay", "Activities"]) {
      await Expense.create({
        userId,
        tripId: String(trip._id),
        category,
        amount: 1500 + index * 300,
        description: `${category} seed expense`,
      })
    }

    for (const item of ["Passport", "Power bank", "Sunscreen", "Comfort shoes"]) {
      await PackingItem.create({
        userId,
        tripId: String(trip._id),
        item_name: item,
        category: item === "Passport" ? "Documents" : "Essentials",
        checked: item === "Passport",
      })
    }

    await Note.create({
      userId,
      tripId: String(trip._id),
      title: `${destination} reminder`,
      content: `Confirm bookings and local transport before leaving for ${destination}.`,
      tags: ["seed", "travel"],
    })
  }

  console.log(`Seeded ${destinations.length} trips for userId=${userId}`)
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
