import { useState } from "react";
import { usePolygons } from "../hooks";
import { useMapObjects } from "../hooks";

export const MapDataPanel = () => {
  const { polygons, deletePolygon, fetchAll } = usePolygons();
  const { objects, deleteObject } = useMapObjects();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"polygon" | "object" | null>(
    null,
  );

  const handleEdit = (id: string, type: "polygon" | "object", data?: any) => {
    if (type === "polygon") {
      window.dispatchEvent(
        new CustomEvent("edit-polygon", { detail: { id, ...data } }),
      );
    } else if (type === "object") {
      window.dispatchEvent(
        new CustomEvent("edit-object", { detail: { id, ...data } }),
      );
    }
  };

  const handleDeleteClick = (id: string, type: "polygon" | "object") => {
    setDeletingId(id);
    setDeleteType(type);
  };

  const confirmDelete = async () => {
    if (!deletingId || !deleteType) return;

    try {
      if (deleteType === "polygon") {
        await deletePolygon(deletingId);
      } else {
        await deleteObject(deletingId);
      }
      await fetchAll();
      setDeletingId(null);
      setDeleteType(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(
        "Failed to delete: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
    setDeleteType(null);
  };

  return (
    <div className="section-card map-data-card">
      <div className="card-header">
        <h2 className="card-title">Map Data</h2>
      </div>
      <div className="card-content">
        {polygons.length === 0 && objects.length === 0 ? (
          <div className="empty-state-container">
            <p className="empty-state">No data to display</p>
          </div>
        ) : (
          <div className="map-data-container">
            {objects.length > 0 && (
              <div className="data-section">
                <h3
                  style={{
                    fontSize: "0.95rem",
                    marginTop: 0,
                    marginBottom: "0.75rem",
                  }}
                >
                  Objects ({objects.length})
                </h3>
                <div className="data-table">
                  <div className="data-table-header">
                    <div className="data-col-name">Name</div>
                    <div className="data-col-type">Type</div>
                    <div className="data-col-actions">Actions</div>
                  </div>
                  {objects.map((obj) => (
                    <div key={obj.id} className="data-table-row">
                      <div className="data-col-name">
                        <div>{obj.name}</div>
                        {obj.description && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#666",
                              marginTop: "0.25rem",
                            }}
                          >
                            {obj.description}
                          </div>
                        )}
                      </div>
                      <div className="data-col-type">
                        {obj.symbolType || "Marker"}
                      </div>
                      <div className="data-col-actions">
                        <button
                          className="btn btn-tiny btn-primary"
                          onClick={() => handleEdit(obj.id, "object", obj)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-tiny btn-danger"
                          onClick={() => handleDeleteClick(obj.id, "object")}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {polygons.length > 0 && (
              <div
                className="data-section"
                style={{ marginTop: objects.length > 0 ? "1rem" : 0 }}
              >
                <h3
                  style={{
                    fontSize: "0.95rem",
                    marginTop: 0,
                    marginBottom: "0.75rem",
                  }}
                >
                  Polygons ({polygons.length})
                </h3>
                <div className="data-table">
                  <div className="data-table-header">
                    <div className="data-col-name">Name</div>
                    <div className="data-col-type">Vertices</div>
                    <div className="data-col-actions">Actions</div>
                  </div>
                  {polygons.map((polygon) => {
                    if (
                      !polygon.geometry ||
                      !polygon.geometry.coordinates ||
                      !polygon.geometry.coordinates[0]
                    ) {
                      return null;
                    }
                    const coords = polygon.geometry.coordinates[0];
                    const vertexCount = coords.length;

                    return (
                      <div key={polygon.id} className="data-table-row">
                        <div className="data-col-name">
                          <div>{polygon.name}</div>
                          {polygon.description && (
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#666",
                                marginTop: "0.25rem",
                              }}
                            >
                              {polygon.description}
                            </div>
                          )}
                        </div>
                        <div className="data-col-type">{vertexCount}</div>
                        <div className="data-col-actions">
                          <button
                            className="btn btn-tiny btn-primary"
                            onClick={() =>
                              handleEdit(polygon.id, "polygon", polygon)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-tiny btn-danger"
                            onClick={() =>
                              handleDeleteClick(polygon.id, "polygon")
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {deletingId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={cancelDelete}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this{" "}
              {deleteType === "polygon" ? "polygon" : "object"}? This action
              cannot be undone.
            </p>
            <div className="form-buttons">
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
