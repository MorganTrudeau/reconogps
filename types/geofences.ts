import { DrawGeofenceTools } from "../utils/enums";

export type DrawGeofenceTool =
  (typeof DrawGeofenceTools)[keyof typeof DrawGeofenceTools];
