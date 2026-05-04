"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Droplet, Leaf, CheckCircle } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import Link from "next/link";

interface TaskCardProps {
  task: {
    id: string;
    taskType: string;
    nextDueDate: Date;
    timeOfDay: string;
    plant: {
      id: string;
      name: string;
      imageUrl?: string | null;
    };
  };
  onComplete?: (id: string) => void;
  isLoading?: boolean;
}

export function TaskCard({ task, onComplete, isLoading }: TaskCardProps) {
  const taskIcon = task.taskType === "WATERING" ? Droplet : Leaf;
  const TaskIcon = taskIcon;
  const dueDate = new Date(task.nextDueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate);
  const isDueToday = isToday(dueDate);

  return (
    <Card className={`hover:shadow-md transition-shadow ${
      isOverdue ? "border-red-300" : isDueToday ? "border-yellow-300" : ""
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-full flex-shrink-0 ${
              task.taskType === "WATERING" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-green-100 text-green-600"
            }`}>
              <TaskIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate">
                {task.taskType === "WATERING" ? "Water" : "Fertilize"} {task.plant.name}
              </h3>
              <Link 
                href={`/plants/${task.plant.id}`}
                className="text-sm text-muted-foreground hover:text-primary truncate block"
              >
                View plant details
              </Link>
            </div>
          </div>
          {isOverdue && (
            <Badge variant="destructive" className="flex-shrink-0">Overdue</Badge>
          )}
          {isDueToday && !isOverdue && (
            <Badge variant="default" className="flex-shrink-0">Due Today</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{format(dueDate, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{task.timeOfDay}</span>
          </div>
        </div>

        {onComplete && (
          <Button
            onClick={() => onComplete(task.id)}
            disabled={isLoading}
            className="w-full"
            variant={isOverdue ? "destructive" : "default"}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
