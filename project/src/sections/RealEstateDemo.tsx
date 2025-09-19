import React, { useState } from "react";
import axios from "axios";
import GENAIRenderer from '../Components/GENAIRenderer';
import { Block } from '../Components/Utils/ComponentsUtils'

const RealEstateDemo: React.FC = () => {
  const [mode, setMode] = useState<"general" | "gid">("general");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse([]);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/api/gid_ai_summary/`, {
        question,
        mode,
      });

      setResponse(res.data?.answer || []);
    } catch (err) {
      console.error(err);
      setError("Error fetching response");
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (selectedMode: "general" | "gid") => {
    setMode(selectedMode);
    setResponse([]);
    setError(null);
    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-6">
      <div className="max-w-7xl w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Real Estate Demo
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-3 mb-6">
          {["general", "gid"].map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m as "general" | "gid")}
              className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m === "gid" ? "GID" : "General"}
            </button>
          ))}
        </div>

        {/* Prompt Section */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question..."
            className="flex-1 p-3 border border-blue-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !question.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
</div>
   
{/* Response Section */}
<div className="mt-6 w-full flex flex-col items-center gap-4">
  {loading && <p className="text-gray-500 italic">Loading response...</p>}
  {error && <p className="text-red-500">{error}</p>}

  {!loading && response.length > 0 && (
    <div className="w-full max-w-7xl bg-white shadow-lg rounded-xl p-6">
      <GENAIRenderer
        blocks={response}
        setQuestion={setQuestion}
        handleSubmit={handleSubmit}
      />
    </div>
  )}
</div>

    </div>
  );
};

export default RealEstateDemo;
