import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useFileContext } from "@/hooks/useFileContext";
import { useFetchFiles } from "@/hooks/useFetchFiles";
import { useResetError } from "@/hooks/useResetError";

const FileListPage = () => {
  const { state } = useFileContext();
  const { fetchFiles } = useFetchFiles();
  useResetError();

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div>
      <h2>List Files Page</h2>
      {state.isLoading && <p>Loading...</p>}
      {state.error && <p className="text-red-500">{state.error}</p>}
      {!state.isLoading && !state.error && state.fileList.length === 0 && (
        <p>No files available</p>
      )}
      {!state.isLoading && !state.error && state.fileList.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.fileList.map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{file.size} bytes</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default FileListPage;
