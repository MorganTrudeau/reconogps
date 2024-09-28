import { FC, createContext } from "react";

export const FormContext = createContext<{
  setSaveButton: (button: FC<any> | undefined, formId: string) => void;
}>({ setSaveButton: () => {} });
