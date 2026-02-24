import React, { useState } from "react";
import axios from "axios";
import GENAIRenderer from '../Components/GENAIRenderer';
import { Block } from '../Components/Utils/ComponentsUtils';
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import AIThinkingLoader from "../Components/AIThinkingLoader";
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
  const handleSuggestionClick = (question: string) => {
    if (mode === "general") {
      setGeneralResponse([]); // clear previous response
      setGeneralQuestion(question); // set the clicked question
    } else {
      setGidResponse([]); // clear previous response
      setGidQuestion(question); // set the clicked question
    }

    handleSubmit(question);
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
      {/* <div className="w-full max-w-7xl mb-6"> */}
      {/* Back Button (fixed top-left) */}
      <button
        onClick={() => navigate("/", { state: { scrollTo: "demos" } })}
        className="fixed top-4 left-4 bg-blue-200 text-black px-4 py-2 rounded-lg 
             hover:bg-blue-900 hover:text-white transition-colors shadow-md z-50"
      >
        ← Back
      </button>


      {/* </div> */}

      <div className="max-w-7xl w-full bg-blue rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {mode === "general" ? "Global Assistant" : "GID Assistant"}
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-3 mb-6">
          {["general", "gid"].map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m as "general" | "gid")}
              className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${mode === m
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {m === "gid" ? "GID" : "General"}
            </button>
          ))}
        </div>

        {/* Prompt Section */}
        <div className="flex items-center gap-2 mb-4 bg">
          <input
            type="text"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            placeholder="Ask your question..."
            className="flex-1 p-3 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            style={{
              backgroundColor: "#f8faff", // 👈 light blue-gray background
              border: "1px solid #dbeafe", // soft blue border
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && currentQuestion.trim()) {
                if (mode === "general") setGeneralResponse([]);
                else setGidResponse([]);
                handleSubmit();
              }
            }}
          />

          <button
            onClick={() => {
              if (!currentQuestion.trim()) return;

              // Clear previous response
              if (mode === "general") setGeneralResponse([]);
              else setGidResponse([]);

              handleSubmit();
            }}
            disabled={currentLoading || !currentQuestion.trim()}
            className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {currentLoading ? "..." : "Ask"}
          </button>
        </div>

      </div>

{/* Response Section */}
{currentLoading ? (
  <AIThinkingLoader message="AI is thinking… please hold on" />
) : (
  <>
    {mode === "general" && generalResponse.length > 0 && (
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          width: "70%",
          p: 3,
          borderRadius: 3,
          bgcolor: "#f1f5ff",
        }}
      >
        {generalError && <p className="text-red-500">{generalError}</p>}
        <GENAIRenderer
          blocks={generalResponse}
          setQuestion={setGeneralQuestion}
          handleSubmit={(question?: string) =>
            handleSuggestionClick(question || generalQuestion)
          }
        />
      </Paper>
    )}

    {mode === "gid" && gidResponse.length > 0 && (
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          width: "70%",
          p: 3,
          borderRadius: 3,
          bgcolor: "#f1f5ff",
        }}
      >
        {gidError && <p className="text-red-500">{gidError}</p>}
        <GENAIRenderer
          blocks={gidResponse}
          setQuestion={setGidQuestion}
          handleSubmit={(question?: string) =>
            handleSuggestionClick(question || gidQuestion)
          }
        />
      </Paper>
    )}
  </>
)}


    </div>
  );
};

export default RealEstateDemo;

