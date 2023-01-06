import { StaticAsset } from "../types";

export const getAssetKeyFromIndex = (index: number): keyof StaticAsset => {
  const indexKeyMap: { [num: number]: keyof StaticAsset | "" } = {
    0: "id",
    1: "imei", //imei
    2: "name", //asset name
    3: "", //tag name, just additional value
    4: "icon", //icon/photo
    5: "speedUnit", //unit of speed
    6: "initialMileage", //Initial mileage
    7: "initialAccHours", //Initial AccOn Hours
    8: "state", //asset state
    9: "activationDate", //ActivateDate
    10: "subscriptionInterval", //Service plan
    11: "productName", //Product name
    12: "productFeatureBitSum", //Product features bit sum
    13: "alertSettingsBitSum", //Alarm settings bit sum (you can ignore it)
    14: "model", // model
    15: "make", //make
    16: "color", //color
    17: "year", //year
    18: "installLocation", //address of installation
    19: "", // additional value
    20: "", // additional value
    21: "", // additional value
    22: "", // additional value
    23: "alarmOptions", //Alarm options
    24: "doorStateBitSum", //bit sum value for current states of door unlock/immobilising/ignition
    25: "", // additional value
    26: "imsi", //imsi
    27: "", // additional value
    28: "groupCode", //GroupCode
    29: "solutionType", //SolutionType
    30: "", // additional value
    31: "", // additional value
    32: "maxSpeedAlertMode", //MaxSpeedAlertMode
    33: "daysInventory", //DaysInInventory
    34: "storageTime", //StorageTime
    35: "activationTime", //ActivationTime
    36: "businessExpense", //BusinessExpense
    37: "fuelEconomy", //FuelEconomy
    38: "engineCapacity", //EngineCapacity
    39: "offroadTaxCredit", //OffroadTaxCredit
    40: "assetType", //AssetType
    41: "alarmOptions2", //AlarmOptions2
    42: "driverCode", //DriverCode
    43: "roadSpeed", //RoadSpeed
    44: "onWifi", //LBS WIFI (using lbs/wifi data if mobile coverage down)
    45: "onStaticDrift", //STATIC DRIFT (ignoring of change assets coordinates if ignition off)
    46: "input1", //input 1 name
    47: "input2", // input 2 name
    48: "shared", //is asset shared to another account
    49: "suspendDate", //SuspendDate
    50: "", // additional value
  };

  // @ts-ignore
  return indexKeyMap[index] || `a${index}`;
};

const mapAssetArray = (assetArray: any[]): StaticAsset[] => {
  return assetArray.reduce((acc, val, index) => {
    return { ...acc, [getAssetKeyFromIndex(index)]: val };
  }, {} as StaticAsset);
};

export const mapArrayOfAssetArrays = (assetArrays: any[][]): StaticAsset[] => {
  return assetArrays.reduce((acc, assetArray) => {
    const assetObj = mapAssetArray(assetArray);

    return [...acc, assetObj];
  }, [] as StaticAsset[]);
};
