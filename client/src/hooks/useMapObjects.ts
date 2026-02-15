import { mapObjectService } from "../services/mapObjectService";
import { useMapObjectStore } from "../stores";
import type { MapObject, CreateMapObjectDto } from "../types";

export const useMapObjects = () => {
  const {
    objects,
    selectedId,
    loading,
    error,
    setObjects,
    setSelectedId,
    addObject,
    removeObject,
    setLoading,
    setError,
  } = useMapObjectStore();

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mapObjectService.getAll();
      setObjects(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch map objects";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setSelected = (id: string | null) => {
    setSelectedId(id);
  };

  const selected = selectedId
    ? objects.find((o) => o.id === selectedId) || null
    : null;

  const createObject = async (object: CreateMapObjectDto) => {
    setLoading(true);
    setError(null);
    try {
      const created = await mapObjectService.create(object);
      addObject(created);
      return created;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create map object";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateObject = async (object: MapObject) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await mapObjectService.update(object);
      const newObjects = objects.map((o) =>
        o.id === updated.id ? updated : o,
      );
      setObjects(newObjects);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update map object";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteObject = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await mapObjectService.delete(id);
      removeObject(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete map object";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    objects,
    selected,
    loading,
    error,

    fetchAll,
    setSelected: setSelected,
    createObject,
    updateObject,
    deleteObject,
  };
};
