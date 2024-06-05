import { FileContextState, FileAction, FileActionType } from "@/types";

export const initialState: FileContextState = {
  isLoading: false,
  file: null,
  fileList: [],
  error: null,
};

export const fileReducer = (
  state: FileContextState,
  action: FileAction
): FileContextState => {
  switch (action.type) {
    case FileActionType.UPLOAD_FILE:
      return {
        ...state,
        file: action.payload?.file || null, // Atualiza o estado file
        fileList: [...state.fileList, action.payload?.file as File], // Insere na lista de arquivos
      };
    case FileActionType.SET_FILES:
      return {
        ...state,
        file: null,
        fileList: action.payload?.fileList || [],
      };
    case FileActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload?.isLoading || false,
      };
    case FileActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload?.error || null,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
