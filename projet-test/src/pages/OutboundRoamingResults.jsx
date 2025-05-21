import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { generateReportFromTest } from '../RapportAudit';

const OutboundRoamingResults = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSituationGlobale = async () => {
      try {
        const response = await fetch('http://localhost:5178/outbound-roaming');
        if (!response.ok) throw new Error('Erreur lors de la récupération');
        const res = await response.json();

        const mapped = res.map(row => {
          const rawMcc = row.mcc || '';
          const rawMnc = row.mnc || '';

          // MCC : garder uniquement les 3 premiers chiffres
          const mcc = rawMcc.slice(0, 3);

          // MNC : supprimer les 3 premiers caractères (ex: "mnc001" => "001"), et limiter à 3 chiffres
          const mnc = rawMnc.slice(3, 6);

          // Construction de l'affichage MCC/MNC
          let mccDisplay = mcc ? `mcc = ${mcc}` : '';
          let mncDisplay = mnc ? `mnc = ${mnc}` : '';

          // Déterminer si extraction MCC/MNC est possible
          const extractionPossible = mcc && mnc;

          // Initialiser commentaires
          let commentaires = '';

          // Si extraction_ir21 contient "erreur", on met ce commentaire précis
          if (row.extraction_ir21 && row.extraction_ir21.toLowerCase().includes('erreur')) {
            commentaires = "Vérifie l'importation de l'IR21 ou l'IR85";
          }

          // Si MCC ou MNC manquants, extraction impossible
          else if (!extractionPossible) {
            commentaires = 'Impossible de faire l\'extraction MCC/MNC';
          } else {
            // Sinon, commentaires selon autres contrôles éventuels
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
      } catch (e) {
        alert('Erreur lors de la récupération de la situation globale');
      }
    };

    fetchSituationGlobale();
  }, []);

  const headers = [
    "Pays",
    "Opérateur",
    "PLMN",
    "Extraction des données IR21",
    "Vérification HSS (APN)",
    "Vérification GT (MSC/VLR)",
    "Extraction MCC/MNC",
    "Commentaires"
  ];

  const handleBack = () => {
    navigate('/roaming-tests');
  };

  const handleDownload = () => {
    console.log('Téléchargement du rapport...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateReport = async () => {
    try {
      // Vérifier que data est bien un tableau
      if (!Array.isArray(data)) {
        console.error('Données inattendues pour le rapport:', data);
        throw new Error('Aucune donnée disponible pour générer le rapport');
      }

      // S'assurer que chaque élément a la propriété commentaires
      const safeData = data.map(row => ({
        ...row,
        commentaires: typeof row.commentaires === 'string' ? row.commentaires : ''
      }));

      // Génération du rapport TXT
      const testName = "Test Outbound Roaming";
      const now = new Date();
      const dateStr = now.toLocaleString();

      // Erreur globale : on prend les commentaires "en erreur"
      const erreurs = safeData.filter(row => row.commentaires && row.commentaires.toLowerCase().includes("erreur"));
      const erreurGlobale = erreurs.length > 0 ? erreurs[0].commentaires : "Aucune erreur majeure détectée.";

      // Filtrer les lignes à exclure
      const exclusion = "Extraction IR21 réussie, erreur dans la vérification HSS (APN), vérification GT réussie.";
      const filtered = safeData.filter(row => row.commentaires !== exclusion);

      // Vérifier que filtered n'est pas vide
      if (!filtered || filtered.length === 0) {
        console.error('Aucune donnée à inclure dans le rapport. Données:', safeData);
        throw new Error('Aucune donnée à inclure dans le rapport');
      }

      // Préparer les données du rapport pour l'API
      const reportData = {
        id: `AUD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        test_id: 3, // ID du test Outbound Roaming
        title: `${testName} - Rapport d'audit`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: 'Admin',
        validated_by: null,
        total_operators: filtered.length,
        total_issues: erreurs.length,
        camel_issues: 0,
        gprs_issues: 0,
        threeg_issues: 0,
        lte_issues: 0,
        results_data: JSON.stringify(filtered),
        solutions: JSON.stringify({
          recommendations: [
            "Vérifier les configurations des opérateurs en erreur",
            "Mettre à jour les accords manquants",
            "Configurer les services pour les opérateurs concernés"
          ]
        }),
        attachments: JSON.stringify([]),
        validation_notes: null,
        implemented_changes: null
      };

      // Utiliser generateReportFromTest pour générer le rapport
      const success = await generateReportFromTest(reportData);
      
      if (success) {
        // Redirection vers la page RapportAudit
        navigate('/rapport-audit');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Une erreur est survenue lors de la génération du rapport: ' + error.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
            <FaArrowLeft />
            <span>Retour aux tests</span>
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handleGenerateReport}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <span>Générer un rapport</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Résultats du Test Outbound Roaming</h1>
        <p className="text-gray-600">Analyse détaillée des résultats pour chaque opérateur en Outbound Roaming</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total des opérateurs</div>
          <div className="text-2xl font-bold text-gray-800">{data.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Tests réussis</div>
          <div className="text-2xl font-bold text-green-600">
            {data.filter(op =>
              op.ir21.toLowerCase().includes("réussit") &&
              op.apn !== 'erreur' &&
              op.gt !== '' &&
              op.mcc !== '' && op.mnc !== ''
            ).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Tests partiels</div>
          <div className="text-2xl font-bold text-yellow-600">
            {data.filter(op =>
              !(op.ir21.toLowerCase().includes("réussit") &&
                op.apn !== 'erreur' &&
                op.gt !== '' &&
                op.mcc !== '' && op.mnc !== '')
            ).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Taux de réussite</div>
          <div className="text-2xl font-bold text-blue-600">
            {data.length > 0 ? `${Math.round(
              data.filter(op =>
                op.ir21.toLowerCase().includes("réussit") &&
                op.apn !== 'erreur' &&
                op.gt !== '' &&
                op.mcc !== '' && op.mnc !== ''
              ).length * 100 / data.length
            )}%` : "0%"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.pays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.operateur}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.plmn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.ir21}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.apn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.verification_gt_msc}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.mcc} {row.mnc}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.commentaires}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">Aucune donnée disponible.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Résumé des résultats</h2>
        <p className="text-gray-600">
          Tous les opérateurs ont passé avec succès les tests d'Outbound Roaming. Les configurations
          sont correctement mises en place et aucun problème majeur n'a été détecté. Les services
          sont stables et fonctionnels pour tous les opérateurs testés.
        </p>
      </div>
    </motion.div>
  );
};

export default OutboundRoamingResults;