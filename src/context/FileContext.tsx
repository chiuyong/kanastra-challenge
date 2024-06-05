import React, { createContext, useReducer } from "react";
import { FileContextType, FileProviderProps } from "@/types";
import { fileReducer, initialState } from "@/reducers/fileReducer";

const FileContext = createContext<FileContextType | undefined>(undefined);

const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(fileReducer, initialState);

  return (
    <FileContext.Provider value={{ state, dispatch }}>
      {children}
    </FileContext.Provider>
  );
};

export { FileProvider, FileContext };
