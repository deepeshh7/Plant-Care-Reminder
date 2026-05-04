import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePlantInput, UpdatePlantInput } from "@/lib/validations/plant";

interface Plant {
  id: string;
  name: string;
  species?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  acquisitionDate?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  careSchedules?: Array<{
    id: string;
    taskType: string;
    frequencyDays: number;
    timeOfDay: string;
  }>;
}

interface PlantsResponse {
  plants: Plant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PlantsFilters {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  species?: string;
}

export function usePlants(filters: PlantsFilters = {}) {
  return useQuery<PlantsResponse>({
    queryKey: ["plants", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.location) params.append("location", filters.location);
      if (filters.species) params.append("species", filters.species);

      const response = await fetch(`/api/plants?${params}`, {
        cache: 'no-store', // Disable caching
      });
      if (!response.ok) throw new Error("Failed to fetch plants");
      return response.json();
    },
    staleTime: 0, // Data is immediately stale
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
}

export function usePlant(id: string) {
  return useQuery<Plant>({
    queryKey: ["plants", id],
    queryFn: async () => {
      const response = await fetch(`/api/plants/${id}`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error("Failed to fetch plant");
      return response.json();
    },
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePlantInput) => {
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create plant");
      }
      return response.json();
    },
    onSuccess: async () => {
      // Invalidate and immediately refetch all plant queries
      await queryClient.invalidateQueries({ queryKey: ["plants"] });
      await queryClient.refetchQueries({ queryKey: ["plants"], type: 'active' });
    },
  });
}

export function useUpdatePlant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePlantInput) => {
      const response = await fetch(`/api/plants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update plant");
      }
      return response.json();
    },
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["plants", id] });

      // Snapshot previous value
      const previousPlant = queryClient.getQueryData<Plant>(["plants", id]);

      // Optimistically update
      if (previousPlant) {
        queryClient.setQueryData<Plant>(["plants", id], {
          ...previousPlant,
          ...newData,
          acquisitionDate: newData.acquisitionDate ? new Date(newData.acquisitionDate) : previousPlant.acquisitionDate,
          updatedAt: new Date(),
        });
      }

      return { previousPlant };
    },
    onError: (_err, _newData, context) => {
      // Rollback on error
      if (context?.previousPlant) {
        queryClient.setQueryData(["plants", id], context.previousPlant);
      }
    },
    onSettled: async () => {
      // Always refetch to ensure consistency
      await queryClient.invalidateQueries({ queryKey: ["plants"] });
      await queryClient.invalidateQueries({ queryKey: ["plants", id] });
      await queryClient.refetchQueries({ queryKey: ["plants"], type: 'active' });
    },
  });
}

export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/plants/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete plant");
      }
      return response.json();
    },
    onSuccess: async () => {
      // Invalidate and immediately refetch all plant queries
      await queryClient.invalidateQueries({ queryKey: ["plants"] });
      await queryClient.refetchQueries({ queryKey: ["plants"], type: 'active' });
    },
    onError: (err) => {
      console.error('Delete error:', err);
    },
  });
}
