// src/components/S1PdfUpload.tsx
import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import S1DealSummary from "./S1DealData";

/**
 * S1PdfUpload
 * - Purpose-built UI for uploading SEC IPO documents (S-1/F-1/424B).
 * - Drag & drop, file validation, progress, and success/error states.
 * - Hits your backend endpoint: POST {API_URL}/api/gid_ai_summary/
 */

type Stage = "idle" | "ready" | "uploading" | "success" | "error";

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const S1PdfUpload: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [message, setMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [responseData, setResponseData] = useState<any>(null);

  const openPicker = () => inputRef.current?.click();

  const resetAll = () => {
    setFile(null);
    setStage("idle");
    setMessage("");
    setProgress(0);
    setResponseData(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validateFile = (f: File): string | null => {
    if (f.type !== "application/pdf") return "Only PDF files are allowed.";
    if (f.size > MAX_SIZE_BYTES)
      return `File too large. Max size is ${formatBytes(MAX_SIZE_BYTES)}.`;
    return null;
  };

  const handleFileSelect = (f: File | null) => {
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setMessage(err);
      setStage("idle");
      setFile(null);
      return;
    }
    setFile(f);
    setMessage("");
    setStage("ready");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFileSelect(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFileSelect(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setStage("uploading");
      setMessage("");
      setProgress(0);

      const res = await axios.post(
        `${API_URL}/api/document_data_extraction/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            const percent = Math.round((evt.loaded * 100) / evt.total);
            setProgress(percent);
          },
        }
      );

      setResponseData(res.data);
      setStage("success");
      setMessage("Uploaded and queued for extraction.");
      // If you want to navigate with data:
      // navigate("/ipo/s1/summary", { state: { data: res.data } });
    } catch (err: any) {
      console.error(err);
      setStage("error");
      setMessage(
        err?.response?.data?.detail ||
          "Upload failed. Please try again or contact support."
      );
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => navigate("/", { state: { scrollTo: "demos" } })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <span aria-hidden>←</span> Back
          </button>
          <div className="ml-2 text-sm text-slate-500">
            IPO Docs &nbsp;•&nbsp; SEC S-1 / F-1 / 424B
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Upload SEC Filing (S-1 / F-1 / 424B)
          </h1>
          <p className="mt-2 text-slate-600">
            Drop the original SEC PDF. We’ll send it to our extractor
            (LlamaCloud) and return a structured summary for your IPO analysis.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["S-1", "F-1", "424B", "Prospectus"].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {chip}
              </span>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Steps / Context */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-800">
                How it works
              </h2>
              <ol className="mt-3 space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-slate-300 text-xs flex items-center justify-center">
                    1
                  </span>
                  Upload the original SEC PDF (no scans if possible).
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-slate-300 text-xs flex items-center justify-center">
                    2
                  </span>
                  We send it to LlamaCloud for high-quality text extraction.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-slate-300 text-xs flex items-center justify-center">
                    3
                  </span>
                  You’ll get back a structured summary ready for your IPO model.
                </li>
              </ol>

              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                <strong className="text-slate-700">Privacy note:</strong> Files
                are processed for extraction, not stored long-term. Avoid
                drafts/PII.
              </div>

              <div className="mt-5 text-xs text-slate-500">
                Max file size: {formatBytes(MAX_SIZE_BYTES)} • PDF only
              </div>
            </div>
          </aside>

          {/* Right: Uploader */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
              {/* Dropzone */}
              <div
                role="button"
                tabIndex={0}
                onClick={openPicker}
                onKeyDown={(e) =>
                  e.key === "Enter" || e.key === " " ? openPicker() : null
                }
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={[
                  "w-full rounded-xl border-2 border-dashed transition",
                  "p-8 text-center cursor-pointer",
                  stage === "ready"
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-300 hover:border-blue-400 hover:bg-blue-50",
                ].join(" ")}
              >
                {file ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-left">
                      {/* PDF Icon */}
                      <div className="flex h-12 w-10 items-center justify-center rounded-md bg-red-50 border border-red-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-6 w-6 text-red-600"
                          aria-hidden
                        >
                          <path
                            fill="currentColor"
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 2l6 6h-6z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">
                          {file.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatBytes(file.size)} • application/pdf
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetAll();
                        }}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                      >
                        <path d="M4 16v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
                        <path d="M12 12v9" />
                        <path d="m16 16-4-4-4 4" />
                        <path d="M20 12V7a2 2 0 0 0-2-2h-3" />
                        <path d="M4 12V7a2 2 0 0 1 2-2h3" />
                      </svg>
                    </div>
                    <p className="mt-3 text-slate-700 font-medium">
                      Drag & drop SEC PDF here
                    </p>
                    <p className="text-sm text-slate-500">
                      or <span className="underline">click to browse</span>
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      S-1, F-1, 424B — original digital PDFs work best.
                    </p>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="text-sm text-slate-500">
                  {message && (
                    <span
                      className={
                        stage === "error"
                          ? "text-red-600 font-medium"
                          : stage === "success"
                          ? "text-emerald-600 font-medium"
                          : "text-slate-600"
                      }
                    >
                      {message}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={resetAll}
                    disabled={
                      stage === "uploading" || (!file && stage === "idle")
                    }
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!file || stage === "uploading"}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {stage === "uploading" ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                          />
                        </svg>
                        Uploading…
                      </>
                    ) : (
                      <>
                        <span>Submit for Extraction</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {stage === "uploading" && (
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-2 bg-blue-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Uploading… {progress}%
                  </div>
                </div>
              )}

              {/* Success Panel */}
              {stage === "success" && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-emerald-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-800">
                        Extraction Done
                      </div>
                      <p className="mt-1 text-sm text-emerald-700">
                        Your document was accepted. The document is parsed the
                        filing and return a structured summary (company
                        overview, offering details, risk factors, proceeds, use
                        of funds, etc.).
                      </p>
                      {/* Optional peek into response */}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Panel */}
              {stage === "error" && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden
                      >
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-red-800">
                        Something went wrong
                      </div>
                      <p className="mt-1 text-sm text-red-700">{message}</p>
                      <div className="mt-3">
                        <button
                          onClick={resetAll}
                          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary: Tips */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">
                Pro tips for best extraction
              </h3>
              <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-600 md:grid-cols-2">
                <li>
                  Prefer the official SEC PDF (EDGAR) over third-party scans.
                </li>
                <li>Avoid password-protected PDFs.</li>
                <li>
                  Keep file names concise (e.g., <em>Company_S1_2025.pdf</em>).
                </li>
                <li>
                  Double-check that the PDF opens correctly on your system.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      {stage === "success" && responseData?.data && (
        <div className="mt-10">
          <S1DealSummary data={responseData.data} />
        </div>
      )}
    </div>
  );
};

export default S1PdfUpload;
