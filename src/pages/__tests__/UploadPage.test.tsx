import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FileProvider } from "@/context/FileContext";
import UploadPage from "@/pages/UploadPage";
import { uploadFileService } from "@/services/fileService";

jest.mock("@/services/fileService");

const mockUploadFileService = uploadFileService as jest.MockedFunction<
  typeof uploadFileService
>;

describe("UploadPage", () => {
  beforeEach(() => {
    mockUploadFileService.mockClear();
  });

  test("uploads a file successfully", async () => {
    render(
      <FileProvider>
        <UploadPage />
      </FileProvider>
    );

    const file = new File(["test"], "test.csv", { type: "text/csv" });
    const fileInput = screen.getByLabelText(/choose a file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText(/upload the file/i);
    fireEvent.click(uploadButton);

    await waitFor(() =>
      expect(mockUploadFileService).toHaveBeenCalledWith(file)
    );
  });

  test("displays error message if upload fails", async () => {
    mockUploadFileService.mockRejectedValueOnce(
      new Error("Failed to upload file")
    );

    render(
      <FileProvider>
        <UploadPage />
      </FileProvider>
    );

    const file = new File(["test"], "test.csv", { type: "text/csv" });
    const fileInput = screen.getByLabelText(/choose a file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText(/upload the file/i);
    fireEvent.click(uploadButton);

    await waitFor(() =>
      expect(mockUploadFileService).toHaveBeenCalledWith(file)
    );
    expect(screen.getByText(/failed to upload file/i)).toBeInTheDocument();
  });

  test("displays loading indicator while uploading", async () => {
    render(
      <FileProvider>
        <UploadPage />
      </FileProvider>
    );

    const file = new File(["test"], "test.csv", { type: "text/csv" });
    const fileInput = screen.getByLabelText(/choose a file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText(/upload the file/i);
    fireEvent.click(uploadButton);

    expect(uploadButton).toHaveTextContent(/uploading/i);
    await waitFor(() =>
      expect(mockUploadFileService).toHaveBeenCalledWith(file)
    );
  });
});
