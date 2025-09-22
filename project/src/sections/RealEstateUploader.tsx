// src/components/RealEstateUploader.tsx
import React, { useState } from "react";
import axios from "axios";

const RealEstateUploader: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string[]>([]); // status per file
  const [loading, setLoading] = useState(false);

  // Accept multiple files (PDF, Excel)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(file =>
        ["application/pdf", 
         "application/vnd.ms-excel", 
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type)
      );

      setFiles(validFiles);
      setUploadStatus(validFiles.map(() => "")); // reset status
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one PDF or Excel file.");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("files", file)); // backend should accept 'files' array

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/gid_ai_summary/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // You can customize how you set status based on backend response
      setUploadStatus(files.map(() => "Upload successful!"));
      console.log("Response:", res.data);
    } catch (error) {
      console.error(error);
      setUploadStatus(files.map(() => "Upload failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold mb-4">Upload Real Estate Files</h2>
      <input
        type="file"
        accept=".pdf, .xls, .xlsx"
        multiple
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload All"}
      </button>

      <div className="mt-4">
        {files.map((file, idx) => (
          <div key={idx} className="flex justify-between items-center py-1">
            <span>{file.name}</span>
            <span className="text-sm text-gray-600">{uploadStatus[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealEstateUploader;
