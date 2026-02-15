// GeoJSON types
export interface Point {
  type: "Point";
  coordinates: [number, number];
}

export interface Polygon {
  type: "Polygon";
  coordinates: number[][][];
}

// Main Models
export interface MapObject {
  id: string;
  name: string;
  description?: string;
  geometry: Point;
  symbolType?: string;
}

export interface PolygonFeature {
  id: string;
  name: string;
  description?: string;
  geometry: Polygon;
}

// DTOs for creating/updating
export interface CreateMapObjectDto {
  name: string;
  description?: string;
  geometry: Point;
  symbolType?: string;
}

export interface CreatePolygonDto {
  name: string;
  description?: string;
  geometry: Polygon;
}
