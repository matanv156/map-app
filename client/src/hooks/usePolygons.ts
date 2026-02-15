import { usePolygonStore } from "../stores";
import { polygonService } from "../services/polygonService";
import type { PolygonFeature, CreatePolygonDto } from "../types";

export const usePolygons = () => {
  const {
    polygons,
    selectedId,
    loading,
    error,
    setPolygons,
    setSelectedId,
    addPolygon,
    removePolygon,
    setLoading,
    setError,
  } = usePolygonStore();

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await polygonService.getAll();
      setPolygons(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch polygons";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectPolygon = (id: string | null) => {
    setSelectedId(id);
  };

  const selected = selectedId
    ? polygons.find((p) => p.id === selectedId) || null
    : null;

  const createPolygon = async (polygon: CreatePolygonDto) => {
    setLoading(true);
    setError(null);
    try {
      const created = await polygonService.create(polygon);
      addPolygon(created);
      return created;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create polygon";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePolygon = async (polygon: PolygonFeature) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await polygonService.update(polygon);
      const newPolygons = polygons.map((p) =>
        p.id === updated.id ? updated : p,
      );
      setPolygons(newPolygons);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update polygon";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePolygon = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await polygonService.delete(id);
      removePolygon(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete polygon";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    polygons,
    selectedId,
    selected,
    loading,
    error,

    fetchAll,
    selectPolygon,
    createPolygon,
    updatePolygon,
    deletePolygon,
  };
};
