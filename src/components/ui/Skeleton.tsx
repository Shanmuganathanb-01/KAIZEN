export function MissionCardSkeleton() {
  return (
    <div className="cyber-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
        <div className="skeleton h-8 w-24 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16 rounded" />
        <div className="skeleton h-5 w-20 rounded" />
      </div>
    </div>
  );
}

export function CharacterSheetSkeleton() {
  return (
    <div className="space-y-4">
      <div className="cyber-card p-6 space-y-4">
        <div className="skeleton h-8 w-32 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="flex gap-4">
          <div className="skeleton h-12 w-24 rounded" />
          <div className="skeleton h-12 w-24 rounded" />
        </div>
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="cyber-card p-4 space-y-2">
          <div className="skeleton h-3 w-28 rounded" />
          <div className="skeleton h-3 w-full rounded" />
        </div>
      ))}
    </div>
  );
}

export function ShopItemSkeleton() {
  return (
    <div className="cyber-card p-4 space-y-3">
      <div className="skeleton h-6 w-1/2 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="flex items-center justify-between mt-4">
        <div className="skeleton h-5 w-16 rounded" />
        <div className="skeleton h-8 w-20 rounded" />
      </div>
    </div>
  );
}
