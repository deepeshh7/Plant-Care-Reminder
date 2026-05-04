"use client";

import { useRouter } from "next/navigation";
import { useCreatePlant } from "@/hooks/use-plants";
import { PlantForm } from "@/components/plants/plant-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CreatePlantInput } from "@/lib/validations/plant";

export default function NewPlantPage() {
  const router = useRouter();
  const createPlant = useCreatePlant();

  const handleSubmit = async (data: CreatePlantInput) => {
    try {
      await createPlant.mutateAsync(data);
      toast.success("Plant added successfully!");
      // Use replace to prevent back button issues
      router.replace("/plants");
      // Force a hard refresh to ensure data is loaded
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add plant");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Plant</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantForm onSubmit={handleSubmit} isLoading={createPlant.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
