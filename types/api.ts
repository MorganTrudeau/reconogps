import { StaticAsset } from ".";

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

export type EditAssetParams = {
  MinorToken: string;
  MajorToken: string;
  Code: StaticAsset["id"];
  IMEI: StaticAsset["imei"];
  name: StaticAsset["name"];
  registration: StaticAsset["registration"];
  speedUnit: StaticAsset["speedUnit"];
  initMileage: StaticAsset["initialMileage"];
  initAccHours: StaticAsset["initialAccHours"];
  attr1: StaticAsset["make"];
  attr2: StaticAsset["model"];
  attr3: StaticAsset["color"];
  attr4: StaticAsset["year"];
  MaxSpeed: StaticAsset["maxSpeed"];
  AssetType: StaticAsset["assetType"];
  DriverCode: StaticAsset["driverCode"];
  RoadSpeed: number;
  LBSWIFI: number;
  STATICDRIFT: number;
  Input1Name: StaticAsset["input1"];
  Input2Name: StaticAsset["input2"];
};