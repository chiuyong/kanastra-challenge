import { render, screen, waitFor } from "@testing-library/react";
import { FileProvider } from "@/context/FileContext";
import FileListPage from "@/pages/FileListPage";
import { fetchFilesService } from "@/services/fileService";

jest.mock("@/services/fileService", () => ({
  fetchFilesService: jest.fn(),
}));

const mockFetchFilesService = fetchFilesService as jest.MockedFunction<
  typeof fetchFilesService
>;

describe("FileListPage", () => {
  const mockFiles = [
    { name: "file1.csv", type: "text/csv", size: 100 } as File,
    {
      name: "file2.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 200,
    } as File,
    { name: "file3.xls", type: "application/vnd.ms-excel", size: 300 } as File,
    { name: "file1.csv", type: "text/csv", size: 100 } as File,
    {
      name: "file4.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 400,
    } as File,
  ];

  beforeEach(() => {
    mockFetchFilesService.mockClear();
  });

  test("fetches and displays files on mount", async () => {
    mockFetchFilesService.mockResolvedValueOnce(mockFiles);

    render(
      <FileProvider>
        <FileListPage />
      </FileProvider>
    );

    // Verifique que a mensagem de loading é exibida inicialmente
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Aguarde até que a chamada de fetch seja feita e os elementos sejam renderizados
    await waitFor(() => expect(mockFetchFilesService).toHaveBeenCalledTimes(1));

    // Verifique que cada arquivo é exibido corretamente
    mockFiles.forEach((file) => {
      const nameElements = screen.getAllByText(file.name);
      const typeElements = screen.getAllByText(file.type);
      const sizeElements = screen.getAllByText(`${file.size} bytes`);

      // Certifique-se de que há pelo menos um elemento correspondente
      expect(nameElements.length).toBeGreaterThan(0);
      expect(typeElements.length).toBeGreaterThan(0);
      expect(sizeElements.length).toBeGreaterThan(0);

      // Verifique que cada elemento específico está no documento
      nameElements.forEach((element) => expect(element).toBeInTheDocument());
      typeElements.forEach((element) => expect(element).toBeInTheDocument());
      sizeElements.forEach((element) => expect(element).toBeInTheDocument());
    });

    // Verifique que todos os tipos de arquivos são exibidos corretamente
    const csvFiles = screen.getAllByText("text/csv");
    const xlsxFiles = screen.getAllByText(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const xlsFiles = screen.getAllByText("application/vnd.ms-excel");

    expect(csvFiles).toHaveLength(2);
    expect(xlsxFiles).toHaveLength(2);
    expect(xlsFiles).toHaveLength(1);
  });

  test("displays error message if fetching files fails", async () => {
    mockFetchFilesService.mockRejectedValueOnce(
      new Error("Failed to fetch files")
    );

    render(
      <FileProvider>
        <FileListPage />
      </FileProvider>
    );

    await waitFor(() => expect(mockFetchFilesService).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/failed to fetch files/i)).toBeInTheDocument();
  });

  test("displays no files message when file list is empty", async () => {
    mockFetchFilesService.mockResolvedValueOnce([]);

    render(
      <FileProvider>
        <FileListPage />
      </FileProvider>
    );

    await waitFor(() => expect(mockFetchFilesService).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/no files available/i)).toBeInTheDocument();
  });
});
