import { z } from "zod";

export const createPlantSchema = z.object({
  name: z.string().min(1, "Plant name is required"),
  species: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  acquisitionDate: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePlantSchema = createPlantSchema;

export type CreatePlantInput = z.infer<typeof createPlantSchema>;
export type UpdatePlantInput = z.infer<typeof updatePlantSchema>;
