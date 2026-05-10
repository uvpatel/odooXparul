"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

export default function PackingChecklistPage() {
  const [categories, setCategories] = useState([
    {
      name: "Clothing",
      items: [
        { id: 1, name: "T-Shirts (x5)", checked: true },
        { id: 2, name: "Jeans (x2)", checked: false },
        { id: 3, name: "Jacket", checked: false },
        { id: 4, name: "Socks (x7)", checked: true },
      ]
    },
    {
      name: "Electronics",
      items: [
        { id: 5, name: "Laptop & Charger", checked: true },
        { id: 6, name: "Power Bank", checked: false },
        { id: 7, name: "Universal Adapter", checked: false },
      ]
    },
    {
      name: "Documents",
      items: [
        { id: 8, name: "Passport", checked: true },
        { id: 9, name: "Travel Insurance", checked: true },
        { id: 10, name: "Flight Tickets (Printed)", checked: false },
      ]
    }
  ]);

  const [newItem, setNewItem] = useState("");

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const packedItems = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.checked).length, 0);
  const progress = Math.round((packedItems / totalItems) * 100) || 0;

  const toggleItem = (categoryId: number, itemId: number) => {
    const newCategories = [...categories];
    const item = newCategories[categoryId].items.find(i => i.id === itemId);
    if (item) {
      item.checked = !item.checked;
      setCategories(newCategories);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none mb-2">Summer Euro Trip 2026</Badge>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Packing Checklist <Briefcase className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-neutral-500 mt-1">Don't forget the essentials. AI suggested 15 items for this trip.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card className="bg-indigo-50 dark:bg-indigo-950/20 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">Packing Progress</p>
              <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{packedItems} of {totalItems} items</h3>
            </div>
            <span className="text-indigo-700 dark:text-indigo-400 font-bold">{progress}%</span>
          </div>
          <div className="h-3 w-full bg-indigo-200/50 dark:bg-indigo-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, catIndex) => (
          <Card key={catIndex} className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge variant="secondary" className="font-normal">
                  {category.items.filter(i => i.checked).length}/{category.items.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {category.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-2 rounded-md transition-colors ${item.checked ? 'bg-neutral-50 dark:bg-neutral-900/50' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50'}`}
                >
                  <div className="flex items-center space-x-3">
                    <button onClick={() => toggleItem(catIndex, item.id)} className="focus:outline-none">
                      {item.checked ? 
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : 
                        <Circle className="h-5 w-5 text-neutral-300" />
                      }
                    </button>
                    <label 
                      className={`text-sm font-medium leading-none cursor-pointer ${item.checked ? 'text-neutral-400 line-through' : 'text-neutral-700 dark:text-neutral-200'}`}
                      onClick={() => toggleItem(catIndex, item.id)}
                    >
                      {item.name}
                    </label>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-400 hover:text-red-500 opacity-0 hover:opacity-100 transition-opacity focus:opacity-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              
              <div className="pt-2 mt-2 border-t flex gap-2">
                <Input placeholder="Add new item..." className="h-8 text-sm" />
                <Button size="sm" className="h-8 px-3">Add</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
