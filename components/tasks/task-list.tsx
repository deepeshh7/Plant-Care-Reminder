"use client";

import { TaskCard } from "./task-card";
import { TaskCardSkeletonList } from "@/components/shared/task-card-skeleton";

interface Task {
  id: string;
  taskType: string;
  nextDueDate: Date;
  timeOfDay: string;
  plant: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function TaskList({ 
  tasks, 
  onComplete, 
  isLoading, 
  emptyMessage = "No tasks found" 
}: TaskListProps) {
  if (isLoading) {
    return <TaskCardSkeletonList count={3} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
