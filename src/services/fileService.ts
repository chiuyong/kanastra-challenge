import axios, { AxiosError } from "axios";

// Type guard para verificar se o erro é um AxiosError
const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

// Type guard para verificar se um objeto tem uma propriedade message
const hasMessageProperty = (data: unknown): data is { message: string } => {
  return data !== null && typeof data === "object" && "message" in data;
};

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return hasMessageProperty(error.response?.data)
      ? error.response?.data.message
      : error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "An unexpected error occurred";
  }
};

export const uploadFileService = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("/api/upload", formData);
    if (response.status !== 200) {
      throw new Error("Failed to upload file");
    }
  } catch (error: unknown) {
    throw new Error("Failed to upload file: " + getErrorMessage(error));
  }
};

export const fetchFilesService = async (): Promise<File[]> => {
  try {
    const response = await axios.get("/api/files");
    if (response.status !== 200) {
      throw new Error("Failed to fetch files");
    }
    return response.data.files;
  } catch (error: unknown) {
    throw new Error("Failed to fetch files: " + getErrorMessage(error));
  }
};
