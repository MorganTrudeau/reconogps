import { createContext } from "react";

export type FormContextType = {
  setSaveButton: (
    formId: string,
    onSave: (() => void) | undefined,
    loading: boolean
  ) => void;
};

export const FormContext = createContext<FormContextType>({
  setSaveButton: () => {},
});
