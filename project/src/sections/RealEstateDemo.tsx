import React, { useState } from "react";
import axios from "axios";
import GENAIRenderer from '../Components/GENAIRenderer';
import { Block } from '../Components/Utils/ComponentsUtils';
import { useNavigate } from "react-router-dom";

const RealEstateDemo: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [mode, setMode] = useState<"general" | "gid">("general");
  const [generalQuestion, setGeneralQuestion] = useState("");
  const [generalResponse, setGeneralResponse] = useState<Block[]>([]);
  const [generalLoading, setGeneralLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [gidQuestion, setGidQuestion] = useState("");
  const [gidResponse, setGidResponse] = useState<Block[]>([]);
  const [gidLoading, setGidLoading] = useState(false);
  const [gidError, setGidError] = useState<string | null>(null);

  const handleSubmit = async (customQuestion?: string) => {
    const question =
      customQuestion ?? (mode === "general" ? generalQuestion : gidQuestion);
    if (!question.trim()) return;

    if (mode === "general") {
      setGeneralLoading(true);
      setGeneralError(null);
    } else {
      setGidLoading(true);
      setGidError(null);
    }

    try {
      const res = await axios.post(`${API_URL}/api/gid_ai_summary/`, {
        question: question.trim(),
        mode,
      });

      if (mode === "general") setGeneralResponse(res.data?.answer || []);
      else setGidResponse(res.data?.answer || []);
    } catch (err) {
      console.error(err);
      if (mode === "general") setGeneralError("Error fetching response");
      else setGidError("Error fetching response");
    } finally {
      if (mode === "general") setGeneralLoading(false);
      else setGidLoading(false);
    }
  };

  const handleModeChange = (selectedMode: "general" | "gid") => {
    setMode(selectedMode);
  };

  const currentQuestion = mode === "general" ? generalQuestion : gidQuestion;
  const setCurrentQuestion = mode === "general" ? setGeneralQuestion : setGidQuestion;
  const currentResponse = mode === "general" ? generalResponse : gidResponse;
  const currentLoading = mode === "general" ? generalLoading : gidLoading;
  const currentError = mode === "general" ? generalError : gidError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12 px-6">

      {/* Back Button */}
      <div className="w-full max-w-7xl mb-6">
<button
  onClick={() => navigate("/", { state: { scrollTo: "demos" } })}
  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
>
  ← Back to Demo Projects
</button>

      </div>

      <div className="max-w-7xl w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {mode === "general" ? "Global Assistant" : "GID Assistant"}
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
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            placeholder="Ask your question..."
            className="flex-1 p-3 border border-blue-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={currentLoading || !currentQuestion.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {currentLoading ? "..." : "Ask"}
          </button>
        </div>
      </div>

      {/* Response Section */}
      <div className="mt-6 w-full flex flex-col items-center gap-6 max-w-7xl">
        {mode === "general" && generalResponse.length > 0 && (
          <div className="w-full bg-white rounded-xl shadow-md p-6">
            {generalError && <p className="text-red-500">{generalError}</p>}
            {generalLoading && <p className="text-gray-500 italic">Loading response...</p>}
            <GENAIRenderer
              blocks={generalResponse}
              setQuestion={setGeneralQuestion}
              handleSubmit={() => handleSubmit()}
            />
          </div>
        )}

        {mode === "gid" && gidResponse.length > 0 && (
          <div className="w-full bg-white rounded-xl shadow-md p-6">
            {gidError && <p className="text-red-500">{gidError}</p>}
            {gidLoading && <p className="text-gray-500 italic">Loading response...</p>}
            <GENAIRenderer
              blocks={gidResponse}
              setQuestion={setGidQuestion}
              handleSubmit={() => handleSubmit()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEstateDemo;
