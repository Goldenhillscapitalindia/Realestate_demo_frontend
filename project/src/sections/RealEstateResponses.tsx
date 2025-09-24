// src/components/RealEstateResponses.tsx
import React, { useState } from "react";
import { Block } from "../Realestate_components/Utils/RComponentsUtils";
import RRenderer from "../Realestate_components/RRenderer";
import { useTheme } from "../sections/ThemeContext";

type FileType = "memorandum" | "t12" | "rent_roll";

interface Props {
  responses: Record<FileType, Block[]>;
  onBack: () => void;
}

const TAB_LABELS: Record<FileType, string> = {
  memorandum: "Memorandum",
  t12: "T12",
  rent_roll: "Rent Roll",
};

const RealEstateResponses: React.FC<Props> = ({ responses, onBack }) => {
  const { theme } = useTheme();
  const availableTabs = (Object.keys(responses) as FileType[]).filter(
    (key) => responses[key].length > 0
  );

  const [activeTab, setActiveTab] = useState<FileType>(availableTabs[0]);

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className={`fixed top-4 left-4 px-4 py-2 rounded-lg shadow-md z-50 ${
          theme === "dark"
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-gray-200 text-black hover:bg-gray-300"
        }`}
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? theme === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div>
          <h2
            className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {TAB_LABELS[activeTab]} Response
          </h2>
          <RRenderer blocks={responses[activeTab]} />
        </div>
      </div>
    </div>
  );
};

export default RealEstateResponses;
