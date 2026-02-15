import { useMapObjects, usePolygons } from "./hooks";
import { useEffect } from "react";
import Map from "./components/Map";
import { PolygonsPanel } from "./components/PolygonsPanel";
import { ObjectsPanel } from "./components/ObjectsPanel";
import { MapDataPanel } from "./components/MapDataPanel";
import { ExpandedProvider, useExpanded } from "./contexts/ExpandedContext";
import "./App.css";

function AppContent() {
  const { fetchAll: fetchPolygons } = usePolygons();
  const { fetchAll: fetchMapObjects } = useMapObjects();
  const { expandedPanel } = useExpanded();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchPolygons();
        await fetchMapObjects();
      } catch {}
    };
    loadData();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🗺️ Map Application</h1>
          <p className="app-subtitle">Manage geographic objects and areas</p>
        </div>
      </header>

      <div className="app-main">
        <div className="map-section">
          <div className="section-card map-card">
            <Map />
          </div>
        </div>

        <div
          className={`sidebar-section ${expandedPanel ? "has-expanded" : ""}`}
        >
          <PolygonsPanel />
          <ObjectsPanel />
          <MapDataPanel />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ExpandedProvider>
      <AppContent />
    </ExpandedProvider>
  );
}

export default App;
