import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InboundRoamingResults = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5178/inbound-roaming');
        setData(response.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(
    row =>
      (row.operateur && row.operateur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.country && row.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.phase_1 && row.phase_1.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.phase_2 && row.phase_2.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.test_final && row.test_final.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.commentaire && row.commentaire.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistiques
  const total = filteredData.length;
  const totalReussi = filteredData.filter(row => row.test_final === "réussite").length;
  const totalEchoue = filteredData.filter(row => row.test_final === "échec").length;
  const tauxReussite = total > 0 ? Math.round((totalReussi * 100) / total) : 0;

 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Chargement des résultats...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Buttons row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/roaming-tests')}
          className="flex items-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded shadow transition text-sm"
        >
          <FaArrowLeft className="mr-2" size={16} />
          <span>Retour aux tests</span>
        </button>
        <button
          onClick={() => {}} // Ajoutez votre logique de génération de rapport ici
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition text-sm"
        >
          <FaChartBar className="mr-2" size={16} />
          <span>Générer un rapport</span>
        </button>
      </div>

      {/* Title and description */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Résultats Inbound Roaming</h1>
        <p className="text-gray-600">
          Visualisez les résultats des tests inbound roaming avec statut par phase
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Total des opérateurs</div>
          <div className="text-3xl font-bold text-gray-800">{total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Tests réussis</div>
          <div className="text-3xl font-bold text-green-600">{totalReussi}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Tests échoués</div>
          <div className="text-3xl font-bold text-gray-800">{totalEchoue}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Taux de réussite</div>
          <div className="text-3xl font-bold text-green-600">{tauxReussite}%</div>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher par opérateur, pays"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Opérateur</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Pays</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Vérification des E.212 (IMSI Prefix)</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Vérification des E.214 (MGT)</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Test Final</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((entry, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 border-b font-medium">{entry.operateur}</td>
                  <td className="px-3 py-2 border-b">{entry.country}</td>
                  <td className="px-3 py-2 border-b text-center">{entry.phase_1}</td>
                  <td className="px-3 py-2 border-b text-center">{entry.phase_2}</td>
                  <td className="px-3 py-2 border-b text-center">{entry.test_final}</td>
                  <td className="px-3 py-2 border-b">{entry.commentaire}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-2 text-center text-gray-500">Aucune donnée disponible.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4 px-4">
          <span className="text-sm text-gray-700">Total: {filteredData.length} résultat(s)</span>
        </div>
      </div>

      
    </div>
  );
};

export default InboundRoamingResults;