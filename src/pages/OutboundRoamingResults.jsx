import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
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
            ...row,
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

  // Helpers pour badge
  function getBadge(val) {
    if (!val || val.toLowerCase() === "aucun") {
      return (
        <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
          Aucun
        </span>
      );
    }
    if (val.toLowerCase().includes('réussit') || val.toLowerCase().includes('correct') || val.toLowerCase().includes('reussi')) {
      return (
        <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-green-100 text-green-700 whitespace-nowrap">
          Réussit
        </span>
      );
    }
    if (val.toLowerCase().includes('erreur')) {
      return (
        <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-red-100 text-red-700 whitespace-nowrap">
          Erreur
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
        {val}
      </span>
    );
  }

  // Helpers pour problème/solution
  function getProblemAndSolution(row) {
    let problems = [];
    let solutions = [];

    // IR21
    if (row.ir21.toLowerCase().includes('erreur')) {
      problems.push("Erreur lors de l'extraction IR21.");
      solutions.push("Vérifier l'importation de l'IR21 ou l'IR85.");
    } else if (row.ir21.toLowerCase().includes('réussit')) {
      problems.push("Extraction IR21 réussie.");
      solutions.push("Aucune action requise pour IR21.");
    } else {
      problems.push("Statut IR21 inconnu.");
      solutions.push("Vérifier les données IR21.");
    }

    // APN
    if (row.apn.toLowerCase().includes('erreur')) {
      problems.push("Erreur dans la vérification HSS (APN).");
      solutions.push("Vérifier la configuration APN côté HSS.");
    } else if (row.apn.toLowerCase().includes('correct')) {
      problems.push("Vérification HSS (APN) correcte.");
      solutions.push("Aucune action requise pour APN.");
    } else {
      problems.push("Statut APN inconnu.");
      solutions.push("Vérifier les données APN.");
    }

    // GT
    if (row.verification_gt_msc.toLowerCase().includes('erreur')) {
      problems.push("Erreur dans la vérification GT (MSC/VLR).");
      solutions.push("Vérifier la configuration GT (MSC/VLR).");
    } else if (row.verification_gt_msc.toLowerCase().includes('reussi')) {
      problems.push("Vérification GT (MSC/VLR) réussie.");
      solutions.push("Aucune action requise pour GT.");
    } else {
      problems.push("Statut GT (MSC/VLR) inconnu.");
      solutions.push("Vérifier les données GT.");
    }

    // MCC/MNC
    if (!row.mcc || !row.mnc) {
      problems.push("Impossible de faire l'extraction MCC/MNC.");
      solutions.push("Vérifier les champs MCC/MNC.");
    } else {
      problems.push("Extraction MCC/MNC réussie.");
      solutions.push("Aucune action requise pour MCC/MNC.");
    }

    return { problems, solutions };
  }

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

  const handleBack = () => {
    navigate('/roaming-tests');
  };

  // Génération du rapport détaillé
  const handleExportTXT = () => {
    if (filteredData.length === 0) return;
    let txtContent = '===== Rapport Outbound Roaming – Résultats détaillés =====\n\n';
    txtContent += `Date de génération : ${new Date().toLocaleString()}\n\n`;
    txtContent += `Total opérateurs : ${filteredData.length}\n`;
    txtContent += `Tests réussis : ${totalReussi}\n`;
    txtContent += `Tests partiels : ${totalPartiel}\n`;
    txtContent += `Taux de réussite : ${total > 0 ? Math.round(totalReussi * 100 / total) : 0}%\n\n`;

    filteredData.forEach((row, idx) => {
      const { problems, solutions } = getProblemAndSolution(row);
      txtContent += `--- Opérateur #${idx + 1} ---\n`;
      txtContent += `Opérateur : ${row.operateur}\n`;
      txtContent += `Pays      : ${row.pays}\n`;
      txtContent += `PLMN      : ${row.plmn}\n`;
      txtContent += `Extraction IR21 : ${row.ir21}\n`;
      txtContent += `Vérification HSS (APN) : ${row.apn}\n`;
      txtContent += `Vérification GT (MSC/VLR) : ${row.verification_gt_msc}\n`;
      txtContent += `Extraction MCC/MNC : ${row.mcc} ${row.mnc}\n`;
      txtContent += `Commentaires : ${row.commentaires}\n`;
      txtContent += `\nProblèmes détectés :\n`;
      problems.forEach((p, i) => {
        txtContent += `  - ${p}\n`;
      });
      txtContent += `\nSolutions proposées :\n`;
      solutions.forEach((s, i) => {
        txtContent += `  - ${s}\n`;
      });
      txtContent += '\n----------------------------------------\n\n';
    });

    txtContent +=
      "Légende :\n" +
      "réussit = Test réussi, aucune action requise\n" +
      "erreur = Test échoué, action requise\n" +
      "aucun = Données manquantes ou non testées\n\n" +
      "Ce rapport a été généré automatiquement pour faciliter le suivi de la qualité du roaming outbound.\n";

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rapport_outbound_roaming.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 max-w-6xl mx-auto bg-[#f8fafc] min-h-screen">
      {/* Buttons row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="flex items-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded shadow transition text-base"
        >
          <FaArrowLeft className="mr-2" size={18} />
          <span>Retour aux tests</span>
        </button>
        <button
          onClick={handleExportTXT}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition text-base"
        >
          <FaChartBar className="mr-2" size={18} />
          <span>Générer un rapport</span>
        </button>
      </div>

      {/* Title and description */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Vérification Outbound Roaming</h1>
        <p className="text-lg text-gray-600">
          Visualisation des opérateurs, conformité IR21, APN, GT et MCC/MNC
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-base text-gray-500">Total des opérateurs</div>
          <div className="text-3xl font-bold text-gray-800">{total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-base text-gray-500">Tests réussis</div>
          <div className="text-3xl font-bold text-green-600">{totalReussi}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-base text-gray-500">Tests partiels</div>
          <div className="text-3xl font-bold text-gray-800">{totalPartiel}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-base text-gray-500">Taux de réussite</div>
          <div className="text-3xl font-bold text-green-600">
            {total > 0 ? `${Math.round(totalReussi * 100 / total)}%` : "0%"}
          </div>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          placeholder="Rechercher par opérateur, pays, conformité ou commentaire"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-base text-gray-700 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-[13px] md:text-[15px]">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Opérateur</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Pays</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">PLMN</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Extraction IR21</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Vérification HSS (APN)</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Vérification GT (MSC/VLR)</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Extraction MCC/MNC</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaires</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                  <div className="mt-2 text-gray-500">Chargement des résultats...</div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-red-600">{error}</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-yellow-600">Aucun résultat trouvé</td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 border-b font-bold">{row.operateur}</td>
                  <td className="px-3 py-2 border-b">{row.pays}</td>
                  <td className="px-3 py-2 border-b">{row.plmn}</td>
                  <td className="px-3 py-2 border-b text-center">{getBadge(row.ir21)}</td>
                  <td className="px-3 py-2 border-b text-center">{getBadge(row.apn)}</td>
                  <td className="px-3 py-2 border-b text-center">{getBadge(row.verification_gt_msc)}</td>
                  <td className="px-3 py-2 border-b text-center">{row.mcc} {row.mnc}</td>
                  <td className="px-3 py-2 border-b">{row.commentaires}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-2 px-3">
          <span className="text-base text-gray-700">Total: {filteredData.length} résultat(s)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OutboundRoamingResults;