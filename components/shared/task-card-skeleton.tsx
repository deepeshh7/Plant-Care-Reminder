import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TaskCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}
