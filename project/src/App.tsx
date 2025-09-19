import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import RealEstateDemo from "./sections/RealEstateDemo";
function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page with all sections */}
        <Route path="/" element={<HomePage />} />

        {/* Real Estate Demo Page */}
        <Route path="/real-estate" element={<RealEstateDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
