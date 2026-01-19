import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import RealEstateDemo from "./sections/RealEstateDemo";
import S1PdfUpload from "./sections/S1PdfUpload";
import RealEstateUploader from "./sections/RealEstateUploader";
import MarketRadar from "./sections/MarketRadar";

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
        <Route path="/market_radar" element={<MarketRadar />} />

      </Routes>
    </Router>
  );
}

export default App;
