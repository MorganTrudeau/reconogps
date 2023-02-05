import moment from "moment";
import { DynamicAsset, StaticAsset } from "../types";
import { Constants } from "./constants";

export const assetHasIcon = (staticAsset: StaticAsset): boolean => {
  const pattern = /^IMEI_/i;
  return !!staticAsset.icon && pattern.test(staticAsset.icon);
};

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

const CurrentTimeZone = moment().utcOffset() / 60;
export const initDynamicAssetData = (data: any[]): DynamicAsset => {
  const dynamicAsset: DynamicAsset = {
    id: data[0],
    imei: data[1],
    protocolClass: data[2],
    positionType: data[3],
    dataType: data[4],
    positionTime:
      data[5] !== null
        ? moment(data[5].split(".")[0])
            .add(CurrentTimeZone, "hours")
            .format(Constants.MOMENT_DATE_TIME_FORMAT)
        : null,
    sysTime:
      data[6] !== null
        ? moment(data[6].split(".")[0])
            .add(CurrentTimeZone, "hours")
            .format(Constants.MOMENT_DATE_TIME_FORMAT)
        : null,
    staticTime:
      data[7] !== null
        ? moment(data[7])
            .add(CurrentTimeZone, "hours")
            .format(Constants.MOMENT_DATE_TIME_FORMAT)
        : null,
    isRealTime: data[8],
    isLocated: data[9],
    satelliteSignal: data[10],
    gsmSignal: data[11],
    lat: Number(data[12]),
    lng: Number(data[13]),
    alt: Number(data[14]),
    direct: data[15],
    speed: data[16],
    mileage: data[17],
    launchHours: data[18],
    alerts: data[19],
    status: data[20],
    originalAlerts: data[21],
    originalStatus: data[22],
  };

  return dynamicAsset;
};
