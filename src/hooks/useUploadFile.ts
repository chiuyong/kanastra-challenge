import { useCallback } from "react";
import { useFileContext } from "./useFileContext";
import { uploadFileService } from "@/services/fileService";
import { FileActionType } from "@/types";

export const useUploadFile = () => {
  const { dispatch } = useFileContext();

  const uploadFile = useCallback(
    async (file: File) => {
      dispatch({
        type: FileActionType.SET_LOADING,
        payload: { isLoading: true },
      });
      try {
        await uploadFileService(file);
        dispatch({ type: FileActionType.UPLOAD_FILE, payload: { file } });
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
    },
    [dispatch]
  );

  return { uploadFile };
};
