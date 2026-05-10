"use client"

import { Button } from "@/components/ui/button"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-xl font-semibold">Dashboard failed to load</h2>
      <p className="text-sm text-muted-foreground">Refresh the dashboard data and try again.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
