import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";
import AboutUs from "./AboutUs";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import RapportAudit from "./RapportAudit";
import Alertes from "./Alertes";
import Audits from "./Audits";
import ConfigurationRoaming from "./ConfigurationRoaming";
import RoamingPartners from './RoamingPartners';
import SituationGlobale from './SituationGlobale';
import NetworkNodes from "./NetworkNodes";
import HelpCenter from "./HelpCenter";
import MssEricsson from './MssEricsson';
import MssHuawei from './MssHuawei';
import RoamingTests from './RoamingTests';
import InboundRoamingResults from './pages/InboundRoamingResults';
import OutboundRoamingResults from './pages/OutboundRoamingResults';
import CamelInboundResults from './pages/CamelInboundResults';
import CamelOutboundResults from './pages/CamelOutboundResults';
import DataInboundResults from './pages/DataInboundResults';
import HssPage from './HssPage';
import FirewallIPs from './FirewallIps';
import MmeImsi from './MmeImsi';
import IR21Page from './IR21Page';
import HlrPage from "./HLR";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <nav className="bg-white shadow-md w-full">
          <div className="max-w-full mx-auto px-8 py-4 flex justify-between items-center">
            <div>
              <Link to="/">
                <img
                  src="/Mobilis_(Algeria)-Logo.png.svg"
                  alt="Mobilis Logo"
                  className="h-10"
                />
              </Link>
            </div>
            <div className="space-x-8">
              <Link to="/" className="text-green-600 font-semibold hover:text-green-800">
                Accueil
              </Link>
              <Link to="/dashboard" className="text-green-600 font-semibold hover:text-green-800">
                Dashboard
              </Link>
              <Link to="/rapportaudit" className="text-green-600 font-semibold hover:text-green-800">
                Rapport Audit
              </Link>
              
              <Link to="/alertes" className="text-green-600 font-semibold hover:text-green-800">
                Alertes
              </Link>
             
              <Link to="/contact" className="text-green-600 font-semibold hover:text-green-800">
                Contact
              </Link>
              <Link to="/aboutus" className="text-green-600 font-semibold hover:text-green-800">
                About Us
              </Link>
            </div>
            <div className="space-x-4">
              <Link to="/login" className="px-4 py-2 border border-green-600 text-red-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rapportaudit" element={<RapportAudit />} />
            <Route path="/alertes" element={<Alertes />} />
            <Route path="/audits" element={<Audits />} />
            <Route path="/partners" element={<RoamingPartners />} />
            <Route path="/roaming" element={<ConfigurationRoaming />} />
            <Route path="/situation-globale" element={<SituationGlobale />} />
            <Route path="/network-nodes" element={<NetworkNodes />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/mss-ericsson" element={<MssEricsson />} />
            <Route path="/firewall-ips" element={<FirewallIPs />} />
            <Route path="/firewall" element={<FirewallIPs />} />
            <Route path="/roaming-tests" element={<RoamingTests />} />
            <Route path="/ir21" element={<IR21Page />} />
            <Route path="/inbound-roaming-results" element={<InboundRoamingResults />} />
            <Route path="/outbound-roaming-results" element={<OutboundRoamingResults />} />
            <Route path="/camel-inbound-results" element={<CamelInboundResults />} />
            <Route path="/mss-huawei" element={<MssHuawei />} />
            <Route path="/camel-outbound-results" element={<CamelOutboundResults />} />
            <Route path="/data-inbound-results" element={<DataInboundResults />} />
            <Route path="/hss" element={<HssPage />} />
            <Route path="/mme-imsi" element={<MmeImsi />} />
            <Route path="/mme" element={<MmeImsi />} />
            <Route path="/hlrr" element={<HlrPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
