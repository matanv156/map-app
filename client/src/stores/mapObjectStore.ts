import { create } from "zustand";
import type { MapObject } from "../types";

interface MapObjectStore {
  objects: MapObject[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;

  setObjects: (objects: MapObject[]) => void;
  setSelectedId: (id: string | null) => void;
  addObject: (object: MapObject) => void;
  removeObject: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMapObjectStore = create<MapObjectStore>((set) => ({
  objects: [],
  selectedId: null,
  loading: false,
  error: null,

  setObjects: (objects) => set({ objects }),
  setSelectedId: (id) => set({ selectedId: id }),
  addObject: (object) =>
    set((state) => ({ objects: [...state.objects, object] })),
  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((o) => o.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
