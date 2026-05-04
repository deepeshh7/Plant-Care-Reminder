import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface PlantCardProps {
  plant: {
    id: string;
    name: string;
    species?: string | null;
    imageUrl?: string | null;
    location?: string | null;
    acquisitionDate?: Date | null;
  };
}

export function PlantCard({ plant }: PlantCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-muted">
        {plant.imageUrl ? (
          <Image
            src={plant.imageUrl}
            alt={plant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-1">{plant.name}</h3>
        {plant.species && (
          <p className="text-sm text-muted-foreground mb-2">{plant.species}</p>
        )}
        <div className="space-y-1">
          {plant.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {plant.location}
            </div>
          )}
          {plant.acquisitionDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(plant.acquisitionDate), "MMM d, yyyy")}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/plants/${plant.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
