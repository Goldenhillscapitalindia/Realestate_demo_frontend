// src/components/PdfUploader.tsx
import React, { useState } from "react";
import axios from "axios";

const S1PdfUpload: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    formData.append("file", file); // assuming your backend expects "file"

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/gid_ai_summary/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Upload successful!");
      console.log("Response:", res.data);
    } catch (error: any) {
      console.error(error);
      setMessage("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold mb-4">Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default S1PdfUpload;
