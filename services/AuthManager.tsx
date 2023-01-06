import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { refreshToken } from "../redux/thunks/auth";

const AuthManager = () => {
  const dispatch = useAppDispatch();
  const { majorToken, minorToken, deviceToken } = useAppSelector((state) => ({
    majorToken: state.auth.majorToken,
    minorToken: state.auth.minorToken,
    deviceToken: state.auth.deviceToken,
  }));

  const handleRefreshToken = () => {
    if (majorToken && minorToken && deviceToken) {
      dispatch(refreshToken({ majorToken, minorToken, deviceToken }));
    }
  };

  useEffect(() => {
    handleRefreshToken();
  }, []);

  return null;
};

export default AuthManager;
