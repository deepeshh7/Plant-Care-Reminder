"use client";

import { useState } from "react";
import { useTaskHistory } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default function TaskHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTaskHistory(page, 20);

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Care History</h1>
        <Link href="/tasks">
          <Button variant="outline">Back to Tasks</Button>
        </Link>
      </div>

      {!data || data.tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No care history yet</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {data.tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {task.plant?.imageUrl && (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={task.plant.imageUrl}
                          alt={task.plant.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{task.plant?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.schedule?.taskType} - {format(new Date(task.completedAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <Link href={`/plants/${task.plantId}`}>
                          <Button variant="ghost" size="sm">
                            View Plant
                          </Button>
                        </Link>
                      </div>
                      {task.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{task.notes}</p>
                      )}
                      {task.photoUrl && (
                        <div className="relative h-32 w-32 rounded-lg overflow-hidden mt-3">
                          <Image
                            src={task.photoUrl}
                            alt="Task photo"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
