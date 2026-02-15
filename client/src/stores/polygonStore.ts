import { create } from "zustand";
import type { PolygonFeature } from "../types";

interface PolygonStore {
  polygons: PolygonFeature[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  setPolygons: (polygons: PolygonFeature[]) => void;
  setSelectedId: (id: string | null) => void;
  addPolygon: (polygon: PolygonFeature) => void;
  removePolygon: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePolygonStore = create<PolygonStore>((set) => ({
  polygons: [],
  selectedId: null,
  loading: false,
  error: null,

  setPolygons: (polygons) => set({ polygons }),
  setSelectedId: (id) => set({ selectedId: id }),
  addPolygon: (polygon) =>
    set((state) => ({ polygons: [...state.polygons, polygon] })),
  removePolygon: (id) =>
    set((state) => ({
      polygons: state.polygons.filter((p) => p.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
