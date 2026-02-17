import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import RealEstateDemo from "./sections/RealEstateDemo";
import S1PdfUpload from "./sections/S1PdfUpload";
import RealEstateUploader from "./sections/RealEstateUploader";
import MarketRadar from "./sections/MarketRadar";
import MarketRadarView from "./sections/MarketRadarView";
import PfUploads from "./portfolio_intelligence/pf_uploads";
import PfDemo from "./portfolio_intelligence/pf_demo";
import PfPropertyResponse from "./portfolio_intelligence/pf_property_response";

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
        <Route path="/market_radar_view/:sub_market_name" element={<MarketRadarView />} />
        <Route path="/portfolio_intelligence" element={<PfDemo />} />
        <Route path="/portfolio_intelligence/property" element={<PfPropertyResponse />} />

        <Route path="/pf_uploads" element={<PfUploads />} />
        {/* <Route path="/pf_demo" element={<PfDemo />} /> */}


      </Routes>
    </Router>
  );
}

export default App;
