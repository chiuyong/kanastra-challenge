import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { NoMatch, Layout } from "@/components/ui";
import { FileProvider } from "@/context/FileContext";
import FileListPage from "@/pages/FileListPage";
import UploadPage from "@/pages/UploadPage";

const App: React.FC = () => {
  return (
    <FileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<FileListPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FileProvider>
  );
};

export default App;
