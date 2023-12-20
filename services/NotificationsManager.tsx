import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { loadNotifications } from "../redux/thunks/notifications";

const NotificationsManager = () => {
  const { minorToken, majorToken } = useAppSelector((state) => ({
    minorToken: state.auth.minorToken,
    majorToken: state.auth.majorToken,
  }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (minorToken && majorToken) {
      dispatch(loadNotifications());
    }
  }, []);

  return null;
};

export default NotificationsManager;
