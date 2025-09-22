// src/components/RealEstateUploader.tsx
import React, { useState, useRef } from "react";
import axios from "axios";

const RealEstateUploader: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const newFiles = Array.from(e.target.files).filter(file =>
      ["application/pdf", 
       "application/vnd.ms-excel", 
       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type)
    );

    // Append new files, avoid duplicates by name
    const allFiles = [...files];
    newFiles.forEach(file => {
      if (!allFiles.some(f => f.name === file.name)) {
        allFiles.push(file);
      }
    });

    setFiles(allFiles);
    setUploadStatus(allFiles.map(() => "")); // reset status
  }
};

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/gid_ai_summary/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus(files.map(() => "Upload successful!"));
      console.log("Response:", res.data);
    } catch (error) {
      console.error(error);
      setUploadStatus(files.map(() => "Upload failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
        ["application/pdf", 
         "application/vnd.ms-excel", 
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type)
      );
      setFiles(droppedFiles);
      setUploadStatus(droppedFiles.map(() => ""));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Upload Real Estate Files
        </h2>

        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            files.length ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
        >
          {files.length ? (
            <p className="text-green-700 font-medium">{files.length} file(s) selected</p>
          ) : (
            <p className="text-gray-500">Drag & drop PDFs or Excel files here, or click to select</p>
          )}
        </div>

        <input
          type="file"
          accept=".pdf, .xls, .xlsx"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />

        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? "Uploading..." : "Upload All"}
        </button>

        <div className="mt-4">
          {files.map((file, idx) => (
            <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100">
              <span>{file.name}</span>
              <span className={`text-sm font-medium ${
                uploadStatus[idx].includes("failed") ? "text-red-500" : "text-green-600"
              }`}>{uploadStatus[idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealEstateUploader;
