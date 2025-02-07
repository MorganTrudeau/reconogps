import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "../context/FormContext";

export const useForm = (
  formId: string,
  data: Object,
  onSave: () => Promise<any>,
  onError: (error: unknown) => void
) => {
  const formContext = useContext(FormContext);

  const [loading, setLoading] = useState(false);

  const dataRef = useRef(data);
  const [dataChanged, setDataChanged] = useState(false);
  const hasChanged = useRef(false);
  useEffect(() => {
    if (
      !hasChanged.current &&
      JSON.stringify(dataRef.current) !== JSON.stringify(data)
    ) {
      hasChanged.current = true;
      setDataChanged(true);
    }
  }, [data]);

  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);
  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      await onSaveRef.current();
      hasChanged.current = false
      setDataChanged(false);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    formContext.setSaveButton(
      formId,
      dataChanged ? handleSave : undefined,
      loading
    );
  }, [formId, handleSave, loading, dataChanged]);
};
