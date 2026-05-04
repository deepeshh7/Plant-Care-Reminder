"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createScheduleSchema, type CreateScheduleInput } from "@/lib/validations/schedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScheduleFormProps {
  plants?: Array<{ id: string; name: string }>;
  defaultValues?: Partial<CreateScheduleInput>;
  onSubmit: (data: CreateScheduleInput) => void;
  isLoading?: boolean;
  hidePlantSelector?: boolean;
}

export function ScheduleForm({
  plants = [],
  defaultValues,
  onSubmit,
  isLoading,
  hidePlantSelector = false,
}: ScheduleFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateScheduleInput>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      frequencyDays: 7,
      timeOfDay: "09:00",
      ...defaultValues,
    },
  });

  const taskType = watch("taskType");
  const plantId = watch("plantId");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {!hidePlantSelector && (
        <div className="space-y-2">
          <Label htmlFor="plantId">Plant *</Label>
          <Select
            value={plantId}
            onValueChange={(value) => setValue("plantId", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a plant" />
            </SelectTrigger>
            <SelectContent>
              {plants.map((plant) => (
                <SelectItem key={plant.id} value={plant.id}>
                  {plant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.plantId && (
            <p className="text-sm text-red-500">{errors.plantId.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="taskType">Task Type *</Label>
        <Select
          value={taskType}
          onValueChange={(value) => setValue("taskType", value as "WATERING" | "FERTILIZING")}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select task type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WATERING">Watering</SelectItem>
            <SelectItem value="FERTILIZING">Fertilizing</SelectItem>
          </SelectContent>
        </Select>
        {errors.taskType && (
          <p className="text-sm text-red-500">{errors.taskType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequencyDays">Frequency (days) *</Label>
        <Input
          id="frequencyDays"
          type="number"
          min="1"
          {...register("frequencyDays", { valueAsNumber: true })}
          disabled={isLoading}
        />
        {errors.frequencyDays && (
          <p className="text-sm text-red-500">{errors.frequencyDays.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeOfDay">Time of Day *</Label>
        <Input
          id="timeOfDay"
          type="time"
          {...register("timeOfDay")}
          disabled={isLoading}
        />
        {errors.timeOfDay && (
          <p className="text-sm text-red-500">{errors.timeOfDay.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date *</Label>
        <Input
          id="startDate"
          type="date"
          {...register("startDate")}
          disabled={isLoading}
        />
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Any additional notes..."
          rows={3}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Schedule"}
      </Button>
    </form>
  );
}
