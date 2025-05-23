import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OutboundRoamingResults = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSituationGlobale = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5178/outbound-roaming');
        if (!response.ok) throw new Error('Erreur lors de la récupération');
        const res = await response.json();

        const mapped = res.map(row => {
          const rawMcc = row.mcc || '';
          const rawMnc = row.mnc || '';
          const mcc = rawMcc.slice(0, 3);
          const mnc = rawMnc.slice(3, 6);
          let mccDisplay = mcc ? `mcc = ${mcc}` : '';
          let mncDisplay = mnc ? `mnc = ${mnc}` : '';
          const extractionPossible = mcc && mnc;
          let commentaires = '';
          if (row.extraction_ir21 && row.extraction_ir21.toLowerCase().includes('erreur')) {
            commentaires = "Vérifie l'importation de l'IR21 ou l'IR85";
          } else if (!extractionPossible) {
            commentaires = 'Impossible de faire l\'extraction MCC/MNC';
          } else {
            const ir21Ok = row.extraction_ir21 && row.extraction_ir21.toLowerCase().includes('réussit');
            const apnOk = row.comparaison_apn_epc && row.comparaison_apn_epc.toLowerCase() === 'correct';
            const gtOk = row.verification_gt_msc && row.verification_gt_msc.toLowerCase() === 'reussi';
            if (ir21Ok && !apnOk && gtOk) {
              commentaires = 'Extraction IR21 réussie, erreur dans la vérification HSS (APN), vérification GT réussie.';
            } else if (!ir21Ok && !apnOk && !gtOk) {
              commentaires = 'Extraction IR21 et vérifications HSS et GT en erreur.';
            } else {
              commentaires = 'Situation mixte, vérifier les données.';
            }
          }
          return {
            pays: row.pays || '',
            operateur: row.operateur || '',
            plmn: row.plmn || '',
            ir21: row.extraction_ir21 || '',
            apn: row.comparaison_apn_epc || '',
            verification_gt_msc: row.verification_gt_msc || '',
            gt: row.e212 || '',
            mcc: mccDisplay,
            mnc: mncDisplay,
            commentaires
          };
        });

        setData(mapped);
        setError(null);
      } catch (e) {
        setError('Erreur lors de la récupération de la situation globale');
      } finally {
        setLoading(false);
      }
    };

    fetchSituationGlobale();
  }, []);

  const headers = [
    "Opérateur",
    "Pays",
    "PLMN",
    "Extraction des données IR21",
    "Vérification HSS (APN)",
    "Vérification GT (MSC/VLR)",
    "Extraction MCC/MNC",
    "Commentaires"
  ];

  // Search
  const filteredData = data.filter(
    row =>
      (row.pays && row.pays.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.operateur && row.operateur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.plmn && row.plmn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.ir21 && row.ir21.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.apn && row.apn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.verification_gt_msc && row.verification_gt_msc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mcc && row.mcc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mnc && row.mnc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.commentaires && row.commentaires.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Stats
  const total = filteredData.length;
  const totalReussi = filteredData.filter(op =>
    op.ir21.toLowerCase().includes("réussit") &&
    op.apn !== 'erreur' &&
    op.gt !== '' &&
    op.mcc !== '' && op.mnc !== ''
  ).length;
  const totalPartiel = filteredData.length - totalReussi;

  // Pas de coloration des cellules
  const getCellClass = () => '';

  const handleBack = () => {
    navigate('/roaming-tests');
  };

  const handleGenerateReport = async () => {
    try {
      const now = new Date();
      const dateStr = now.toLocaleString();
      const erreurs = data.filter(row => row.commentaires && row.commentaires.toLowerCase().includes("erreur"));
      const erreurGlobale = erreurs.length > 0 ? erreurs[0].commentaires : "Aucune erreur majeure détectée.";

      const col1 = 'Pays';
      const col2 = 'Opérateur';
      const col3 = 'Commentaire';
      const width1 = Math.max(col1.length, ...data.map(r => (r.pays || '').length));
      const width2 = Math.max(col2.length, ...data.map(r => (r.operateur || '').length));
      const width3 = Math.max(col3.length, ...data.map(r => (r.commentaires || '').length));

      const pad = (txt, len) => (txt || '').padEnd(len, ' ');
      const sep = `| ${pad(col1, width1)} | ${pad(col2, width2)} | ${pad(col3, width3)} |\n`;
      const sepLine = `|-${'-'.repeat(width1)}-|-${'-'.repeat(width2)}-|-${'-'.repeat(width3)}-|\n`;
      let table = sep + sepLine;

      data.forEach(row => {
        table += `| ${pad(row.pays, width1)} | ${pad(row.operateur, width2)} | ${pad(row.commentaires, width3)} |\n`;
      });

      const aide = `

🔴 Commentaire : "Vérifie l'importation de l'IR21 ou l'IR85"
Cause probable :
L'extraction de l'IR21 a échoué (fichier manquant, mal structuré, ou mauvaise URL).

Solutions :
- Vérifie si le fichier IR.21 est bien importé et lisible dans ton application.
- Assure-toi que le format XML du fichier respecte bien la norme IR.21.
- Si tu utilises une API ou un système d'import, vérifie que le fichier IR.85 est également à jour.
- Vérifie le nom du fichier et sa localisation.
- S'assurer que les balises nécessaires sont bien présentes.

🔴 Commentaire : "Impossible de faire l'extraction MCC/MNC"
Cause probable :
Les champs MCC ou MNC sont manquants ou mal formatés.

Solutions :
- Vérifie que la PLMN est bien renseignée sous la forme MCC+MNC.
- Si la base de données contient une valeur comme mnc001, mcc208, extrais correctement les chiffres.
- Si l'information n'est pas présente dans l'IR21, cherche-la manuellement.
- Met en place une règle de validation en amont.

🟡 Commentaire : "Extraction IR21 réussie, erreur dans la vérification HSS (APN)"
Cause probable :
Les données APN extraites de l'IR21 ne correspondent pas à celles présentes dans le HSS.

Solutions :
- Vérifie que l'APN déclaré dans l'IR21 correspond bien à celui provisionné.
- Assure-toi que l'APN est bien activé pour le roaming.
- Contrôle la casse et les caractères spéciaux.
- Mets en place une table de correspondance APN IR21 <-> APN HSS.
`;

      const txt = `Nom du test : Outbound Roaming\n` +
        `Date : ${dateStr}\n` +
        `Erreur globale : ${erreurGlobale}\n\n` +
        table + aide;

      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_outbound_roaming_${now.toISOString().slice(0, 19).replace(/[:T]/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Préparation des données pour la sauvegarde dans la base de données
      const simplifiedData = data.map(row => ({
        pays: row.pays,
        operateur: row.operateur,
        commentaires: row.commentaires
      }));

      const reportData = {
        id: `AUD_${Date.now()}`,
        test_id: 3,
        title: `Rapport Outbound Roaming - ${now.toLocaleDateString()}`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: 'Système',
        total_operators: data.length,
        total_issues: erreurs.length,
        results_data: JSON.stringify(simplifiedData),
        solutions: JSON.stringify([
          "Vérifier l'importation des fichiers IR21/IR85",
          "Valider le format XML des fichiers",
          "Vérifier l'extraction MCC/MNC",
          "Contrôler la correspondance des APN entre IR21 et HSS"
        ]),
        validation_notes: erreurGlobale
      };

      await fetch('http://localhost:5178/audit-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      alert('Rapport généré et sauvegardé avec succès !');
    } catch (error) {
      alert("Une erreur est survenue lors de la génération du rapport.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Chargement des résultats...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto">
      {/* Buttons row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="flex items-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded shadow transition text-sm"
        >
          <FaArrowLeft className="mr-2" size={16} />
          <span>Retour aux tests</span>
        </button>
        <button
          onClick={handleGenerateReport}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition text-sm"
        >
          <FaChartBar className="mr-2" size={16} />
          <span>Générer un rapport</span>
        </button>
      </div>

      {/* Title and description */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Résultats Outbound Roaming</h1>
        <p className="text-gray-600">
          Visualisez les résultats des tests outbound roaming avec statut par phase
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total des opérateurs</div>
          <div className="text-2xl font-bold text-gray-800">{total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Tests réussis</div>
          <div className="text-2xl font-bold text-green-600">{totalReussi}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Tests partiels</div>
          <div className="text-2xl font-bold text-gray-800">{totalPartiel}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Taux de réussite</div>
          <div className="text-2xl font-bold text-green-600">
            {total > 0 ? `${Math.round(totalReussi * 100 / total)}%` : "0%"}
          </div>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher par opérateur, pays, PLMN"
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
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">PLMN</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Extraction des données IR21</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Vérification HSS (APN)</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Vérification GT (MSC/VLR)</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Extraction MCC/MNC</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaires</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 border-b font-medium">{row.operateur}</td>
                  <td className="px-3 py-2 border-b">{row.pays}</td>
                  <td className="px-3 py-2 border-b">{row.plmn}</td>
                  <td className={`px-3 py-2 border-b text-center ${getCellClass(row.ir21)}`}>{row.ir21}</td>
                  <td className={`px-3 py-2 border-b text-center ${getCellClass(row.apn)}`}>{row.apn}</td>
                  <td className={`px-3 py-2 border-b text-center ${getCellClass(row.verification_gt_msc)}`}>{row.verification_gt_msc}</td>
                  <td className="px-3 py-2 border-b text-center">{row.mcc} {row.mnc}</td>
                  <td className="px-3 py-2 border-b">{row.commentaires}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-3 py-2 text-center text-gray-500">Aucune donnée disponible.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4 px-4">
          <span className="text-sm text-gray-700">Total: {filteredData.length} résultat(s)</span>
        </div>
      </div>

      
    </motion.div>
  );
};

export default OutboundRoamingResults;