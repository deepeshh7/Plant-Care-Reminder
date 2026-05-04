"use client";

import { ScheduleCard } from "./schedule-card";
import { ScheduleCardSkeletonList } from "@/components/shared/schedule-card-skeleton";

interface Schedule {
  id: string;
  taskType: string;
  frequencyDays: number;
  timeOfDay: string;
  nextDueDate: Date;
  isActive: boolean;
  notes?: string | null;
  plant: {
    id: string;
    name: string;
  };
}

interface ScheduleListProps {
  schedules: Schedule[];
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ScheduleList({ 
  schedules, 
  onToggle, 
  onDelete, 
  isLoading, 
  emptyMessage = "No schedules found" 
}: ScheduleListProps) {
  if (isLoading) {
    return <ScheduleCardSkeletonList count={3} />;
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.id}
          schedule={schedule}
          onToggle={onToggle}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
