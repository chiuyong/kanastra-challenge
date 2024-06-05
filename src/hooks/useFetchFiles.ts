import { useCallback } from "react";
import { useFileContext } from "./useFileContext";
import { fetchFilesService } from "@/services/fileService";
import { FileActionType } from "@/types";

export const useFetchFiles = () => {
  const { dispatch } = useFileContext();

  const fetchFiles = useCallback(async () => {
    dispatch({
      type: FileActionType.SET_LOADING,
      payload: { isLoading: true },
    });
    try {
      const fileList = await fetchFilesService();
      dispatch({ type: FileActionType.SET_FILES, payload: { fileList } });
    } catch (error) {
      dispatch({
        type: FileActionType.SET_ERROR,
        payload: { error: (error as Error).message },
      });
    } finally {
      dispatch({
        type: FileActionType.SET_LOADING,
        payload: { isLoading: false },
      });
    }
  }, [dispatch]);

  return { fetchFiles };
};
