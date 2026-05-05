export function SkeletonCard() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl bg-white p-6 shadow-card overflow-hidden"
          aria-hidden="true"
        >
          <div className="shimmer h-5 w-3/4 rounded-full" />
          <div className="mt-4 space-y-3">
            <div className="shimmer h-4 w-full rounded-full" />
            <div className="shimmer h-4 w-5/6 rounded-full" />
            <div className="shimmer h-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
