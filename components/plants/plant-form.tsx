"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlantSchema, type CreatePlantInput } from "@/lib/validations/plant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/image-upload";

interface PlantFormProps {
  defaultValues?: Partial<CreatePlantInput>;
  onSubmit: (data: CreatePlantInput) => void;
  isLoading?: boolean;
}

export function PlantForm({ defaultValues, onSubmit, isLoading }: PlantFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePlantInput>({
    resolver: zodResolver(createPlantSchema),
    defaultValues,
  });

  const imageUrl = watch("imageUrl");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <Label>Plant Photo</Label>
        <ImageUpload
          currentImageUrl={imageUrl}
          onUploadComplete={(url: string) => setValue("imageUrl", url)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Plant Name <span className="text-red-500" aria-label="required">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., Monstera Deliciosa"
            disabled={isLoading}
            className="text-base md:text-sm"
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="species">Species</Label>
          <Input
            id="species"
            {...register("species")}
            placeholder="e.g., Monstera deliciosa"
            disabled={isLoading}
            className="text-base md:text-sm"
            aria-describedby="species-hint"
          />
          <p id="species-hint" className="sr-only">Optional field for plant species</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="e.g., Living room, Bedroom"
            disabled={isLoading}
            className="text-base md:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="acquisitionDate">Acquisition Date</Label>
          <Input
            id="acquisitionDate"
            type="date"
            {...register("acquisitionDate")}
            disabled={isLoading}
            className="text-base md:text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Any additional information about your plant..."
          rows={4}
          disabled={isLoading}
          className="text-base md:text-sm resize-none"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full md:w-auto md:min-w-[200px] h-11 md:h-10 text-base md:text-sm" 
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Plant"}
      </Button>
    </form>
  );
}
