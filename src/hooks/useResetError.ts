import { useEffect } from "react";
import { useFileContext } from "./useFileContext";
import { FileActionType } from "@/types";

const useResetError = () => {
  const { dispatch } = useFileContext();

  useEffect(() => {
    return () => {
      dispatch({ type: FileActionType.SET_ERROR, payload: { error: null } });
    };
  }, [dispatch]);
};

export { useResetError };
