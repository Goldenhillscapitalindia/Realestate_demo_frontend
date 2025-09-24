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
      className={`min-h-screen transition-colors`}
      style={{ backgroundColor: theme === "dark" ? "#09151A" : "#F5F5F5" }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 px-4 py-2 rounded-lg shadow-md z-50 transition-transform hover:scale-105"
        style={{
          backgroundColor: theme === "dark" ? "#102330" : "#E5E5E5",
          color: theme === "dark" ? "#E0F7FA" : "#000",
        }}
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg font-semibold transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "#1B4F72"
                    : theme === "dark"
                    ? "#102330"
                    : "#E5E5E5",
                  color: isActive ? "#E0F7FA" : theme === "dark" ? "#A0CFE8" : "#333",
                }}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: "#0d1d29" }} // response background
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#E0F7FA" }}>
            {TAB_LABELS[activeTab]} Response
          </h2>
          <RRenderer blocks={responses[activeTab]} />
        </div>
      </div>
    </div>
  );
};

export default RealEstateResponses;
