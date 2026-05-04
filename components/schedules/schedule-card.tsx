"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Droplet, Leaf, Pause, Play, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface ScheduleCardProps {
  schedule: {
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
  };
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function ScheduleCard({ schedule, onToggle, onDelete, isLoading }: ScheduleCardProps) {
  const taskIcon = schedule.taskType === "WATERING" ? Droplet : Leaf;
  const TaskIcon = taskIcon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              schedule.taskType === "WATERING" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-green-100 text-green-600"
            }`}>
              <TaskIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {schedule.taskType === "WATERING" ? "Watering" : "Fertilizing"}
              </CardTitle>
              <Link 
                href={`/plants/${schedule.plant.id}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {schedule.plant.name}
              </Link>
            </div>
          </div>
          <Badge variant={schedule.isActive ? "default" : "secondary"}>
            {schedule.isActive ? "Active" : "Paused"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Every {schedule.frequencyDays} days</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{schedule.timeOfDay}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Next due:</p>
          <p className="text-sm font-medium">
            {format(new Date(schedule.nextDueDate), "PPP 'at' p")}
          </p>
        </div>

        {schedule.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">{schedule.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggle(schedule.id)}
              disabled={isLoading}
              className="flex-1"
            >
              {schedule.isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <Link href={`/schedules/${schedule.id}/edit`}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(schedule.id)}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
