import React, { useState } from "react";
import { GeofenceMap } from "./GeofenceMap";
import { EditGeofenceLayer } from "./EditGeofenceLayer";
import { Geofence } from "../../types";
import { DrawGeofenceTool } from "../../types/geofences";

export const GeofenceEditor = ({ geofence }: { geofence: Geofence }) => {
  const [activeDrawTool, setActiveDrawTool] = useState<DrawGeofenceTool>();

  const handleDrawToolPress = (tool: DrawGeofenceTool) => {
    setActiveDrawTool((t) => (t === tool ? undefined : tool));
  };

  return (
    <>
      <GeofenceMap geofence={geofence} activeDrawTool={activeDrawTool} />
      <EditGeofenceLayer
        activeDrawTool={activeDrawTool}
        onDrawToolPress={handleDrawToolPress}
      />
    </>
  );
};
