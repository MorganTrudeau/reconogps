import { Portal } from "@gorhom/portal";
import React, { createContext, useEffect, useRef, useState } from "react";
import Toast from "../components/Toast";

export const ToastContext = createContext({ show: (text: string) => {} });

const initialState = { visible: false, text: "" };

type Props = { children: React.ReactNode };

const ToastProvider = ({ children }: Props) => {
  const [state, setState] = useState(initialState);
  const { visible, text } = state;

  const toastTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      toastTimeout.current && clearTimeout(toastTimeout.current);
    };
  }, []);

  const show = (_text: string) => {
    if (_text !== text || !visible) {
      setState({ text: _text, visible: true });
    }
    toastTimeout.current && clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(hide, 3000);
  };

  const hide = () => {
    setState((s) => ({ ...s, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Toast {...{ visible, text }} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
