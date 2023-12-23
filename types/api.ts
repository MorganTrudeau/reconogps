export type ReportParams = {
  MajorToken: string;
  MinorToken: string;
  IMEIs: string[];
  Emails: string[];
  Export: "PDF";
  Logo: string;
  DateFrom?: string;
  DateTo?: string;
  To: string;
  From: string;
  AlertIds?: string[];
  Alerts?: string[];
  AsIds?: string[];
  Features?: string[];
  GetGeofenceCodes?: string[];
  EventClass?: string;
  EventTypes?: number[] | string;
  EventDurations?: string[];
};

export type EditGeofenceParams = {
  MajorToken: string;
  MinorToken: string;
  Lat: number;
  Lng: number;
  Radius: number;
  GeoType: 1 | 2;
  GeoPolygon?: string;
  Name: string;
  Alerts: string;
  Address: string;
  AssetCodes: string;
  ContactCodes: string;
  AlertConfigState: 0 | 1;
  Share: 0 | 1;
  Inverse: 0 | 1;
  BeginTime: string;
  EndTime: string;
  DelayTime: 0;
  CycleType: 3; // NONE = 0, TIME = 1, DATE = 2, WEEK = 3
  Days: string;
  Code?: string;
  InSpeedLimit: number;
  RelayTime: number;
  Relay: number;
};
