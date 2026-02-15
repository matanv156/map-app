import axiosInstance from "../api/client";
import type { MapObject, CreateMapObjectDto } from "../types";

export const mapObjectService = {
  //   GET /mapobject/mapObjects
  getAll: async (): Promise<MapObject[]> => {
    const response = await axiosInstance.get("/mapobject/mapObjects");
    return response.data.items;
  },
  //   GET /mapobject/{id}
  getById: async (id: string): Promise<MapObject> => {
    const response = await axiosInstance.get<MapObject>(`/mapobject/${id}`);
    return response.data;
  },
  //   POST /mapobject/addMapObject
  create: async (mapObject: CreateMapObjectDto): Promise<MapObject> => {
    const response = await axiosInstance.post<MapObject>(
      "/mapobject/addMapObject",
      mapObject,
    );
    return response.data;
  },
  //   PUT /mapobject/updateMapObject?id={id}
  update: async (mapObject: MapObject): Promise<MapObject> => {
    const response = await axiosInstance.put<MapObject>(
      `/mapobject/updateMapObject?id=${mapObject.id}`,
      mapObject,
    );
    return response.data;
  },
  //   DELETE /mapobject/deleteMapObject/{id}
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/mapobject/deleteMapObject/${id}`);
  },
};
