import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { loadNotifications } from "../redux/thunks/notifications";

const NotificationsManager = () => {
  const { minorToken, majorToken, deviceToken } = useAppSelector((state) => ({
    minorToken: state.auth.minorToken,
    majorToken: state.auth.majorToken,
    deviceToken: state.notifications.deviceToken,
  }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (minorToken && majorToken && deviceToken) {
      dispatch(loadNotifications());
    }
  }, [minorToken, majorToken, deviceToken]);

  return null;
};

export default NotificationsManager;
