export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center gap-6 animate-pulse">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex gap-3 flex-wrap">
          <div className="h-9 w-24 bg-gray-200 rounded-md" />
          <div className="h-9 w-28 bg-gray-200 rounded-md" />
          <div className="h-9 w-32 bg-gray-200 rounded-md" />
          <div className="h-9 w-20 bg-gray-200 rounded-md" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 px-6 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-20 bg-gray-200 rounded"
              />
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <div className="h-10 w-28 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        <div className="h-3 w-48 bg-gray-200 rounded mx-auto" />
      </div>
    </div>
  );
}
