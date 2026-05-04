"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { usePlant, useUpdatePlant } from "@/hooks/use-plants";
import { PlantForm } from "@/components/plants/plant-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CreatePlantInput } from "@/lib/validations/plant";
import { format } from "date-fns";

export default function EditPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: plant, isLoading } = usePlant(id);
  const updatePlant = useUpdatePlant(id);

  const handleSubmit = async (data: CreatePlantInput) => {
    try {
      await updatePlant.mutateAsync(data);
      toast.success("Plant updated successfully!");
      router.push(`/plants/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update plant");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Plant not found</p>
      </div>
    );
  }

  const defaultValues = {
    name: plant.name,
    species: plant.species || "",
    imageUrl: plant.imageUrl || "",
    location: plant.location || "",
    acquisitionDate: plant.acquisitionDate
      ? format(new Date(plant.acquisitionDate), "yyyy-MM-dd")
      : "",
    notes: plant.notes || "",
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Plant</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={updatePlant.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
