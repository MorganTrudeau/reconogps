import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { login } from "../redux/thunks/auth";
import { useAppSelector } from "../hooks/useAppSelector";

const AuthManager = () => {
  const { account, password } = useAppSelector((state) => ({
    account: state.auth.account,
    password: state.auth.password,
  }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (account && password) {
      dispatch(login({ account, password }));
    }
  }, []);

  // const handleRefreshToken = () => {
  //   dispatch(refreshToken());
  // };

  // useEffect(() => {
  //   handleRefreshToken();
  // }, []);

  return null;
};

export default AuthManager;
