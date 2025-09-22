import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import RealEstateDemo from "./sections/RealEstateDemo";
import S1PdfUpload from "./sections/S1PdfUpload";
import RealEstateUploader from "./sections/RealEstateUploader";
function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page with all sections */}
        <Route path="/" element={<HomePage />} />

        {/* Real Estate Demo Page */}
        <Route path="/real-estate" element={<RealEstateDemo />} />
        <Route path="/s1document" element={<S1PdfUpload />} />
        <Route path="/realestatepdfupload" element={<RealEstateUploader />} />
      </Routes>
    </Router>
  );
}

export default App;
