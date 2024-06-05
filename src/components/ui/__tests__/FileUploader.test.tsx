import { render, screen, fireEvent } from "@testing-library/react";
import { FileUploader } from "@/components/ui/FileUploader";

describe("FileUploader", () => {
  const mockOnFileChange = jest.fn();
  const mockOnFileUpload = jest.fn();

  beforeEach(() => {
    mockOnFileChange.mockClear();
    mockOnFileUpload.mockClear();
  });

  test("renders file input", () => {
    render(
      <FileUploader
        file={null}
        onFileChange={mockOnFileChange}
        onFileUpload={mockOnFileUpload}
        isLoading={false}
        error={null}
      />
    );

    const fileInput = screen.getByLabelText(/choose a file/i);
    expect(fileInput).toBeInTheDocument();
  });

  test("calls onFileChange when file is selected", () => {
    render(
      <FileUploader
        file={null}
        onFileChange={mockOnFileChange}
        onFileUpload={mockOnFileUpload}
        isLoading={false}
        error={null}
      />
    );

    const fileInput = screen.getByLabelText(/choose a file/i);
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockOnFileChange).toHaveBeenCalledWith(file);
  });

  test("displays file details when a file is selected", () => {
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    render(
      <FileUploader
        file={file}
        onFileChange={mockOnFileChange}
        onFileUpload={mockOnFileUpload}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText(/file details/i)).toBeInTheDocument();
    expect(screen.getByText(/name: test.csv/i)).toBeInTheDocument();
    expect(screen.getByText(/type: text\/csv/i)).toBeInTheDocument();
    expect(screen.getByText(/size: 4 bytes/i)).toBeInTheDocument();
  });

  test("calls onFileUpload when upload button is clicked", () => {
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    render(
      <FileUploader
        file={file}
        onFileChange={mockOnFileChange}
        onFileUpload={mockOnFileUpload}
        isLoading={false}
        error={null}
      />
    );

    const uploadButton = screen.getByText(/upload the file/i);
    fireEvent.click(uploadButton);
    expect(mockOnFileUpload).toHaveBeenCalled();
  });

  test("does not display upload button when no file is selected", () => {
    render(
      <FileUploader
        file={null}
        onFileChange={mockOnFileChange}
        onFileUpload={mockOnFileUpload}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.queryByText(/upload the file/i)).not.toBeInTheDocument();
  });

  test("displays error message when error is present", () => {
    render(
      <FileUploader
        file={null}
        onFileChange={mockOnFileChange}
        onFileUpload={mockOnFileUpload}
        isLoading={false}
        error="Some error occurred"
      />
    );

    expect(screen.getByText(/some error occurred/i)).toBeInTheDocument();
  });

  test("alerts when non-spreadsheet file is selected", () => {
    window.alert = jest.fn();

    render(
      <FileUploader
        file={null}
        onFileChange={mockOnFileChange}
        onFileUpload={mockOnFileUpload}
        isLoading={false}
        error={null}
      />
    );

    const fileInput = screen.getByLabelText(/choose a file/i);
    const file = new File(["test"], "test.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockOnFileChange).toHaveBeenCalledWith(null);
    expect(window.alert).toHaveBeenCalledWith(
      "Please upload XLS, XLSX or CSV file."
    );
  });
});
