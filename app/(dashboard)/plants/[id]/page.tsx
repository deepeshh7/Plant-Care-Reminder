"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePlant, useDeletePlant } from "@/hooks/use-plants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: plant, isLoading } = usePlant(id);
  const deletePlant = useDeletePlant();

  const handleDelete = async () => {
    try {
      await deletePlant.mutateAsync(id);
      toast.success("Plant deleted successfully");
      router.push("/plants");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete plant");
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

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{plant.name}</h1>
        <div className="flex gap-2">
          <Link href={`/plants/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this plant and all associated care schedules and history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            {plant.imageUrl ? (
              <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={plant.imageUrl}
                  alt={plant.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                <p className="text-muted-foreground">No image</p>
              </div>
            )}
            <div className="space-y-3">
              {plant.species && (
                <div>
                  <p className="text-sm font-medium">Species</p>
                  <p className="text-muted-foreground">{plant.species}</p>
                </div>
              )}
              {plant.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{plant.location}</span>
                </div>
              )}
              {plant.acquisitionDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(plant.acquisitionDate), "MMMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {plant.notes && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{plant.notes}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Care Schedules</h3>
              {plant.careSchedules && plant.careSchedules.length > 0 ? (
                <div className="space-y-2">
                  {plant.careSchedules.map((schedule: any) => (
                    <div key={schedule.id} className="p-3 border rounded-lg">
                      <p className="font-medium">{schedule.taskType}</p>
                      <p className="text-sm text-muted-foreground">
                        Every {schedule.frequencyDays} days at {schedule.timeOfDay}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No care schedules yet</p>
              )}
              <Link href={`/schedules/new?plantId=${id}`}>
                <Button variant="outline" className="w-full mt-4">
                  Add Care Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
