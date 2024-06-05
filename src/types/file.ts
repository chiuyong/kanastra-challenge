import { ReactNode } from "react";

enum FileActionType {
  UPLOAD_FILE = "UPLOAD_FILE",
  SET_FILES = "SET_FILES",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
}

type ReducerAction<T, P> = {
  type: T;
  payload?: Partial<P>;
};

type FileContextState = {
  isLoading: boolean;
  file: File | null;
  fileList: File[]; // & {} You can add more information about the challenge inside this type
  error: string | null;
};

type FileAction = ReducerAction<FileActionType, Partial<FileContextState>>;

type FileDispatch = ({ type, payload }: FileAction) => void;

type FileContextType = {
  state: FileContextState;
  dispatch: FileDispatch;
};

type FileProviderProps = { children: ReactNode };

export { FileActionType };

export type {
  FileContextState,
  FileAction,
  FileDispatch,
  FileContextType,
  FileProviderProps,
};
