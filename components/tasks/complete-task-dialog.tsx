"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeTaskSchema, type CompleteTaskInput } from "@/lib/validations/task";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/shared/image-upload";
import { CheckCircle } from "lucide-react";

interface CompleteTaskDialogProps {
  scheduleId: string;
  plantName: string;
  taskType: string;
  onComplete: (data: CompleteTaskInput) => Promise<void>;
  isLoading?: boolean;
}

export function CompleteTaskDialog({
  scheduleId,
  plantName,
  taskType,
  onComplete,
  isLoading,
}: CompleteTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CompleteTaskInput>({
    resolver: zodResolver(completeTaskSchema),
    defaultValues: {
      scheduleId,
    },
  });

  const photoUrl = watch("photoUrl");

  const onSubmit = async (data: CompleteTaskInput) => {
    await onComplete(data);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark Complete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Task</DialogTitle>
          <DialogDescription>
            Mark {taskType.toLowerCase()} for {plantName} as complete
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Add Photo (optional)</Label>
            <ImageUpload
              currentImageUrl={photoUrl}
              onUploadComplete={(url: string) => setValue("photoUrl", url)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any observations or notes..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Completing..." : "Complete Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
