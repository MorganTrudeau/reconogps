import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "../context/FormContext";

export const useForm = (
  formId: string,
  complete: boolean,
  onSave: () => Promise<any>,
  onError?: (error: unknown) => void
) => {
  const formContext = useContext(FormContext);

  const [loading, setLoading] = useState(false);

  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);
  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      await onSaveRef.current();
    } catch (error) {
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    formContext.setSaveButton(
      formId,
      complete ? handleSave : undefined,
      loading
    );
  }, [formId, handleSave, loading, complete]);
};
