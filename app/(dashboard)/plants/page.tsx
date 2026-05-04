"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlants } from "@/hooks/use-plants";
import { usePlantStore } from "@/store/use-plant-store";
import { PlantList } from "@/components/plants/plant-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function PlantsPage() {
  const [page, setPage] = useState(1);
  const { filters, setSearch, setLocation, setSpecies, clearFilters } = usePlantStore();
  const { data, isLoading, isFetching, refetch } = usePlants({ ...filters, page, limit: 9 });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">My Plants</h1>
          {isFetching && (
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <Link href="/plants/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Plant
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          placeholder="Filter by location..."
          value={filters.location}
          onChange={(e) => setLocation(e.target.value)}
          className="md:w-48"
        />
        <Input
          placeholder="Filter by species..."
          value={filters.species}
          onChange={(e) => setSpecies(e.target.value)}
          className="md:w-48"
        />
        {(filters.search || filters.location || filters.species) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading plants...</p>
        </div>
      ) : data ? (
        <PlantList
          plants={data.plants}
          pagination={data.pagination}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}
