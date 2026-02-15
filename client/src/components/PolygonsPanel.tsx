import { useState, useEffect } from "react";
import { usePolygons } from "../hooks";
import { useExpanded } from "../contexts/ExpandedContext";
import type { CreatePolygonDto } from "../types";

export const PolygonsPanel = () => {
  const { polygons, createPolygon, updatePolygon, fetchAll } = usePolygons();
  const { expandedPanel, setExpandedPanel } = useExpanded();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePolygonDto>({
    name: "",
    description: "",
    geometry: {
      type: "Polygon",
      coordinates: [[]],
    },
  });

  const getEmptyFormData = (): CreatePolygonDto => ({
    name: "",
    description: "",
    geometry: {
      type: "Polygon",
      coordinates: [[]],
    },
  });

  useEffect(() => {
    const handleOpenForm = () => {
      setIsAdding(true);
      setIsEditing(false);
      setFormData(getEmptyFormData());
    };

    const handleEditPolygon = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { id, name, description, geometry } = customEvent.detail;
      setEditingId(id);
      setIsEditing(true);
      setIsAdding(false);
      setExpandedPanel("polygons");
      setFormData({ name, description, geometry });
      window.dispatchEvent(
        new CustomEvent("edit-polygon-mode", {
          detail: { geometry },
        }),
      );
    };

    const handlePolygonDrawn = (e: Event) => {
      const customEvent = e as CustomEvent;
      setFormData((prev) => ({
        ...prev,
        geometry: customEvent.detail,
      }));
    };

    const handleCancelEditPolygon = () => {
      setIsAdding(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData(getEmptyFormData());
      setExpandedPanel(null);
    };

    window.addEventListener("open-polygon-form", handleOpenForm);
    window.addEventListener("edit-polygon", handleEditPolygon);
    window.addEventListener("polygon-drawn", handlePolygonDrawn);
    window.addEventListener("cancel-edit-polygon", handleCancelEditPolygon);

    return () => {
      window.removeEventListener("open-polygon-form", handleOpenForm);
      window.removeEventListener("edit-polygon", handleEditPolygon);
      window.removeEventListener("polygon-drawn", handlePolygonDrawn);
      window.removeEventListener(
        "cancel-edit-polygon",
        handleCancelEditPolygon,
      );
    };
  }, []);

  useEffect(() => {
    if (isAdding) {
      setExpandedPanel("polygons");
    }
  }, [isAdding, setExpandedPanel]);

  useEffect(() => {
    if (
      expandedPanel &&
      expandedPanel !== "polygons" &&
      (isAdding || isEditing)
    ) {
      setIsAdding(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData(getEmptyFormData());
    }
  }, [expandedPanel]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a polygon name");
      return;
    }
    if (
      !formData.geometry.coordinates[0] ||
      formData.geometry.coordinates[0].length === 0
    ) {
      alert("Please draw a polygon on the map");
      return;
    }
    try {
      await createPolygon(formData);
      setIsAdding(false);
      setFormData(getEmptyFormData());
      await fetchAll();
    } catch (error) {
      console.error("Error creating polygon:", error);
      alert(
        "Failed to create polygon: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const handleUpdateSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a polygon name");
      return;
    }
    if (editingId) {
      try {
        await updatePolygon({
          id: editingId,
          name: formData.name,
          description: formData.description,
          geometry: formData.geometry,
        });
        setIsEditing(false);
        setEditingId(null);
        setFormData(getEmptyFormData());
        window.dispatchEvent(new CustomEvent("cancel-edit-polygon"));
        await fetchAll();
      } catch (error) {
        console.error("Error updating polygon:", error);
        alert(
          "Failed to update polygon: " +
            (error instanceof Error ? error.message : "Unknown error"),
        );
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData(getEmptyFormData());
    window.dispatchEvent(new CustomEvent("cancel-edit-polygon"));
  };

  return (
    <div
      className={`section-card ${isAdding || isEditing ? "card-expanded" : ""}`}
    >
      <div className="card-header">
        <h2 className="card-title">Polygons</h2>
        {!isAdding && !isEditing && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span className="badge">{polygons.length}</span>
            <button className="btn btn-small" onClick={() => setIsAdding(true)}>
              +
            </button>
          </div>
        )}
      </div>
      {isAdding || isEditing ? (
        <div className="card-content">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter polygon name"
            />

            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description (optional)"
              rows={3}
            />

            <div className="form-buttons">
              <button
                className="btn btn-primary"
                onClick={isAdding ? handleSave : handleUpdateSave}
              >
                {isAdding ? "Create Polygon" : "Update Polygon"}
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>

            {isAdding && (
              <p className="form-hint">Click on the map to draw your polygon</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
