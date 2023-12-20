import { FC, createContext } from "react";

export const FormContext = createContext<{
  setSaveButton: (button: FC<any>, formId: string) => void;
}>({ setSaveButton: () => {} });
