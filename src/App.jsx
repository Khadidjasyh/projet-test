import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";
import AboutUs from "./AboutUs";
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
import SignIn from './SignIn';
import AdminCreation from './AdminCreation';
import CreateAccount from './CreateAccount';
import Activation from './Activation';
import HlrPage from "./HLR";
import IR85Page from './IR85Page';
import Profile from './Profile';
import AdminPanel from './AdminPanel';

// This component will contain the main layout and logic that needs access to useNavigate
function AppLayout() {
  const [adminExists, setAdminExists] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('/api/auth/check-admin')
      .then(res => res.json())
      .then(data => setAdminExists(data.exists));

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/'); // Redirect to home page
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  if (adminExists === null) return <div>Loading...</div>;

  // Minimal navbar for activation page
  const isActivationPage = /^\/activate\//.test(location.pathname);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="bg-white shadow-md w-full">
        <div className="px-8 py-4 flex justify-between items-center">
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
            {isActivationPage ? (
              <>
                <Link to="/contact" className="text-green-600 font-semibold hover:text-green-800">
                  Contact
                </Link>
                <Link to="/aboutus" className="text-green-600 font-semibold hover:text-green-800">
                  About Us
                </Link>
              </>
            ) : (
              <>
                {currentUser && (
                  <>
                    <Link to="/dashboard" className="text-green-600 font-semibold hover:text-green-800">
                      Dashboard
                    </Link>
                    <Link to="/rapportaudit" className="text-green-600 font-semibold hover:text-green-800">
                      Rapport Audit
                    </Link>
                    <Link to="/alertes" className="text-green-600 font-semibold hover:text-green-800">
                      Alertes
                    </Link>
                  </>
                )}
                <Link to="/contact" className="text-green-600 font-semibold hover:text-green-800">
                  Contact
                </Link>
                <Link to="/aboutus" className="text-green-600 font-semibold hover:text-green-800">
                  About Us
                </Link>
              </>
            )}
          </div>
          <div className="space-x-4">
            {!isActivationPage && (
              currentUser ? (
                <>
                  {currentUser.role === 'admin' && (
                    <>
                      <Link 
                        to="/create-account" 
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                      >
                        Création de comptes
                      </Link>
                      <Link 
                        to="/admin-panel" 
                        className="px-4 py-2 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition"
                      >
                        Admin
                      </Link>
                    </>
                  )}
                  <Link 
                    to="/profile" 
                    className="px-4 py-2 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition"
                  >
                    Profil
                  </Link>
                  <button 
                    onClick={handleSignOut} 
                    className="px-4 py-2 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/signin" 
                  className="px-4 py-2 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      <div className="p-8">
        <Routes>
          {!adminExists ? (
            <Route path="/*" element={<AdminCreation />} />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/activate/:token" element={<Activation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/aboutus" element={<AboutUs />} />
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
              <Route path="/roaming-tests" element={<RoamingTests />} />
              <Route path="/ir21" element={<IR21Page />} />
              <Route path="/inbound-roaming-results" element={<InboundRoamingResults />} />
              <Route path="/outbound-roaming-results" element={<OutboundRoamingResults />} />
              <Route path="/camel-inbound-results" element={<CamelInboundResults />} />
              <Route path="/mss-huawei" element={<MssHuawei />} />
              <Route path="/camel-outbound-results" element={<CamelOutboundResults />} />
              <Route path="/data-inbound-results" element={<DataInboundResults />} />
              <Route path="/hss" element={<HssPage />} />
              <Route path="/hlr" element={<HlrPage />} />
              <Route path="/ir85" element={<IR85Page />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/mme-imsi" element={<MmeImsi />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

// The App component now just sets up the Router
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
