import type { PolygonFeature, CreatePolygonDto } from "../types";
import axiosInstance from "../api/client";

export const polygonService = {
  //   GET /polygon/polygons
  getAll: async (): Promise<PolygonFeature[]> => {
    const response = await axiosInstance.get("/polygon/polygons");
    return response.data.items;
  },

  //   GET /polygon/{id}
  getById: async (id: string): Promise<PolygonFeature> => {
    const response = await axiosInstance.get<PolygonFeature>(`/polygon/${id}`);
    return response.data;
  },

  //   POST /polygon/addPolygon
  create: async (polygon: CreatePolygonDto): Promise<PolygonFeature> => {
    const response = await axiosInstance.post<PolygonFeature>(
      "/polygon/addPolygon",
      polygon,
    );
    return response.data;
  },

  //   PUT /polygon/updatePolygon
  update: async (polygon: PolygonFeature): Promise<PolygonFeature> => {
    const response = await axiosInstance.put<PolygonFeature>(
      "/polygon/updatePolygon",
      polygon,
    );
    return response.data;
  },

  //   DELETE /polygon/deletePolygon/{id}
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/polygon/deletePolygon/${id}`);
  },
};
