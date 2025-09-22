// src/components/S1PdfUpload.tsx
import React, { useState, useRef } from "react";
import axios from "axios";

const S1PdfUpload: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/gid_ai_summary/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Upload successful!");
      console.log("Response:", res.data);
      setFile(null);
    } catch (error: any) {
      console.error(error);
      setMessage("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setMessage("");
      } else {
        setMessage("Only PDF files are allowed.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Upload PDF
        </h2>

        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            file ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <p className="text-green-700 font-medium">{file.name}</p>
          ) : (
            <p className="text-gray-500">Drag & drop your PDF here, or click to select</p>
          )}
        </div>

        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="mt-6 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>

        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("failed") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default S1PdfUpload;
