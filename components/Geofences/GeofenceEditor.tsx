import React, { useState } from "react";
import { GeofenceMap, Props as GeofenceMapProps } from "./GeofenceMap";
import { EditGeofenceLayer } from "./EditGeofenceLayer";
import { DrawGeofenceTool } from "../../types/geofences";

export const GeofenceEditor = ({
  geofence,
  onDrawComplete,
}: Omit<GeofenceMapProps, "activeDrawTool">) => {
  const [activeDrawTool, setActiveDrawTool] = useState<DrawGeofenceTool>();

  const handleDrawToolPress = (tool: DrawGeofenceTool) => {
    setActiveDrawTool((t) => (t === tool ? undefined : tool));
  };

  return (
    <>
      <GeofenceMap
        geofence={geofence}
        activeDrawTool={activeDrawTool}
        onDrawComplete={onDrawComplete}
      />
      <EditGeofenceLayer
        activeDrawTool={activeDrawTool}
        onDrawToolPress={handleDrawToolPress}
      />
    </>
  );
};
