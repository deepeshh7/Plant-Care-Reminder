"use client";

import { useState } from "react";
import { useTasks, useCompleteTask } from "@/hooks/use-tasks";
import { CompleteTaskDialog } from "@/components/tasks/complete-task-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfDay, addDays } from "date-fns";
import { toast } from "sonner";
import { CompleteTaskInput } from "@/lib/validations/task";
import Image from "next/image";
import Link from "next/link";

export default function TasksPage() {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));

  const { data: tasks, isLoading } = useTasks({ startDate, endDate });
  const completeTask = useCompleteTask();

  const handleComplete = async (data: CompleteTaskInput) => {
    try {
      await completeTask.mutateAsync(data);
      toast.success("Task completed successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete task");
    }
  };

  const tasksToday = tasks?.filter((task) => {
    const taskDate = new Date(task.nextDueDate);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  const tasksUpcoming = tasks?.filter((task) => {
    const taskDate = new Date(task.nextDueDate);
    const today = new Date();
    return taskDate > today;
  });

  const tasksOverdue = tasks?.filter((task) => {
    const taskDate = new Date(task.nextDueDate);
    const today = new Date();
    return taskDate < startOfDay(today);
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link href="/tasks/history">
          <Button variant="outline">View History</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today ({tasksToday?.length || 0})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({tasksUpcoming?.length || 0})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({tasksOverdue?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {!tasksToday || tasksToday.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No tasks due today</p>
              </CardContent>
            </Card>
          ) : (
            tasksToday.map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {task.plant?.imageUrl && (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                        <Image src={task.plant.imageUrl} alt={task.plant.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{task.plant?.name}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><span className="font-medium">{task.taskType}</span> - {task.timeOfDay}</p>
                        {task.plant?.location && <p>Location: {task.plant.location}</p>}
                      </div>
                    </div>
                    <CompleteTaskDialog
                      scheduleId={task.id}
                      plantName={task.plant?.name || "Plant"}
                      taskType={task.taskType}
                      onComplete={handleComplete}
                      isLoading={completeTask.isPending}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {!tasksUpcoming || tasksUpcoming.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No upcoming tasks</p>
              </CardContent>
            </Card>
          ) : (
            tasksUpcoming.map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {task.plant?.imageUrl && (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                        <Image src={task.plant.imageUrl} alt={task.plant.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{task.plant?.name}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><span className="font-medium">{task.taskType}</span> - {format(new Date(task.nextDueDate), "MMM d 'at' h:mm a")}</p>
                      </div>
                    </div>
                    <CompleteTaskDialog
                      scheduleId={task.id}
                      plantName={task.plant?.name || "Plant"}
                      taskType={task.taskType}
                      onComplete={handleComplete}
                      isLoading={completeTask.isPending}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {!tasksOverdue || tasksOverdue.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No overdue tasks</p>
              </CardContent>
            </Card>
          ) : (
            tasksOverdue.map((task) => (
              <Card key={task.id} className="border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {task.plant?.imageUrl && (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                        <Image src={task.plant.imageUrl} alt={task.plant.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{task.plant?.name}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="text-red-600">
                          <span className="font-medium">{task.taskType}</span> - Overdue since {format(new Date(task.nextDueDate), "MMM d")}
                        </p>
                      </div>
                    </div>
                    <CompleteTaskDialog
                      scheduleId={task.id}
                      plantName={task.plant?.name || "Plant"}
                      taskType={task.taskType}
                      onComplete={handleComplete}
                      isLoading={completeTask.isPending}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
