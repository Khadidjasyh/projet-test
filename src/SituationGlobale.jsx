import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGlobe, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const SituationGlobale = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pays
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opérateur
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
                {data.map((item) => (
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