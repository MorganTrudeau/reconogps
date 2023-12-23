import { SolutionTypes } from "../utils/enums";

export type SolutionType = (typeof SolutionTypes)[keyof typeof SolutionTypes];

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type WeekDayId = "0" | "1" | "2" | "3" | "4" | "5" | "6";

export type Contact = {
  Code: string;
  Number: string | null;
  FamilyId: string | null;
  CheckDigits: string | null;
  CustomerCode: string;
  FirstName: string | null;
  SubName: string | null;
  Mobile: string | null;
  Phone: string | null;
  EMail: string | null;
  RoleType: number;
  AssetIds: string[];
  LoginName: string;
  Password: string;
  LicenceExpiryDate: string | null;
  LicenceDetails: string | null;
};

export type AddContactData = {
  FirstName: string;
  SubName: string;
  EMail: string;
  Mobile: string;
  Phone: string;
};

export type EditContactData = AddContactData & {
  Code: string;
};

export type Permissions = string[];

export type Permissions2 = { autoMonthlyReport?: number };

export type SpeedUnit = "KT" | "KPH" | "MPS" | "MPH";

export type User = {
  Address0: string;
  Address1: string;
  Address2: string;
  Address3: string;
  Address4: string;
  CountryCode: string;
  CustomerName: string;
  CustomerType: number;
  Email: string;
  Expires: string;
  FirstName: string;
  Mobile: string;
  Number: string | null;
  Role: number;
  SMSTimes: number;
  SecurityCode: string;
  SurName: string;
  TimeZone: number;
  TimeZoneID: string;
};

export type StaticAsset = {
  id: string;
  imei: string; //imei
  name: string; //asset name
  tagName: string; //tag name, just additional value
  icon: string; //icon/photo
  speedUnit: SpeedUnit; //unit of speed
  initialMileage: number; //Initial mileage
  initialAccHours: number; //Initial AccOn Hours
  state: string; //asset state
  activationDate: string; //ActivateDate
  subscriptionInterval: string; //Service plan
  productName: string; //Product name
  productFeatureBitSum: string; //Product features bit sum
  alertSettingsBitSum: string; //Alarm settings bit sum (you can ignore it)
  model: string; // model
  make: string; //make
  color: string; //color
  year: string; //year
  installLocation: string; //address of installation
  fieldFloat1: string; // additional value
  fieldFloat2: string; // additional value
  fieldFloat7: string; // additional value
  describe7: string; // additional value
  alarmOptions: string; //Alarm options
  doorStateBitSum: string; //bit sum value for current states of door unlock/immobilising/ignition
  statusNew: string;
  imsi: string; //imsi
  fieldInt2: string; // additional value
  groupCode: string; //GroupCode
  solutionType: SolutionType; //SolutionType
  registration: string; // additional value
  stockNumber: string; // additional value
  maxSpeed: number;
  maxSpeedAlertMode: string; //MaxSpeedAlertMode
  daysInventory: number; //DaysInInventory
  storageTime: string; //StorageTime
  activationTime: string; //ActivationTime
  businessExpense: string; //BusinessExpense
  fuelEconomy: number; //FuelEconomy
  engineCapacity: number; //EngineCapacity
  offroadTaxCredit: string; //OffroadTaxCredit
  assetType: string; //AssetType
  alarmOptions2: string; //AlarmOptions2
  driverCode: string; //DriverCode
  roadSpeed: number; //RoadSpeed
  onWifi: string; //LBS WIFI (using lbs/wifi data if mobile coverage down)
  onStaticDrift: string; //STATIC DRIFT (ignoring of change assets coordinates if ignition off)
  input1: string; //input 1 name
  input2: string; //input 2 name
  shared: boolean; //is asset shared to another account
  suspendDate: string; //SuspendDate
  undefined1: string;
  undefined2: string;
  undefined3: string;
  input1Type: string; //ignore
  input1Name: string;
  input1Mask: string; //ignore
  input1Icon: string;
  input2Type: string; //ignore
  input2Name: string;
  input2Mask: string; //ignore
  input2Icon: string;
  input3Type: string; //ignore
  input3Name: string;
  input3Mask: string; //ignore
  input3Icon: string;
  input4Type: string; //ignore
  input4Name: string;
  input4Mask: string; //ignore
  input4Icon: string;
  output1Type: string; //ignore
  output1Name: string;
  output1Mask: string; //ignore
  output1Icon: string;
  output2Type: string; //ignore
  output2Name: string;
  output2Mask: string; //ignore
  output2Icon: string;
  subscriptionId: string;
  lifeIsLive: string;
};

export type DynamicAsset = {
  id: string;
  imei: string;
  protocolClass: string;
  positionType: number;
  dataType: number;
  positionTime: string | null;
  sysTime: string | null;
  staticTime: string | null;
  isRealTime: boolean;
  isLocated: boolean;
  satelliteSignal: number;
  gsmSignal: number;
  lat: number;
  lng: number;
  alt: number;
  direct: number;
  speed: number;
  mileage: number;
  launchHours: number;
  alerts: number;
  status: number;
  originalAlerts: number;
  originalStatus: number;
};

export type CombinedAsset = {
  staticData: StaticAsset;
  dynamicData?: DynamicAsset;
};

export type SharedAsset = {
  Code: string;
  CreateTime: string;
  CreatorCode: string | null;
  CustomerCode: string;
  EndTime: string;
  IMEI: string;
};

export type SharedAssetListData = SharedAsset & { asset?: StaticAsset };

export type ReportAlarm = { AlertId: string; AlertName: string };

export type OverviewReportOption = { Name: string; Value: string };

export type Geofence = {
  Address: string;
  Alerts: 8 | 16 | 24;
  Alt: number;
  BeginDate: string | null;
  BeginTime: string;
  Code: string;
  ContactList: { Code: string; Mail: string | null }[];
  Content: string;
  CustomerCode: string;
  CycleType: number;
  DelayTime: number;
  EndDate: string | null;
  EndTime: string;
  GeoPolygon: string;
  GeoType: 1 | 2;
  Icon: string;
  InSpeedLimit: number;
  Inverse: 0 | 1;
  Lat: number;
  Lng: number;
  Name: string;
  NotifyTypes: number;
  Radius: number;
  Relay: number;
  RelayTime: number;
  SelectedAssetList: { AsCode: string; IMEI: string }[];
  Share: 0 | 1;
  State: 0 | 1;
  TimeZone: number;
  Unit: "MPS";
  Week: {
    BeginTime: string;
    CustomerCode: string;
    EndTime: string;
    ForeignCode: string;
    Vaild: number;
    Week: number;
  }[];
};

export type AssetProduct = {
  Code: string;
  Name: string;
  Features: string;
};

export type AssetServiceProfile = {
  Code: string;
  Name: string;
  Frequency: string;
};

export type AssetSolution = {
  Code: string;
  Name: string;
  Features: string;
  parameters: string[];
};

export type AssetSSP = {
  AssetGroups: string[];
  AssetTypes: string[];
  Products: AssetProduct[];
  ServiceProfiles: AssetServiceProfile[];
  Solutions: AssetSolution[];
};

export type AssetInfo = {
  AssetType: string;
  Color: string;
  CsCode: string;
  CsName: string;
  DisconnectPower: string;
  Email: string;
  FitmentOptions: string;
  FuelEconomy: string;
  IMEI: string;
  IMSI: string;
  InitAccHours: string;
  InitMileage: string;
  Input1Icon: null;
  Input1Mask: string;
  Input1Name: string;
  Input1Type: string;
  Input2Icon: null;
  Input2Mask: string;
  Input2Name: string;
  Input2Type: string;
  Input3Icon: null;
  Input3Mask: string;
  Input3Name: string;
  Input3Type: string;
  Input4Icon: null;
  Input4Mask: string;
  Input4Name: string;
  Input4Type: string;
  InstallLocation: string;
  LicenceDiscExpiryDate: string;
  LicenceDisk: string;
  LoginName: string;
  LowPower: string;
  Make: string;
  Model: string;
  Name: string;
  Notes: string;
  Output1Icon: null;
  Output1Mask: string;
  Output1Name: string;
  Output1Type: string;
  Output2Icon: null;
  Output2Mask: string;
  Output2Name: string;
  Output2Type: string;
  PowerOn: string;
  Product: string;
  ProductCode: string;
  Registration: string;
  ServicePlanCode: string;
  Solution: "NonActivated" | "Activated";
  StockNumber: string;
  VinNumber: string;
  Voucher: string;
  Year: string;
};

export type AssetActivationInfo = {
  asset: AssetInfo;
  ssp: AssetSSP;
};

export type AssetActivationFormData = {
  name: string;
  solution: string;
  make: string;
  model: string;
  color: string;
  year: string;
  type: string;
};

export type AssetActivationEntry = {
  info: AssetActivationInfo;
  formData: AssetActivationFormData;
};

export type AvailableAlarms = {
  AlertTypes: number;
  BeginTime: "00:00";
  CustomEmails: string;
  CustomPhones: null;
  EmailAlertTypes: number;
  EndTime: "00:00";
  HolderContact: string;
  IMEI: string;
  InputInterval: number;
  IsEmailNotification: boolean;
  IsIgnore: number;
  IsPushNotification: boolean;
  MaxSpeed: number;
  OfflineHours: string;
  SpeedingMode: number;
  Weeks: string;
};

export type PlaybackPoint = {
  object: "playback-point";
  id: string;
  positionTime: number;
  lat: number;
  lng: number;
  direct: number;
  speed: number;
  timeSpan: string;
  mileage: number;
  alerts: number;
  status: string;
};

export type PlaybackEvent = {
  object: "playback-event";
  id: string;
  assetID: number;
  eventClass: number;
  eventType: number;
  state: number;
  otherCode: string | null;
  otherCode2: string | null;
  contactCode: string | null;
  beginTime: string;
  endTime: string;
  positionType: number;
  positionTime: number;
  lat: number;
  lng: number;
  alt: number;
  alerts: number;
  status: number;
  content: null;
};

export type PlaybackTripDetail = {
  AvgSpeed: number;
  Distance: string;
  Duration: string;
  EndDistance: string;
  EndEngineHours: string;
  EndLat: string;
  EndLng: string;
  EndTime: string;
  Expense: number;
  Fuel: string;
  MaxSpeed: number;
  StartDistance: string;
  StartEngineHours: string;
  StartLat: string;
  StartLng: string;
  StartTime: string;
  Voltage: number;
};
export type PlaybackTripTotal = {
  Distance: number;
  Duration: string;
  Fuel: number;
};
export type PlaybackTrip = {
  Details: PlaybackTripDetail[];
  ID: string;
  IMEI: string;
  Name: string;
  Total: PlaybackTripTotal;
};

export type AlarmUserConfiguration = {
  AlertTypes: number;
  BeginTime: string;
  CustomEmails: string;
  CustomPhones: string;
  EmailAlertTypes: number;
  EndTime: string;
  HolderContact: string;
  IMEI: string;
  InputInterval: number;
  IsEmailNotification: boolean;
  IsIgnore: number;
  IsPushNotification: boolean;
  MaxSpeed: number;
  OfflineHours: string;
  SpeedingMode: number;
  Weeks: string;
};

export type AlarmSettings = {
  Email: ["4", "8", "16", "512", "1024", "131072", "1048576"];
  Push: [
    "2",
    "4",
    "8",
    "16",
    "32",
    "128",
    "256",
    "512",
    "1024",
    "32768",
    "65536",
    "131072",
    "262144",
    "524288",
    "1048576",
    "2097152",
    "16777216",
    "33554432",
    "67108864"
  ];
};

export type Notification = {
  title: string;
  alarm: string;
  type: number;
  imei: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  direct: number;
  time: string;
  PositionTime: string;
  AssetName: string;
  Lat: number;
  Lng: number;
  Imei: string;
  Speed: number;
  Direct: number;
  BatteryVoltage: number;
};
