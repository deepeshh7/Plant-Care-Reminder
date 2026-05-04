import { z } from "zod";

export const createScheduleSchema = z.object({
  plantId: z.string().min(1, "Plant is required"),
  taskType: z.enum(["WATERING", "FERTILIZING"]),
  frequencyDays: z.number().min(1, "Frequency must be at least 1 day"),
  timeOfDay: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  startDate: z.string().min(1, "Start date is required"),
  notes: z.string().optional(),
  allowPastDates: z.boolean().optional(), // For testing: allow creating overdue schedules
});

export const updateScheduleSchema = createScheduleSchema.omit({ plantId: true });

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
