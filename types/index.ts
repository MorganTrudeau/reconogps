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
  a1: string; //tag name, just additional value
  icon: string; //icon/photo
  speedUnit: string; //unit of speed
  initialMileage: string; //Initial mileage
  initialAccHours: string; //Initial AccOn Hours
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
  a2: string; // additional value
  a3: string; // additional value
  a4: string; // additional value
  a5: string; // additional value
  alarmOptions: string; //Alarm options
  doorStateBitSum: string; //bit sum value for current states of door unlock/immobilising/ignition
  a6: string; // additional value
  imsi: string; //imsi
  a7: string; // additional value
  groupCode: string; //GroupCode
  solutionType: string; //SolutionType
  a8: string; // additional value
  a9: string; // additional value
  maxSpeedAlertMode: string; //MaxSpeedAlertMode
  daysInventory: string; //DaysInInventory
  storageTime: string; //StorageTime
  activationTime: string; //ActivationTime
  businessExpense: string; //BusinessExpense
  fuelEconomy: string; //FuelEconomy
  engineCapacity: string; //EngineCapacity
  offroadTaxCredit: string; //OffroadTaxCredit
  assetType: string; //AssetType
  alarmOptions2: string; //AlarmOptions2
  driverCode: string; //DriverCode
  roadSpeed: string; //RoadSpeed
  onWifi: string; //LBS WIFI (using lbs/wifi data if mobile coverage down)
  onStaticDrift: string; //STATIC DRIFT (ignoring of change assets coordinates if ignition off)
  input1: string; //input 1 name
  input2: string; //input 2 name
  shared: string; //is asset shared to another account
  suspendDate: string; //SuspendDate
  a10: string; // additional value
};

export type DynamicAsset = {};
