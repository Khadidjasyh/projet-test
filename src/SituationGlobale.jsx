import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGlobe, FaArrowLeft, FaExclamationTriangle, FaSearch, FaFilter, FaFileExport } from "react-icons/fa";
import { Link } from "react-router-dom";

const SituationGlobale = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gsm: "",
    camel: "",
    gprs: "",
    troisg: "",
    lte: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const getStatusColor = (status) => {
    if (!status || status === "-") return "text-gray-500";
    if (status === "OK" || status === "Bilateral") return "text-green-600";
    if (status.includes("Unilateral")) return "text-yellow-500";
    if (status === "NOK") return "text-red-600";
    return "text-gray-600";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5177/situation-globale');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const result = await response.json();
        console.log("Données reçues:", result);
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Erreur lors du chargement des données");
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.pays?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operateur?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return item[key] === value;
    });

    return matchesSearch && matchesFilters;
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Pays', 'Opérateur', 'PLMN', 'GSM', 'CAMEL', 'GPRS', '3G', '4G/LTE'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(item => [
        item.id,
        item.pays,
        item.operateur,
        item.plmn,
        item.gsm,
        item.camel,
        item.gprs,
        item.troisg,
        item.lte
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'situation_globale.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 p-6 rounded-lg shadow-lg max-w-lg w-full">
          <div className="flex items-center text-red-600 mb-4">
            <FaExclamationTriangle className="text-xl mr-2" />
            <h2 className="text-lg font-semibold">Erreur</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="text-2xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Situation Globale</h1>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <FaGlobe className="text-xl" />
            <span className="font-semibold">Vue d'ensemble</span>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par pays ou opérateur..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.gsm}
                onChange={(e) => setFilters({ ...filters, gsm: e.target.value })}
              >
                <option value="">GSM</option>
                <option value="OK">OK</option>
                <option value="NOK">NOK</option>
                <option value="Unilateral">Unilateral</option>
              </select>
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.camel}
                onChange={(e) => setFilters({ ...filters, camel: e.target.value })}
              >
                <option value="">CAMEL</option>
                <option value="OK">OK</option>
                <option value="NOK">NOK</option>
                <option value="Unilateral">Unilateral</option>
              </select>
              <button
                onClick={handleExportCSV}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaFileExport />
                Exporter CSV
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('pays')}
                  >
                    Pays {sortConfig.key === 'pays' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('operateur')}
                  >
                    Opérateur {sortConfig.key === 'operateur' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PLMN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GSM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CAMEL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPRS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    3G
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    4G/LTE
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.pays || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.operateur || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.plmn || "-"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(item.gsm)}`}>
                      {item.gsm || "-"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(item.camel)}`}>
                      {item.camel || "-"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(item.gprs)}`}>
                      {item.gprs || "-"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(item.troisg)}`}>
                      {item.troisg || "-"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(item.lte)}`}>
                      {item.lte || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SituationGlobale; 