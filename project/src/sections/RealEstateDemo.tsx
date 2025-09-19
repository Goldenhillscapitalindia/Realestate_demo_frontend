import React, { useState } from "react";
import axios from "axios";

const RealEstateDemo: React.FC = () => {
  const [mode, setMode] = useState<"General" | "GID">("General");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post("/api/real-estate", {
        question,
        mode,
      });

      setResponse(res.data?.answer || "No response received.");
    } catch (err) {
      setResponse("Error: Unable to fetch response.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-12 px-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Real Estate Demo
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          {["General", "GID"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as "General" | "GID")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                mode === m
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m}
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
        {response && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-gray-800">
            <strong>Response:</strong>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEstateDemo;
