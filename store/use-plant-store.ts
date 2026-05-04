import { create } from "zustand";

interface PlantFilters {
  search: string;
  location: string;
  species: string;
}

interface PlantStore {
  filters: PlantFilters;
  setSearch: (search: string) => void;
  setLocation: (location: string) => void;
  setSpecies: (species: string) => void;
  clearFilters: () => void;
}

export const usePlantStore = create<PlantStore>((set) => ({
  filters: {
    search: "",
    location: "",
    species: "",
  },
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),
  setLocation: (location) =>
    set((state) => ({ filters: { ...state.filters, location } })),
  setSpecies: (species) =>
    set((state) => ({ filters: { ...state.filters, species } })),
  clearFilters: () =>
    set({ filters: { search: "", location: "", species: "" } }),
}));
