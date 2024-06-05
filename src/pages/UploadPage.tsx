import React, { useState } from "react";
import { useFileContext } from "@/hooks/useFileContext";
import { FileUploader } from "@/components/ui/FileUploader";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useResetError } from "@/hooks/useResetError";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { state } = useFileContext();
  const { uploadFile } = useUploadFile();
  useResetError();

  const handleFileUpload = async () => {
    if (file) {
      await uploadFile(file);
      setFile(null); // Clear the file after upload
    }
  };

  return (
    <div>
      <h1>Upload File Page</h1>
      <FileUploader
        file={file}
        onFileChange={setFile}
        onFileUpload={handleFileUpload}
        isLoading={state.isLoading}
        error={state.error}
      />
    </div>
  );
};

export default UploadPage;
