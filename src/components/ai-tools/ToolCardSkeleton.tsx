
import { Skeleton } from "@/components/ui/skeleton";

const ToolCardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border shadow px-6 py-5 flex flex-col animate-pulse">
    <div className="flex items-center mb-2 gap-2">
      <Skeleton className="h-5 w-1/2 rounded-md" />
      <Skeleton className="h-4 w-16 rounded" />
    </div>
    <Skeleton className="h-4 w-full rounded mb-2" />
    <Skeleton className="h-4 w-2/3 rounded" />
    <div className="flex gap-2 items-center mt-auto pt-4">
      <Skeleton className="h-4 w-16 rounded" />
    </div>
  </div>
);

export default ToolCardSkeleton;
