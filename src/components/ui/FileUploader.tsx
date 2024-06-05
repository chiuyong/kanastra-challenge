import React, { FormEvent } from "react";

type FileUploaderProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onFileUpload: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};
const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  onFileChange,
  onFileUpload,
  isLoading,
  error,
}) => {
  const isSpreadSheetExcel = (file: File): boolean => {
    return (
      file.name.endsWith(".csv") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".xlsx")
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile && !isSpreadSheetExcel(selectedFile)) {
      event.target.value = "";
      onFileChange(null);
      alert("Please upload XLS, XLSX or CSV file.");
    } else {
      onFileChange(selectedFile);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onFileUpload();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        <input
          id="file"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {file && (
        <section>
          <p className="pb-6">File details:</p>
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}

      {file && (
        <button
          type="submit"
          className="rounded-lg bg-green-800 text-white px-4 py-2 border-none font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload the file"}
        </button>
      )}
    </form>
  );
};

export { FileUploader };
