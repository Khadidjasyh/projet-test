import React, { useEffect, useState } from 'react';
import { BsFillShieldLockFill, BsExclamationTriangleFill, BsCheckCircleFill, BsGearFill, BsBell, BsGear, BsSpeedometer2, BsFileEarmarkText, BsPeople, BsArrowLeftRight, BsExclamationTriangle, BsFileEarmarkBarGraph, BsQuestionCircle, BsBoxArrowRight } from 'react-icons/bs';
import { FaNetworkWired, FaGlobe, FaExchangeAlt, FaFileUpload } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoamingPartners from './RoamingPartners';
import RoamingServicesTable from './RoamingServicesTable';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composants utilitaires
export function Button({ children, onClick }) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClick}>
      {children}
    </button>
  );
}

export function Card({ children }) {
  return <div className="border rounded-lg p-4 shadow">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}

// Composant Navbar
function Navbar() {
  const [notifications] = useState(3);

  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="https://via.placeholder.com/40" 
          alt="Mobilis" 
          className="h-8 mr-3" 
        />
        <h1 className="text-xl font-semibold text-gray-800">Système d'Audit Roaming</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="border border-gray-300 p-2 rounded-md w-64"
          />
        </div>
        
        <div className="relative">
          <BsBell className="text-gray-600 text-xl cursor-pointer" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
        
        <BsGear className="text-gray-600 text-xl cursor-pointer" />
        
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Utilisateur"
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-2">
            <p className="text-sm font-medium">AdminUser</p>
            <p className="text-xs text-gray-500">Administrateur</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Sidebar
function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: <BsSpeedometer2 /> },
    { id: "situation-globale", label: "Situation Globale", icon: <FaGlobe /> },
    { id: "audits", label: "Audits", icon: <BsFileEarmarkText /> },
    { id: "partners", label: "Partenaires", icon: <BsPeople /> },
    { id: "roaming", label: "Configuration Roaming", icon: <BsArrowLeftRight /> },
    { id: "alerts", label: "Alertes", icon: <BsExclamationTriangle /> },
    { id: "reports", label: "Rapports", icon: <BsFileEarmarkBarGraph /> },
    { id: "settings", label: "Paramètres", icon: <BsGear /> }
  ];

  return (
    <div 
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg min-h-screen flex flex-col transition-all duration-300 relative cursor-pointer`}
      onClick={toggleSidebar}
    >
      <div className={`p-5 border-b flex ${isCollapsed ? 'justify-center' : ''}`}>
        {isCollapsed ? (
          <h2 className="text-2xl font-bold text-green-600">AR</h2>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-green-600">Audit Roaming</h2>
            <p className="text-sm text-gray-500 mt-1">Mobilis</p>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {!isCollapsed && (
          <p className="text-xs uppercase text-gray-500 font-medium mb-2 ml-2">MENU PRINCIPAL</p>
        )}
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.id}>
              <Link 
                to={item.id === "dashboard" ? "/" : `/${item.id}`} 
                className={`flex items-center py-2 ${isCollapsed ? 'px-2 justify-center' : 'px-3'} rounded-lg transition-colors ${
                  activeItem === item.id 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveItem(item.id)}
                title={isCollapsed ? item.label : ""}
              >
                <span className={isCollapsed ? "" : "mr-3"}>{item.icon}</span>
                {!isCollapsed && item.label}
              </Link>
            </li>
          ))}
        </ul>
        
        {!isCollapsed && (
          <div className="mt-8">
            <p className="text-xs uppercase text-gray-500 font-medium mb-2 ml-2">ASSISTANCE</p>
            <ul className="space-y-1">
              <li>
                <Link to="/help" className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <BsQuestionCircle className="mr-3" />
                  Centre d'aide
                </Link>
              </li>
            </ul>
          </div>
        )}
        {isCollapsed && (
          <div className="mt-8 flex justify-center">
            <Link to="/help" className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg" title="Centre d'aide">
              <BsQuestionCircle />
            </Link>
          </div>
        )}
      </div>
      
      <div className={`p-4 border-t ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button className={`${isCollapsed ? '' : 'flex items-center w-full'} py-2 px-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors`} title={isCollapsed ? "Déconnexion" : ""}>
          <BsBoxArrowRight className={isCollapsed ? "" : "mr-3"} />
          {!isCollapsed && "Déconnexion"}
        </button>
      </div>
    </div>
  );
}

// Composant principal Dashboard
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [partnersPerPage] = useState(10);

  const [stats, setStats] = useState({
    totalAudits: 0,
    errorsDetected: 0,
    partnersConnected: 0,
    pendingTasks: 0,
  });

  const [roamingEvents, setRoamingEvents] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [recentAudits, setRecentAudits] = useState([]);
  const [coverage, setCoverage] = useState({
    total_operators: 0,
    total_countries: 0,
    network_availability: 0,
  });

  // Fetch statistics from backend
  useEffect(() => {
    fetch("http://localhost:5177/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // Fetch roaming events from backend
  useEffect(() => {
    fetch("http://localhost:5177/roaming-events")
      .then((res) => res.json())
      .then((data) => setRoamingEvents(data))
      .catch((err) => console.error("Error fetching roaming events:", err));
  }, []);

  // Fetch critical alerts from backend
  useEffect(() => {
    fetch("http://localhost:5177/critical-alerts")
      .then((res) => res.json())
      .then((data) => setCriticalAlerts(data))
      .catch((err) => console.error("Error fetching critical alerts:", err));
  }, []);

  // Fetch recent audits from backend
  useEffect(() => {
    fetch('http://localhost:5177/audits')
      .then(res => res.json())
      .then(data => setRecentAudits(data))
      .catch(err => console.error('Erreur de chargement des audits:', err));
  }, []);

  // Fetch coverage data from backend
  useEffect(() => {
    fetch("http://localhost:5177/roaming-coverage")
      .then((res) => res.json())
      .then((data) => setCoverage(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    console.log('Fetching partners...');
    try {
      const response = await fetch('http://localhost:5177/roaming-partners');
      const data = await response.json();
      console.log('Received partners data:', data);
      setPartners(data);
      setTotalPartners(data.length);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  // Filtrer les partenaires en fonction du terme de recherche
  const filteredPartners = partners.filter(partner =>
    partner.operateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.imsi_prefix?.toString().includes(searchTerm) ||
    partner.gt?.toString().includes(searchTerm)
  );

  // Pagination
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = filteredPartners.slice(indexOfFirstPartner, indexOfLastPartner);
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  const roamingIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "corrigée":
        return "text-green-600";
      case "En cours":
        return "text-blue-600";
      case "Non corrigée":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRoamingStatusColor = (status) => {
    switch(status) {
      case 'Complété': return 'text-green-600';
      case 'En cours': return 'text-blue-600';
      case 'En Attente': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'overview'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('partners')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'partners'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Partenaires
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'services'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Services Roaming
              </button>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <div className="p-6 bg-gray-100">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Tableau de Bord - Audit Roaming</h1>
                <p className="text-gray-600">Supervision des configurations et détection d'anomalies</p>
              </div>
              
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Audits ce mois-ci</p>
                      <p className="text-2xl font-bold">{stats.totalAudits}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <BsFillShieldLockFill className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Erreurs détectées</p>
                      <p className="text-2xl font-bold">{stats.errorsDetected}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <BsExclamationTriangleFill className="text-red-600 text-xl" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Partenaires connectés</p>
                      <p className="text-2xl font-bold">{stats.partnersConnected}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaNetworkWired className="text-green-600 text-xl" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tâches en attente</p>
                      <p className="text-2xl font-bold">{stats.pendingTasks}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <BsGearFill className="text-purple-600 text-xl" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Situation Globale</h3>
                    <p className="text-sm text-gray-500">Vue d'ensemble des configurations</p>
                  </div>
                  <Link
                    to="/situation-globale"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <FaGlobe className="text-lg" />
                    <span>Voir la situation</span>
                  </Link>
                </div>
              </Card>
              
              {/* Carte du monde */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Couverture des Partenaires Roaming</h2>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xl">{coverage.total_operators}</p>
                      <p className="text-sm text-gray-600">Opérateurs partenaires</p>
                    </div>
                    <div>
                      <p className="font-bold text-xl">{coverage.total_countries}</p>
                      <p className="text-sm text-gray-600">Pays connectés</p>
                    </div>
                    <div>
                      <p className="font-bold text-xl">{coverage.network_availability}%</p>
                      <p className="text-sm text-gray-600">Disponibilité réseau</p>
                    </div>
                  </div>
                  
                  <MapContainer center={[48.8566, 2.3522]} zoom={4} style={{ height: "400px", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {roamingEvents.map((event, index) => (
                      <Marker key={index} position={[event.latitude, event.longitude]} icon={roamingIcon}>
                        <Popup>
                          <strong>Opérateur:</strong> {event.operator} <br />
                          <strong>MCC:</strong> {event.mcc} <br />
                          <strong>MNC:</strong> {event.mnc} <br />
                          <strong>Roamers:</strong> {event.roamers}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
                
                {/* Alertes */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Alertes Critiques</h2>
                  <div className="space-y-4">
                    {criticalAlerts.length > 0 ? (
                      criticalAlerts.map((alert, index) => (
                        <div key={index} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <p className="font-medium text-red-800">{alert.operateur}</p>
                          <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucune alerte critique</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Audits récents */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Audits Récents</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Opérateur</th>
                          <th className="px-4 py-2 text-left">Statut</th>
                          <th className="px-4 py-2 text-left">Erreurs</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentAudits.map((audit) => (
                          <tr key={audit.audit_id} className="border-t">
                            <td className="px-4 py-2">{audit.date}</td>
                            <td className="px-4 py-2">{audit.operateur}</td>
                            <td className={`px-4 py-2 font-semibold ${getStatusColor(audit.status)}`}>
                              {audit.status}
                            </td>
                            <td className="px-4 py-2">{audit.erreurs}</td>
                            <td className="px-4 py-2">
                              <button className="text-blue-600 hover:underline">Détails</button>
                            </td>
                          </tr>
                        ))}
                        {recentAudits.length === 0 && (
                          <tr>
                            <td className="px-4 py-2" colSpan="5">Aucun audit trouvé.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Actions rapides */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Actions Rapides</h2>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
                      <FaFileUpload className="mr-2" />
                      Importer un fichier IR.21/IR.85
                    </button>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
                      <BsFillShieldLockFill className="mr-2" />
                      Lancer un nouvel audit
                    </button>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
                      <BsGearFill className="mr-2" />
                      Vérifier les configurations
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-50">
                      Voir tous les rapports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'partners' ? (
            <div className="bg-white rounded-lg shadow">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Partenaires d'Itinérance</h1>
                <p className="text-gray-600">Gérez vos partenaires d'itinérance et leurs configurations</p>
              </div>

              {/* Barre de recherche */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Rechercher un partenaire..."
                  className="w-full p-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Tableau des partenaires */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMSI Prefix</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opérateur</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center">Chargement...</td>
                      </tr>
                    ) : currentPartners.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center">Aucun partenaire trouvé</td>
                      </tr>
                    ) : (
                      currentPartners.map((partner, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{partner.imsi_prefix}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{partner.gt}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{partner.operateur}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-700">
                    Affichage de {indexOfFirstPartner + 1} à {Math.min(indexOfLastPartner, filteredPartners.length)} sur {filteredPartners.length} entrées
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <RoamingServicesTable />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard; 