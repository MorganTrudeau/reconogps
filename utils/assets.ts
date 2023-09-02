import moment from "moment";
import {
  AssetSolution,
  DynamicAsset,
  SolutionType,
  SpeedUnit,
  StaticAsset,
} from "../types";
import { MaterialIcon } from "../types/styles";
import { Constants } from "./constants";
import { getDirectionCardinal } from "./maps";

export const isDoorLocked = (staticAsset: StaticAsset) => {
  return (
    !!staticAsset.statusNew && (parseInt(staticAsset.statusNew, 10) & 4) > 0
  );
};

export const isImmobilized = (staticAsset: StaticAsset) => {
  return (
    !!staticAsset.statusNew && (parseInt(staticAsset.statusNew, 10) & 2) > 0
  );
};

export const isGeolocked = (staticAsset: StaticAsset) => {
  return (
    !!staticAsset.statusNew && (parseInt(staticAsset.statusNew, 10) & 1) > 0
  );
};

export const IsImmobilisationSupported = (staticAsset: StaticAsset) =>
  (parseInt(staticAsset.fieldInt2) & 1) > 0;

export const IsLockDoorSupported = (staticAsset: StaticAsset) =>
  (parseInt(staticAsset.fieldInt2) & 512) > 0;

export const getAssetDirection = (dynamicAsset: DynamicAsset) => {
  return (
    getDirectionCardinal(dynamicAsset.direct) +
    " (" +
    dynamicAsset.direct +
    `\u00b0)`
  );
};

const getMileageValue = (speedUnit: SpeedUnit, mileage: number) => {
  let ret = 0;
  switch (speedUnit) {
    case "KT":
      ret = mileage * 0.53995680345572;
      break;
    case "KPH":
      ret = mileage;
      break;
    case "MPS":
      ret = mileage * 1000;
      break;
    case "MPH":
      ret = mileage * 0.62137119223733;
      break;
    default:
      break;
  }
  return ret;
};

export const getMileageUnit = (speedUnit: SpeedUnit) => {
  let ret = "";
  switch (speedUnit) {
    case "KT":
      ret = "mile";
      break;
    case "KPH":
      ret = "km";
      break;
    case "MPS":
      ret = "m";
      break;
    case "MPH":
      ret = "mile";
      break;
    default:
      break;
  }
  return ret;
};

export const getMileage = (
  dynamicAsset: DynamicAsset,
  staticAsset: StaticAsset
) => {
  console.log(staticAsset, dynamicAsset);
  return (
    Number(staticAsset.initialMileage) +
    getMileageValue(staticAsset.speedUnit, dynamicAsset.mileage) +
    getMileageUnit(staticAsset.speedUnit)
  );
};

export const getAssetSolutionName = (solution: AssetSolution): string => {
  switch (solution.Code) {
    case "Loc8":
      return "Locate";
    case "QProtect":
      return "Protect";
    default:
      return solution.Name;
  }
};

export const sortAssetTypes = (types: string[]) => {
  const preferredOrder = [
    "Car",
    "Truck",
    "Plant and Equipment",
    "Trailer",
    "SUV",
  ];

  const blacklist = ["Jetski", "Pick-up", "WiTi"];

  return types
    .filter((type) => !blacklist.includes(type))
    .sort((a, b) => {
      if (a === "Other") {
        return 1;
      } else if (b === "Other") {
        return -1;
      }
      const orderA = preferredOrder.indexOf(a);
      const orderB = preferredOrder.indexOf(b);

      return orderB === -1 ? -1 : orderA === -1 ? 1 : orderA - orderB;
    });
};

export const getAssetTypeIcon = (type: string): MaterialIcon => {
  switch (type) {
    case "Car":
      return "car";
    case "Truck":
      return "truck-flatbed";
    case "Plant and Equipment":
      return "excavator";
    case "Trailer":
      return "truck-trailer";
    case "SUV":
      return "car-estate";
    case "Pet":
      return "dog-side";
    case "Dump Truck":
      return "dump-truck";
    case "Bus":
      return "bus-side";
    case "Boat":
      return "sail-boat";
    case "Personal":
      return "account";
    case "Forklift":
      return "forklift";
    case "Bike":
      return "motorbike";
    case "Caravan":
      return "caravan";
    case "Containor":
      return "truck-cargo-container";
    case "Other":
      return "crosshairs-gps";
    default:
      return "car";
  }
};

export const getAssetTypeName = (type: string): string => {
  return type;
};

export const assetHasIcon = (staticAsset: StaticAsset): boolean => {
  const pattern = /^IMEI_/i;
  return !!staticAsset.icon && pattern.test(staticAsset.icon);
};

const mapAssetArray = (assetValues: string[]) => {
  let index = 0;
  const staticAsset: StaticAsset = {
    id: assetValues[index++],
    imei: assetValues[index++],
    name: assetValues[index++],
    tagName: assetValues[index++],
    icon: assetValues[index++],
    speedUnit: assetValues[index++] as SpeedUnit,
    initialMileage: Number(assetValues[index++]),
    initialAccHours: Number(assetValues[index++]),
    state: assetValues[index++],
    activationDate: assetValues[index++],
    subscriptionInterval: assetValues[index++],
    productName: assetValues[index++],
    productFeatureBitSum: assetValues[index++],
    alertSettingsBitSum: assetValues[index++],
    model: assetValues[index++],
    make: assetValues[index++],
    color: assetValues[index++],
    year: assetValues[index++],
    installLocation: assetValues[index++],
    fieldFloat1: assetValues[index++],
    fieldFloat2: assetValues[index++],
    fieldFloat7: assetValues[index++],
    describe7: assetValues[index++],
    alarmOptions: assetValues[index++],
    statusNew: assetValues[index++],
    doorStateBitSum: assetValues[index++],
    imsi: assetValues[index++],
    fieldInt2: assetValues[index++],
    groupCode: assetValues[index++],
    solutionType: assetValues[index++] as SolutionType,
    registration: assetValues[index++],
    stockNumber: assetValues[index++],
    maxSpeed: Number(assetValues[index++]),
    maxSpeedAlertMode: assetValues[index++],
    daysInventory: moment
      .utc()
      .diff(
        moment.utc(assetValues[index], Constants.MOMENT_TIMEFORMAT4),
        "days"
      ),
    storageTime: assetValues[index++],
    activationTime: assetValues[index++],
    businessExpense: assetValues[index++],
    fuelEconomy: Number(assetValues[index++]),
    engineCapacity: Number(assetValues[index++]),
    offroadTaxCredit: assetValues[index++],
    assetType: assetValues[index++],
    alarmOptions2: assetValues[index++],
    driverCode: assetValues[index++],
    roadSpeed: Number(assetValues[index++]),
    onWifi: assetValues[index++],
    onStaticDrift: assetValues[index++],
    input1: assetValues[index++],
    input2: assetValues[index++],
    shared: assetValues[index++].toLowerCase() === "true",
    suspendDate: assetValues[index++],
    undefined1: assetValues[index++],
    undefined2: assetValues[index++],
    undefined3: assetValues[index++],
    input1Type: assetValues[index++], //ignore
    input1Name: assetValues[index++],
    input1Mask: assetValues[index++], //ignore
    input1Icon: assetValues[index++],
    input2Type: assetValues[index++], //ignore
    input2Name: assetValues[index++],
    input2Mask: assetValues[index++], //ignore
    input2Icon: assetValues[index++],
    input3Type: assetValues[index++], //ignore
    input3Name: assetValues[index++],
    input3Mask: assetValues[index++], //ignore
    input3Icon: assetValues[index++],
    input4Type: assetValues[index++], //ignore
    input4Name: assetValues[index++],
    input4Mask: assetValues[index++], //ignore
    input4Icon: assetValues[index++],
    output1Type: assetValues[index++], //ignore
    output1Name: assetValues[index++],
    output1Mask: assetValues[index++], //ignore
    output1Icon: assetValues[index++],
    output2Type: assetValues[index++], //ignore
    output2Name: assetValues[index++],
    output2Mask: assetValues[index++], //ignore
    output2Icon: assetValues[index++],
    subscriptionId: assetValues[index++],
    lifeIsLive: assetValues[index++],
  };

  return staticAsset;
};

export const mapArrayOfAssetArrays = (assetArrays: any[][]): StaticAsset[] => {
  return assetArrays.reduce((acc, assetArray) => {
    const assetObj = mapAssetArray(assetArray);

    return [...acc, assetObj];
  }, [] as StaticAsset[]);
};

const CurrentTimeZone = moment().utcOffset() / 60;
export const initDynamicAssetData = (data: string[]): DynamicAsset => {
  const dynamicAsset: DynamicAsset = {
    id: data[0],
    imei: data[1],
    protocolClass: data[2],
    positionType: Number(data[3]),
    dataType: Number(data[4]),
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
    isRealTime: Boolean(data[8]),
    isLocated: Boolean(data[9]),
    satelliteSignal: Number(data[10]),
    gsmSignal: Number(data[11]),
    lat: Number(data[12]),
    lng: Number(data[13]),
    alt: Number(data[14]),
    direct: Number(data[15]),
    speed: Number(data[16]),
    mileage: Number(data[17]),
    launchHours: Number(data[18]),
    alerts: Number(data[19]),
    status: Number(data[20]),
    originalAlerts: Number(data[21]),
    originalStatus: Number(data[22]),
  };

  return dynamicAsset;
};
