export default function ResultsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="skeleton h-8 w-64 rounded-xl" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
      </div>
      <div className="skeleton h-8 w-48 rounded-xl" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="skeleton h-60 rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      </div>
    </div>
  )
}
