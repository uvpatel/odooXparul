"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Wallet,
  Plane,
  Bed,
  Utensils,
  Ticket,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

// Mock Data
const totalBudget = 5000;
const totalSpent = 3850;
const totalDays = 10;
const averageCostPerDay = totalSpent / totalDays;
const budgetPerDay = totalBudget / totalDays;

const expenseCategories = [
  { name: "Flights & Transport", value: 1200, color: "#3b82f6", icon: Plane },
  { name: "Accommodation", value: 1500, color: "#8b5cf6", icon: Bed },
  { name: "Food & Dining", value: 700, color: "#f59e0b", icon: Utensils },
  { name: "Activities & Tours", value: 450, color: "#10b981", icon: Ticket },
];

const dailyExpenses = [
  { day: "Day 1", spent: 300, budget: 500 },
  { day: "Day 2", spent: 450, budget: 500 },
  { day: "Day 3", spent: 600, budget: 500 }, // Over budget
  { day: "Day 4", spent: 250, budget: 500 },
  { day: "Day 5", spent: 400, budget: 500 },
  { day: "Day 6", spent: 750, budget: 500 }, // Over budget
  { day: "Day 7", spent: 300, budget: 500 },
];

export default function TripBudgetPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "daily">("overview");

  const percentageSpent = Math.min((totalSpent / totalBudget) * 100, 100);
  const overBudgetDays = dailyExpenses.filter((d) => d.spent > d.budget).length;

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Trip Budget & Expenses
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Track your spending for "Summer Euro Trip 2026"
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Wallet className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium text-neutral-500">
              Total Budget
            </CardDescription>
            <CardTitle className="text-3xl font-bold">${totalBudget}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-500">
              For {totalDays} days (${budgetPerDay.toFixed(0)}/day)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium text-neutral-500">
              Total Spent
            </CardDescription>
            <CardTitle className="text-3xl font-bold">${totalSpent}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-full bg-neutral-100 rounded-full h-2.5 dark:bg-neutral-800">
                <div
                  className={`h-2.5 rounded-full ${
                    percentageSpent > 90 ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${percentageSpent}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-neutral-600">
                {percentageSpent.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              ${totalBudget - totalSpent} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium text-neutral-500">
              Avg. Daily Cost
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              ${averageCostPerDay.toFixed(0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              {averageCostPerDay > budgetPerDay ? (
                <Badge variant="destructive" className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 border-none">
                  <TrendingUp className="h-3 w-3" />
                  Over by ${(averageCostPerDay - budgetPerDay).toFixed(0)}
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none">
                  On track
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Cost by Category</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [`$${value}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {expenseCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-md" 
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <cat.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">${cat.value}</p>
                    <p className="text-xs text-neutral-500">
                      {((cat.value / totalSpent) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Expenses Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Daily Expenses Breakdown</CardTitle>
              <CardDescription>Actual spending vs. daily budget</CardDescription>
            </div>
            {overBudgetDays > 0 && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 py-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                {overBudgetDays} days over budget
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyExpenses}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value, name) => [
                      `$${value}`, 
                      name === 'spent' ? 'Spent' : 'Budget'
                    ]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                  <Bar 
                    dataKey="spent" 
                    name="Spent" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={40}
                  >
                    {dailyExpenses.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.spent > entry.budget ? '#ef4444' : '#3b82f6'} 
                      />
                    ))}
                  </Bar>
                  <Bar 
                    dataKey="budget" 
                    name="Daily Budget" 
                    fill="#e5e7eb" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
