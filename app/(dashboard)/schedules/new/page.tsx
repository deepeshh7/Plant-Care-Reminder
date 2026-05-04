"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePlants } from "@/hooks/use-plants";
import { useCreateSchedule } from "@/hooks/use-schedules";
import { ScheduleForm } from "@/components/schedules/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CreateScheduleInput } from "@/lib/validations/schedule";
import { format } from "date-fns";

export default function NewSchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantId = searchParams.get("plantId");
  
  const { data: plantsData } = usePlants({ limit: 100 });
  const createSchedule = useCreateSchedule();

  const handleSubmit = async (data: CreateScheduleInput) => {
    try {
      await createSchedule.mutateAsync(data);
      toast.success("Schedule created successfully!");
      router.push("/schedules");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create schedule");
    }
  };

  const defaultValues = plantId
    ? {
        plantId,
        startDate: format(new Date(), "yyyy-MM-dd"),
      }
    : {
        startDate: format(new Date(), "yyyy-MM-dd"),
      };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Care Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm
            plants={plantsData?.plants || []}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={createSchedule.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
