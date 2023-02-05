export const Translations = {
  reports: {
    stationary: "Stationary",
    movement: "Movement",
    engine: "Engine",
    milage: "Mileage",
    fuelConsumed: "Fuel Consumed",
    acc2: "Acc2",
    totalMilage: "Total Mileage",
  },
  errors: {
    common: "Something went wrong. Please try again.",
  },
  location: {
    location_permission_error_title: "Insufficient Permissions",
    location_permission_error_message:
      "Location is required to submit hours. Please allow Employee Link location access in your device settings.",
    location_disabled_error_title: "Location Not Enabled",
    location_disabled_error_message:
      "Please enable Location in your phone settings and try again.",
    location_not_found_error_title: "Location Unavailable",
    location_not_found_error_message:
      "Unable to retrieve location. Ensure GPS is enabled and connect to Wifi if available.",
  },
} as const;
