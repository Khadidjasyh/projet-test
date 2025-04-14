import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGlobe, FaArrowLeft, FaExclamationTriangle, FaSearch, FaFilter, FaFileExport, FaSave, FaTimes, FaEdit } from "react-icons/fa";
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
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    imsi: "",
    mcc: "",
    mnc: ""
  });
  const [modifiedItems, setModifiedItems] = useState({});

  const getStatusColor = (status) => {
    if (!status || status === "-") return "text-gray-500";
    if (status === "OK" || status === "Bilateral") return "text-green-600";
    if (status.includes("Unilateral")) return "text-yellow-500";
    if (status === "NOK") return "text-red-600";
    return "text-gray-600";
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Tentative de connexion à l'API...");
      const response = await fetch('http://localhost:5177/situation-globale');
      console.log("Réponse reçue:", response);
      
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

  useEffect(() => {
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
    const headers = ['ID', 'Pays', 'Opérateur', 'PLMN', 'GSM', 'CAMEL', 'GPRS', '3G', '4G/LTE', 'IMSI', 'MCC', 'MNC'];
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
        item.lte,
        item.imsi || '',
        item.mcc || '',
        item.mnc || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'situation_globale.csv';
    link.click();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      imsi: item.imsi || "",
      mcc: item.mcc || "",
      mnc: item.mnc || ""
    });
  };

  const handleInputChange = (e, itemId) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Ajouter l'élément modifié à la liste
    setModifiedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [name]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    try {
      console.log("Sauvegarde de toutes les modifications:", modifiedItems);
      
      // Envoyer chaque modification à l'API
      for (const [id, data] of Object.entries(modifiedItems)) {
        const response = await fetch(`http://localhost:5177/situation-globale/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la mise à jour de l'élément ${id}`);
        }
      }

      // Réinitialiser les états
      setModifiedItems({});
      setEditingId(null);
      toast.success('Toutes les modifications ont été enregistrées');
      
      // Rafraîchir les données
      await fetchData();
      
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      toast.error(err.message || "Erreur lors de la sauvegarde des modifications");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      imsi: "",
      mcc: "",
      mnc: ""
    });
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('imsi')}
                  >
                    IMSI {sortConfig.key === 'imsi' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('mcc')}
                  >
                    MCC {sortConfig.key === 'mcc' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('mnc')}
                  >
                    MNC {sortConfig.key === 'mnc' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.length > 0 ? (
                  sortedData.map((item) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            name="imsi"
                            value={editForm.imsi}
                            onChange={(e) => handleInputChange(e, item.id)}
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          item.imsi || "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            name="mcc"
                            value={editForm.mcc}
                            onChange={(e) => handleInputChange(e, item.id)}
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          item.mcc || "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            name="mnc"
                            value={editForm.mnc}
                            onChange={(e) => handleInputChange(e, item.id)}
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          item.mnc || "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Clic sur le bouton Enregistrer");
                                handleSaveAll();
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                              title="Enregistrer"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCancel();
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                              title="Annuler"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Clic sur le bouton Modifier");
                              handleEdit(item);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="px-6 py-4 text-center text-gray-500">
                      Aucune donnée disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Bouton Enregistrer en bas */}
      {Object.keys(modifiedItems).length > 0 && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleSaveAll}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <FaSave className="text-xl" />
            <span>Enregistrer toutes les modifications</span>
            <span className="bg-white text-green-500 rounded-full px-2 py-1 text-sm">
              {Object.keys(modifiedItems).length}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SituationGlobale; 