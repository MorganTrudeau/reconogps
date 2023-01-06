import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { refreshToken } from "../redux/thunks/auth";

const AuthManager = () => {
  const dispatch = useAppDispatch();

  const handleRefreshToken = () => {
    dispatch(refreshToken());
  };

  useEffect(() => {
    handleRefreshToken();
  }, []);

  return null;
};

export default AuthManager;
