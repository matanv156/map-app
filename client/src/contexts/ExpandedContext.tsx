import React, { createContext, useContext, useState } from "react";

interface ExpandedContextType {
  expandedPanel: string | null;
  setExpandedPanel: (panel: string | null) => void;
}

const ExpandedContext = createContext<ExpandedContextType | undefined>(
  undefined,
);

export const ExpandedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);

  return (
    <ExpandedContext.Provider value={{ expandedPanel, setExpandedPanel }}>
      {children}
    </ExpandedContext.Provider>
  );
};

export const useExpanded = () => {
  const context = useContext(ExpandedContext);
  if (!context) {
    throw new Error("useExpanded must be used within ExpandedProvider");
  }
  return context;
};
