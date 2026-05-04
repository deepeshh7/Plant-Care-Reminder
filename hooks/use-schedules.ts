import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateScheduleInput, UpdateScheduleInput } from "@/lib/validations/schedule";

interface Schedule {
  id: string;
  plantId: string;
  taskType: "WATERING" | "FERTILIZING";
  frequencyDays: number;
  timeOfDay: string;
  startDate: Date;
  nextDueDate: Date;
  notes?: string | null;
  isActive: boolean;
  plant?: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

export function useSchedules() {
  return useQuery<Schedule[]>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const response = await fetch("/api/schedules");
      if (!response.ok) throw new Error("Failed to fetch schedules");
      return response.json();
    },
  });
}

export function useSchedulesByPlant(plantId: string) {
  return useQuery<Schedule[]>({
    queryKey: ["schedules", "plant", plantId],
    queryFn: async () => {
      const response = await fetch(`/api/schedules/plant/${plantId}`);
      if (!response.ok) throw new Error("Failed to fetch schedules");
      return response.json();
    },
    enabled: !!plantId,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateScheduleInput) => {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create schedule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["plants"] });
    },
  });
}

export function useUpdateSchedule(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateScheduleInput) => {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update schedule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useToggleSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/schedules/${id}/toggle`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to toggle schedule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete schedule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}
