export function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 h-12 rounded-xl shimmer flex-shrink-0" />
      <div className="flex-1">
        <div className="h-3 rounded shimmer mb-2" />
        <div className="h-2.5 w-1/2 rounded shimmer" />
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <div className="aspect-video shimmer" />
      <div className="p-3">
        <div className="h-3 rounded shimmer mb-2" />
        <div className="h-1.5 rounded shimmer mb-2" />
        <div className="h-2 w-2/3 rounded shimmer" />
      </div>
    </div>
  )
}
