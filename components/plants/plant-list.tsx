"use client";

import { PlantCard } from "./plant-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Plant {
  id: string;
  name: string;
  species?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  acquisitionDate?: Date | null;
}

interface PlantListProps {
  plants: Plant[];
  pagination: {
    page: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export function PlantList({ plants, pagination, onPageChange }: PlantListProps) {
  if (plants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No plants found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
