import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Skeleton className="h-10 w-72" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}
      </div>
      <Skeleton className="h-[360px]" />
    </div>
  )
}
