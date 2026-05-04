import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompleteTaskInput } from "@/lib/validations/task";

interface Task {
  id: string;
  plantId: string;
  taskType: "WATERING" | "FERTILIZING";
  nextDueDate: Date;
  timeOfDay: string;
  frequencyDays: number;
  plant?: {
    id: string;
    name: string;
    species?: string | null;
    imageUrl?: string | null;
    location?: string | null;
  };
}

interface CareTask {
  id: string;
  scheduleId: string;
  plantId: string;
  completedAt: Date;
  notes?: string | null;
  photoUrl?: string | null;
  plant?: {
    id: string;
    name: string;
    species?: string | null;
    imageUrl?: string | null;
  };
  schedule?: {
    taskType: "WATERING" | "FERTILIZING";
  };
}

interface TaskHistoryResponse {
  tasks: CareTask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TasksFilters {
  startDate?: string;
  endDate?: string;
}

export function useTasks(filters: TasksFilters = {}) {
  return useQuery<Task[]>({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await fetch(`/api/tasks?${params}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });
}

export function useTaskHistory(page: number = 1, limit: number = 20) {
  return useQuery<TaskHistoryResponse>({
    queryKey: ["tasks", "history", page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await fetch(`/api/tasks/history?${params}`);
      if (!response.ok) throw new Error("Failed to fetch task history");
      return response.json();
    },
  });
}

export function usePlantHistory(plantId: string) {
  return useQuery<CareTask[]>({
    queryKey: ["tasks", "plant", plantId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/plant/${plantId}/history`);
      if (!response.ok) throw new Error("Failed to fetch plant history");
      return response.json();
    },
    enabled: !!plantId,
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CompleteTaskInput) => {
      const response = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}
