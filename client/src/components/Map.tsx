import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  FeatureGroup,
  useMapEvent,
  Polygon,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./Map.css";
import { usePolygons, useMapObjects } from "../hooks";
import { useExpanded } from "../contexts/ExpandedContext";
import { useRef, useEffect, useState } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const getSymbolIcon = (symbolType: string) => {
  const iconConfig: Record<string, { color: string; emoji: string }> = {
    Landmark: { color: "#ef4444", emoji: "🏢" },
    Beach: { color: "#06b6d4", emoji: "🏖" },
    Historical: { color: "#f59e0b", emoji: "🏯" },
    Monument: { color: "#8b5cf6", emoji: "🗼" },
    Garden: { color: "#10b981", emoji: "🌳" },
    Museum: { color: "#3b82f6", emoji: "🏛" },
    Nature: { color: "#84cc16", emoji: "🌲" },
    Marker: { color: "#6b7280", emoji: "📍" },
  };

  const config = iconConfig[symbolType] || iconConfig.Marker;
  const { color, emoji } = config;

  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer; font-size: 24px; font-family: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;" title="${symbolType}">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: "custom-icon",
  });
};

function MapClickHandler({ expandedPanel }: { expandedPanel: string | null }) {
  const expandedPanelRef = useRef(expandedPanel);

  useEffect(() => {
    expandedPanelRef.current = expandedPanel;
  }, [expandedPanel]);

  useMapEvent("click", (e) => {
    if (expandedPanelRef.current === "objects") {
      const { latlng } = e;
      window.dispatchEvent(
        new CustomEvent("object-location-selected", {
          detail: { coordinates: [latlng.lat, latlng.lng] },
        }),
      );
    }
  });
  return null;
}

function AutoPanToEdit({
  editingPolygon,
  editingObject,
}: {
  editingPolygon: any;
  editingObject: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (editingPolygon) {
      const coords = editingPolygon.coordinates[0];
      const bounds = L.latLngBounds(
        coords.map((coord: [number, number]) => [coord[1], coord[0]]),
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (editingObject && editingObject.length === 2) {
      const [lat, lon] = editingObject;
      map.flyTo([lat, lon], 15, { duration: 0.5 });
    }
  }, [editingPolygon, editingObject, map]);

  return null;
}

function Map() {
  const { polygons } = usePolygons();
  const { objects, setSelected: setSelectedObject } = useMapObjects();
  const { expandedPanel } = useExpanded();
  const [tempMarkerLocation, setTempMarkerLocation] = useState<
    [number, number] | null
  >(null);
  const [editingPolygon, setEditingPolygon] = useState<any>(null);
  const [editingObjectCoords, setEditingObjectCoords] = useState<
    [number, number] | null
  >(null);

  const israelCenter: [number, number] = [31.7683, 35.2137];
  const zoomLevel = 7;

  useEffect(() => {
    const handleShowTempMarker = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { coordinates } = customEvent.detail;
      setTempMarkerLocation([coordinates[0], coordinates[1]]);
    };

    const handleClearTempMarker = () => {
      setTempMarkerLocation(null);
    };

    const handleEditPolygonMode = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { geometry } = customEvent.detail;
      setEditingPolygon(geometry);
    };

    const handleCancelEditPolygon = () => {
      setEditingPolygon(null);
    };

    const handleEditObjectMode = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { coordinates } = customEvent.detail;
      setEditingObjectCoords(coordinates);
    };

    const handleCancelEditObject = () => {
      setEditingObjectCoords(null);
    };

    window.addEventListener("show-temp-marker", handleShowTempMarker);
    window.addEventListener("clear-temp-marker", handleClearTempMarker);
    window.addEventListener("edit-polygon-mode", handleEditPolygonMode);
    window.addEventListener("cancel-edit-polygon", handleCancelEditPolygon);
    window.addEventListener("edit-object-mode", handleEditObjectMode);
    window.addEventListener("cancel-edit-object", handleCancelEditObject);
    return () => {
      window.removeEventListener("show-temp-marker", handleShowTempMarker);
      window.removeEventListener("clear-temp-marker", handleClearTempMarker);
      window.removeEventListener("edit-polygon-mode", handleEditPolygonMode);
      window.removeEventListener(
        "cancel-edit-polygon",
        handleCancelEditPolygon,
      );
      window.removeEventListener("edit-object-mode", handleEditObjectMode);
      window.removeEventListener("cancel-edit-object", handleCancelEditObject);
    };
  }, []);

  const handleDrawCreate = (e: any) => {
    const layer = e.layer;
    const geoJsonData = layer.toGeoJSON();

    window.dispatchEvent(
      new CustomEvent("polygon-drawn", { detail: geoJsonData.geometry }),
    );
  };

  const getPolygonStyle = () => {
    return {
      color: "#3b82f6",
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3,
    };
  };

  const handlePolygonClick = (polygon: any) => {
    window.dispatchEvent(new CustomEvent("cancel-edit-object"));
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("edit-polygon", {
          detail: {
            id: polygon.id,
            name: polygon.name,
            description: polygon.description,
            geometry: polygon.geometry,
          },
        }),
      );
    }, 100);
  };

  const handleMarkerClick = (obj: any) => {
    window.dispatchEvent(new CustomEvent("cancel-edit-polygon"));
    setSelectedObject(obj.id);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("edit-object", {
          detail: {
            id: obj.id,
            name: obj.name,
            description: obj.description,
            symbolType: obj.symbolType,
            geometry: obj.geometry,
          },
        }),
      );
    }, 100);
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={israelCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="map-container"
        style={{ height: "100%", width: "100%" }}
      >
        <MapClickHandler expandedPanel={expandedPanel} />
        <AutoPanToEdit
          editingPolygon={editingPolygon}
          editingObject={editingObjectCoords}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {expandedPanel === "polygons" && (
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleDrawCreate}
              onEdited={(e: any) => {
                const editedLayers = e.layers;
                editedLayers.eachLayer((layer: any) => {
                  if (layer.toGeoJSON) {
                    const geoJsonData = layer.toGeoJSON();
                    window.dispatchEvent(
                      new CustomEvent("polygon-drawn", {
                        detail: geoJsonData.geometry,
                      }),
                    );
                  }
                });
              }}
              draw={{
                rectangle: false,
                polyline: false,
                circle: false,
                circlemarker: false,
                marker: false,
              }}
              edit={{
                remove: false,
              }}
            />
            {editingPolygon && (
              <Polygon
                key="editing-polygon"
                positions={editingPolygon.coordinates[0].map(
                  (coord: [number, number]) =>
                    [coord[1], coord[0]] as [number, number],
                )}
                pathOptions={{
                  color: "#fbbf24",
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.4,
                }}
              />
            )}
          </FeatureGroup>
        )}

        {polygons.map((polygon) => {
          if (!polygon.geometry || !polygon.geometry.coordinates) {
            return null;
          }
          return (
            <GeoJSON
              key={polygon.id}
              data={
                {
                  type: "Feature",
                  geometry: polygon.geometry,
                  properties: { name: polygon.name },
                } as any
              }
              style={getPolygonStyle()}
              eventHandlers={{
                click: () => handlePolygonClick(polygon),
              }}
            >
              <Popup>{polygon.name}</Popup>
            </GeoJSON>
          );
        })}

        {objects.map((obj) => {
          if (!obj.geometry || !obj.geometry.coordinates) {
            return null;
          }
          return (
            <Marker
              key={obj.id}
              position={[
                obj.geometry.coordinates[1],
                obj.geometry.coordinates[0],
              ]}
              icon={getSymbolIcon(obj.symbolType || "Marker")}
              eventHandlers={{
                click: () => handleMarkerClick(obj),
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{obj.name}</h3>
                  <p className="text-sm text-gray-600">
                    Type: {obj.symbolType || "Marker"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {obj.geometry.coordinates[1].toFixed(4)},
                    {obj.geometry.coordinates[0].toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {tempMarkerLocation && (
          <Marker
            key="temp-marker"
            position={tempMarkerLocation}
            icon={getSymbolIcon("Marker")}
            opacity={0.6}
          >
            <Popup>New object location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
