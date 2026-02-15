import { useState, useEffect } from "react";
import { useMapObjects } from "../hooks";
import { useExpanded } from "../contexts/ExpandedContext";
import type { CreateMapObjectDto } from "../types";

export const ObjectsPanel = () => {
  const { objects, createObject, updateObject, fetchAll } = useMapObjects();
  const { expandedPanel, setExpandedPanel } = useExpanded();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMapObjectDto>({
    name: "",
    description: "",
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
    symbolType: "Marker",
  });

  const symbolTypes = [
    "Marker",
    "Landmark",
    "Beach",
    "Historical",
    "Monument",
    "Garden",
    "Museum",
    "Nature",
  ];

  const getEmptyFormData = (): CreateMapObjectDto => ({
    name: "",
    description: "",
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
    symbolType: "Marker",
  });

  useEffect(() => {
    const handleOpenForm = () => {
      setIsAdding(true);
      setIsEditing(false);
      setExpandedPanel("objects");
      setFormData(getEmptyFormData());
    };

    const handleEditObject = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id, name, description, geometry, symbolType } =
        customEvent.detail;
      setEditingId(id);
      setIsEditing(true);
      setIsAdding(false);
      setFormData({
        name: name || "",
        description: description || "",
        geometry: geometry || { type: "Point", coordinates: [0, 0] },
        symbolType: symbolType || "Marker",
      });
      const eventCoordinates = [
        geometry.coordinates[1],
        geometry.coordinates[0],
      ];
      window.dispatchEvent(
        new CustomEvent("edit-object-mode", {
          detail: {
            coordinates: eventCoordinates,
          },
        }),
      );
      setExpandedPanel("objects");
    };

    const handleLocationSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { coordinates } = customEvent.detail;
      setFormData((prev) => ({
        ...prev,
        geometry: {
          type: "Point",
          coordinates: [coordinates[1], coordinates[0]],
        },
      }));
      window.dispatchEvent(
        new CustomEvent("show-temp-marker", {
          detail: { coordinates: [coordinates[0], coordinates[1]] },
        }),
      );
    };

    const handleCancelEditObject = () => {
      setIsAdding(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData(getEmptyFormData());
      setExpandedPanel(null);
      window.dispatchEvent(new CustomEvent("clear-temp-marker"));
    };

    window.addEventListener("open-object-form", handleOpenForm);
    window.addEventListener("edit-object", handleEditObject);
    window.addEventListener("object-location-selected", handleLocationSelected);
    window.addEventListener("cancel-edit-object", handleCancelEditObject);
    return () => {
      window.removeEventListener("open-object-form", handleOpenForm);
      window.removeEventListener("edit-object", handleEditObject);
      window.removeEventListener(
        "object-location-selected",
        handleLocationSelected,
      );
      window.removeEventListener("cancel-edit-object", handleCancelEditObject);
    };
  }, [setExpandedPanel]);

  // Close this panel if another panel becomes active
  useEffect(() => {
    if (
      expandedPanel &&
      expandedPanel !== "objects" &&
      (isAdding || isEditing)
    ) {
      setIsAdding(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData(getEmptyFormData());
      window.dispatchEvent(new CustomEvent("clear-temp-marker"));
    }
  }, [expandedPanel]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter an object name");
      return;
    }
    try {
      if (isEditing && editingId) {
        const objectToUpdate = {
          id: editingId,
          ...formData,
        };
        await updateObject(objectToUpdate as any);
      } else {
        await createObject(formData);
      }
      setIsAdding(false);
      setIsEditing(false);
      setEditingId(null);
      setExpandedPanel(null);
      setFormData(getEmptyFormData());
      window.dispatchEvent(new CustomEvent("clear-temp-marker"));
      window.dispatchEvent(new CustomEvent("cancel-edit-object"));
      await fetchAll();
    } catch (error) {
      console.error("Error saving object:", error);
      alert(
        "Failed to save object: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setEditingId(null);
    setExpandedPanel(null);
    setFormData(getEmptyFormData());
    // Clear temporary marker and editing mode
    window.dispatchEvent(new CustomEvent("clear-temp-marker"));
    window.dispatchEvent(new CustomEvent("cancel-edit-object"));
  };

  return (
    <div
      className={`section-card ${isAdding || isEditing ? "card-expanded" : ""}`}
    >
      <div className="card-header">
        <h2 className="card-title">Objects</h2>
        {!isAdding && !isEditing && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span className="badge">{objects.length}</span>
            <button
              className="btn btn-small"
              onClick={() => {
                setIsAdding(true);
                setExpandedPanel("objects");
              }}
            >
              +
            </button>
          </div>
        )}
      </div>
      {isAdding || isEditing ? (
        <div className="card-content">
          <div
            style={{
              padding: "0.75rem",
              backgroundColor: "#f0f9ff",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
              color: "#0369a1",
            }}
          >
            💡{" "}
            {isEditing
              ? "Update the object"
              : "Click on the map to select a location, or enter coordinates"}{" "}
            manually below
          </div>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter object name"
            />

            <label>Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter object description (optional)"
              style={{ minHeight: "80px" }}
            />

            <label>Symbol Type</label>
            <select
              value={formData.symbolType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  symbolType: e.target.value,
                })
              }
            >
              {symbolTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label>Latitude</label>
            <input
              type="number"
              value={formData.geometry.coordinates[1]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  geometry: {
                    ...formData.geometry,
                    coordinates: [
                      formData.geometry.coordinates[0],
                      parseFloat(e.target.value),
                    ],
                  },
                })
              }
              placeholder="Enter latitude"
              step="0.0001"
            />

            <label>Longitude</label>
            <input
              type="number"
              value={formData.geometry.coordinates[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  geometry: {
                    ...formData.geometry,
                    coordinates: [
                      parseFloat(e.target.value),
                      formData.geometry.coordinates[1],
                    ],
                  },
                })
              }
              placeholder="Enter longitude"
              step="0.0001"
            />

            <div className="form-buttons">
              <button className="btn btn-primary" onClick={handleSave}>
                {isEditing ? "Update Object" : "Create Object"}
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
