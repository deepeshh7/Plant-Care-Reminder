"use client";

import Link from "next/link";
import { useSchedules, useToggleSchedule, useDeleteSchedule } from "@/hooks/use-schedules";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function SchedulesPage() {
  const { data: schedules, isLoading } = useSchedules();
  const toggleSchedule = useToggleSchedule();
  const deleteSchedule = useDeleteSchedule();

  const handleToggle = async (id: string) => {
    try {
      await toggleSchedule.mutateAsync(id);
      toast.success("Schedule updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update schedule");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule.mutateAsync(id);
      toast.success("Schedule deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete schedule");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Care Schedules</h1>
        <Link href="/schedules/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </Link>
      </div>

      {!schedules || schedules.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No schedules yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{schedule.plant?.name}</h3>
                      <span className="text-sm px-2 py-1 bg-primary/10 rounded">
                        {schedule.taskType}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Every {schedule.frequencyDays} days at {schedule.timeOfDay}</p>
                      <p>Next due: {format(new Date(schedule.nextDueDate), "MMM d, yyyy 'at' h:mm a")}</p>
                      {schedule.notes && <p className="mt-2">{schedule.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {schedule.isActive ? "Active" : "Paused"}
                      </span>
                      <Switch
                        checked={schedule.isActive}
                        onCheckedChange={() => handleToggle(schedule.id)}
                      />
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Schedule?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this care schedule.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(schedule.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
