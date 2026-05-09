export default function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-lg border border-ink/10 bg-white dark:border-white/10 dark:bg-zinc-900">
          <div className="h-72 bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
