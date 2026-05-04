import { z } from "zod";

export const completeTaskSchema = z.object({
  scheduleId: z.string().min(1, "Schedule ID is required"),
  notes: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;
