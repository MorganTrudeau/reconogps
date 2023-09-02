import React, { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { getAlarmSettings, getAvailableAlarms } from "../../api/alarms";
import { AlarmSettings, AvailableAlarms } from "../../types";

export const AssetAlarms = ({ assetId }: { assetId: string }) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();

  const { staticAsset, majorToken, minorToken } = useAppSelector((state) => ({
    majorToken: state.auth.majorToken as string,
    minorToken: state.auth.minorToken as string,
    staticAsset: state.assets.staticData.entities[assetId],
  }));
  const dispatch = useAppDispatch();

  const [availableAlarms, setAvailableAlarms] = useState<AvailableAlarms>();
  const [alarmSettings, setAlarmSettings] = useState<AlarmSettings>();

  useEffect(() => {
    if (staticAsset) {
      const loadData = async () => {
        try {
          const _availableAlarms = await getAvailableAlarms(
            staticAsset.solutionType,
            staticAsset.productName
          );
          const _alarmSettings = await getAlarmSettings(
            majorToken,
            minorToken,
            staticAsset.imei
          );
          setAvailableAlarms(_availableAlarms);
          setAlarmSettings(_alarmSettings);
        } catch (error) {
          console.log(error);
        }
      };
    }
  }, []);

  return <></>;
};
