import React, { useState } from "react";
import axios from "axios";
// import GENAIRenderer from "../Components/GENAIRenderer";
import GENAIRenderer from '../Components/GENAIRenderer';
import  { Block } from '../Components/Utils/ComponentsUtils'
const RealEstateDemo: React.FC = () => {
  const [mode, setMode] = useState<"general" | "gid">("general");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ API base URL from env
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse([]);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/api/realestate_ai/`, {
        question,
        mode,
      });

      // ✅ Expecting array of blocks from backend
      setResponse(res.data?.answer || []);
    } catch (err) {
      console.error(err);
      setError("Error fetching response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-12 px-6">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Real Estate Demo
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          {["general", "gid"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as "general" | "gid")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                mode === m
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m === "gid" ? "GID" : "General"}
            </button>
          ))}
        </div>

        {/* Prompt Section */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your real estate question..."
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 mb-4"
          rows={4}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {/* Response Section */}
        <div className="mt-6">
          {loading && <p className="text-gray-500 italic">Loading response...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && response.length > 0 && (
            <GENAIRenderer
              blocks={response}
              setQuestion={setQuestion}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RealEstateDemo;
