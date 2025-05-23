import React, { useState, useEffect } from 'react';
import { FaChartBar, FaArrowLeft } from 'react-icons/fa';

const DataInboundResults = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDetail, setOpenDetail] = useState(null);

  // Récupération des données depuis l'API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5178/inbound-roaming-test');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement des opérateurs: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper pour afficher "réussit", "erreur", "aucun"
  function getConformiteText(val) {
    if (val === 100) return "réussit";
    if (val > 0 && val < 100) return "erreur";
    return "aucun";
  }

  // Génère une explication détaillée et une solution selon la conformité
  function getConformiteDetails(type, val, row) {
    if (getConformiteText(val) === "réussit") {
      return {
        problem: `La conformité ${type} est totale.`,
        solution: `Aucune action requise. Les données ${type} sont correctes pour l'opérateur ${row.operateur}.`
      };
    }
    if (getConformiteText(val) === "erreur") {
      return {
        problem: `La conformité ${type} est partielle (${val}%).`,
        solution:
          type === "IR21"
            ? "Vérifiez que toutes les IPs partenaires sont bien déclarées dans le fichier IR21 et synchronisées avec la configuration du firewall. Corrigez les écarts détectés."
            : type === "IR85"
            ? "Assurez-vous que les informations IR85 sont à jour et conformes aux exigences du roaming. Contactez le partenaire si besoin."
            : "Certains IMSI ne sont pas reconnus ou absents. Vérifiez la liste IMSI côté MME et IR21, et synchronisez les bases de données."
      };
    }
    return {
      problem: `Aucune donnée de conformité ${type} trouvée.`,
      solution: `Complétez ou corrigez les informations ${type} pour cet opérateur afin de permettre la validation du roaming.`
    };
  }

  // Filtrage par opérateur, pays, pourcentages ou commentaires
  const filteredData = data.filter(
    row =>
      (row.operateur && row.operateur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.pays && row.pays.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.pourcentage_conformite_ir21 !== undefined && getConformiteText(row.pourcentage_conformite_ir21).includes(searchTerm.toLowerCase())) ||
      (row.pourcentage_conformite_ir85 !== undefined && getConformiteText(row.pourcentage_conformite_ir85).includes(searchTerm.toLowerCase())) ||
      (row.pourcentage_conformite_imsi !== undefined && getConformiteText(row.pourcentage_conformite_imsi).includes(searchTerm.toLowerCase())) ||
      (row.commentaire_ip && row.commentaire_ip.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.commentaire_imsi && row.commentaire_imsi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistiques
  const total = filteredData.length;
  // Compte chaque "réussit" dans chaque colonne
  const totalReussi = filteredData.reduce((acc, row) => {
    let count = 0;
    if (getConformiteText(row.pourcentage_conformite_ir21) === "réussit") count++;
    if (getConformiteText(row.pourcentage_conformite_ir85) === "réussit") count++;
    if (getConformiteText(row.pourcentage_conformite_imsi) === "réussit") count++;
    return acc + count;
  }, 0);
  const totalEchoue = filteredData.reduce((acc, row) => {
    let count = 0;
    if (getConformiteText(row.pourcentage_conformite_ir21) === "erreur") count++;
    if (getConformiteText(row.pourcentage_conformite_ir85) === "erreur") count++;
    if (getConformiteText(row.pourcentage_conformite_imsi) === "erreur") count++;
    return acc + count;
  }, 0);
  const tauxReussite = total > 0 ? Math.round((totalReussi * 100) / (total * 3)) : 0;

  // Génération du rapport TXT amélioré
  const handleExportTXT = () => {
    if (filteredData.length === 0) return;

    let txtContent = 'Rapport Inbound Roaming – Analyse détaillée\n\n';

    filteredData.forEach(row => {
      txtContent += `Opérateur : ${row.operateur}\n`;
      txtContent += `Pays      : ${row.pays}\n`;

      // IR21
      const ir21 = getConformiteDetails("IR21", row.pourcentage_conformite_ir21, row);
      txtContent += `Conformité IR21 : ${getConformiteText(row.pourcentage_conformite_ir21)} (${row.pourcentage_conformite_ir21 || 0}%)\n`;
      txtContent += `  Problème : ${ir21.problem}\n  Solution : ${ir21.solution}\n`;

      // IR85
      const ir85 = getConformiteDetails("IR85", row.pourcentage_conformite_ir85, row);
      txtContent += `Conformité IR85 : ${getConformiteText(row.pourcentage_conformite_ir85)} (${row.pourcentage_conformite_ir85 || 0}%)\n`;
      txtContent += `  Problème : ${ir85.problem}\n  Solution : ${ir85.solution}\n`;

      // IMSI
      const imsi = getConformiteDetails("IMSI", row.pourcentage_conformite_imsi, row);
      txtContent += `Conformité IMSI : ${getConformiteText(row.pourcentage_conformite_imsi)} (${row.pourcentage_conformite_imsi || 0}%)\n`;
      txtContent += `  Problème : ${imsi.problem}\n  Solution : ${imsi.solution}\n`;

      txtContent += `Commentaire IP  : ${row.commentaire_ip}\n`;
      txtContent += `Commentaire IMSI: ${row.commentaire_imsi}\n`;
      txtContent += `IPs Firewall    : ${(Array.isArray(row.adresses_ip_firewall) && row.adresses_ip_firewall.length > 0) ? row.adresses_ip_firewall.join(', ') : ''}\n`;
      txtContent += `IMSIs           : ${(Array.isArray(row.imsis_mme) && row.imsis_mme.length > 0) ? row.imsis_mme.join(', ') : ''}\n`;
      txtContent += `E212 IR21       : ${(Array.isArray(row.e212_ir21) && row.e212_ir21.length > 0) ? row.e212_ir21.join(', ') : ''}\n`;
      txtContent += '\n----------------------------------------\n\n';
    });

    txtContent +=
      "Légende :\n" +
      "réussit = Test réussi, aucune action requise\n" +
      "erreur = Test échoué, action requise\n" +
      "aucun = Données manquantes ou non testées\n\n" +
      "Ce rapport a été généré automatiquement pour faciliter le suivi de la qualité du roaming inbound.\n" +
      "Pour toute anomalie, contacter l’équipe Roaming ou IT Mobilis.\n";

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rapport_inbound_roaming.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Buttons row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded shadow transition text-sm"
        >
          <FaArrowLeft className="mr-2" size={16} />
          <span>Retour aux tests</span>
        </button>
        <button
          onClick={handleExportTXT}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition text-sm"
        >
          <FaChartBar className="mr-2" size={16} />
          <span>Générer un rapport</span>
        </button>
      </div>

      {/* Title and description */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Vérification Inbound Roaming</h1>
        <p className="text-gray-600">
          Visualisation des opérateurs, conformité IPs et IMSI
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
          placeholder="Rechercher par opérateur, pays, conformité ou commentaire"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 bg-white"
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <p>Aucun résultat trouvé</p>
        </div>
      )}

      {!loading && filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Opérateur</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Pays</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Conformité IR21</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Conformité IR85</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Conformité IMSI</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaire IP</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaire IMSI</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Détails</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <React.Fragment key={row.operateur + row.pays}>
                    <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b font-medium">{row.operateur}</td>
                      <td className="px-3 py-2 border-b">{row.pays}</td>
                      <td className="px-3 py-2 border-b text-center">{getConformiteText(row.pourcentage_conformite_ir21)}</td>
                      <td className="px-3 py-2 border-b text-center">{getConformiteText(row.pourcentage_conformite_ir85)}</td>
                      <td className="px-3 py-2 border-b text-center">{getConformiteText(row.pourcentage_conformite_imsi)}</td>
                      <td className="px-3 py-2 border-b">{row.commentaire_ip}</td>
                      <td className="px-3 py-2 border-b">{row.commentaire_imsi}</td>
                      <td className="px-3 py-2 border-b text-center">
                        <button
                          className="text-green-600 underline"
                          onClick={() => setOpenDetail(openDetail === idx ? null : idx)}
                        >
                          {openDetail === idx ? 'Masquer' : 'Détails'}
                        </button>
                      </td>
                    </tr>
                    {openDetail === idx && (
                      <tr>
                        <td colSpan={8} className="bg-gray-50 px-3 py-2 border-b">
                          <div>
                            <strong>IPs Firewall :</strong>
                            <div className="mb-2 text-xs break-all">{Array.isArray(row.adresses_ip_firewall) ? row.adresses_ip_firewall.join(', ') : ''}</div>
                            <strong>IMSIs :</strong>
                            <div className="mb-2 text-xs break-all">{Array.isArray(row.imsis_mme) ? row.imsis_mme.join(', ') : ''}</div>
                            <strong>E212 IR21 :</strong>
                            <div className="mb-2 text-xs break-all">{Array.isArray(row.e212_ir21) ? row.e212_ir21.join(', ') : ''}</div>
                            {/* Affichage des problèmes et solutions pour chaque conformité */}
                            <div className="mt-2">
                              <strong>Détails conformité :</strong>
                              <ul className="list-disc ml-5 text-xs">
                                <li>
                                  <strong>IR21 :</strong> {getConformiteDetails("IR21", row.pourcentage_conformite_ir21, row).problem}
                                  <br />
                                  <span className="text-green-700">Solution : {getConformiteDetails("IR21", row.pourcentage_conformite_ir21, row).solution}</span>
                                </li>
                                <li>
                                  <strong>IR85 :</strong> {getConformiteDetails("IR85", row.pourcentage_conformite_ir85, row).problem}
                                  <br />
                                  <span className="text-green-700">Solution : {getConformiteDetails("IR85", row.pourcentage_conformite_ir85, row).solution}</span>
                                </li>
                                <li>
                                  <strong>IMSI :</strong> {getConformiteDetails("IMSI", row.pourcentage_conformite_imsi, row).problem}
                                  <br />
                                  <span className="text-green-700">Solution : {getConformiteDetails("IMSI", row.pourcentage_conformite_imsi, row).solution}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 px-4">
              <span className="text-sm text-gray-700">Total: {filteredData.length} groupe(s) opérateur/pays</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInboundResults;