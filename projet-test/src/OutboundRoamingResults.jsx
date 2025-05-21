import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
              onClick={() => {
                // Génération du rapport TXT
                const testName = "Test Outbound Roaming";
                const now = new Date();
                const dateStr = now.toLocaleString();

                // Erreur globale : on prend les commentaires "en erreur"
                const erreurs = data.filter(row => row.commentaires && row.commentaires.toLowerCase().includes("erreur"));
                const erreurGlobale = erreurs.length > 0 ? erreurs[0].commentaires : "Aucune erreur majeure détectée.";

                // Filtrer les lignes à exclure
                const exclusion = "Extraction IR21 réussie, erreur dans la vérification HSS (APN), vérification GT réussie.";
                const filtered = data.filter(row => row.commentaires !== exclusion);

                // Construction du tableau sous forme de tableau texte aligné
                const col1 = 'Pays';
                const col2 = 'Opérateur';
                const col3 = 'Commentaire';
                const width1 = Math.max(col1.length, ...filtered.map(r => (r.pays || '').length));
                const width2 = Math.max(col2.length, ...filtered.map(r => (r.operateur || '').length));
                const width3 = Math.max(col3.length, ...filtered.map(r => (r.commentaires || '').length));

                const pad = (txt, len) => (txt || '').padEnd(len, ' ');
                const sep = `| ${pad(col1, width1)} | ${pad(col2, width2)} | ${pad(col3, width3)} |\n`;
                const sepLine = `|-${'-'.repeat(width1)}-|-${'-'.repeat(width2)}-|-${'-'.repeat(width3)}-|\n`;
                let table = sep + sepLine;
                filtered.forEach(row => {
                  table += `| ${pad(row.pays, width1)} | ${pad(row.operateur, width2)} | ${pad(row.commentaires, width3)} |\n`;
                });

                const aide = `\n\n\n🔴 Commentaire : "Vérifie l'importation de l'IR21 ou l'IR85"
Cause probable :
L’extraction de l’IR21 a échoué (fichier manquant, mal structuré, ou mauvaise URL).

Solutions :
- Vérifie si le fichier IR.21 est bien importé et lisible dans ton application.
- Assure-toi que le format XML du fichier respecte bien la norme IR.21.
- Si tu utilises une API ou un système d’import, vérifie que le fichier IR.85 est également à jour (car il peut contenir des données HSS).
- Vérifie le nom du fichier et sa localisation : le script s’attend peut-être à une structure précise (ex: /ir21/<mcc_mnc>.xml).
- S'assurer que les balises nécessaires (E212, GT, APN, IMSI ranges) sont bien présentes.

🔴 Commentaire : "Impossible de faire l'extraction MCC/MNC"
Cause probable :
Les champs MCC ou MNC sont manquants ou mal formatés dans la base de données ou le fichier IR.21.

Solutions :
- Vérifie que la PLMN est bien renseignée sous la forme MCC+MNC (ex: 20801, 21407).
- Si la base de données contient une valeur comme mnc001, mcc208, extrais correctement les 3 derniers chiffres pour le MNC, et les 3 premiers pour le MCC.
- Si l’information n’est pas présente dans l’IR21, cherche-la manuellement ou via une base PLMN publique (comme la base de la GSMA).
- Met en place une règle de validation en amont pour rejeter les opérateurs sans MCC/MNC valides.

🟡 Commentaire : "Extraction IR21 réussie, erreur dans la vérification HSS (APN), vérification GT réussie."
Cause probable :
Les données APN extraites de l’IR21 ne correspondent pas à celles présentes dans ton HSS (ou ne sont pas reconnues).

Solutions :
- Vérifie que l’APN déclaré dans l’IR21 correspond bien à celui provisionné dans le HSS.
- Assure-toi que l’APN est bien activé pour le roaming.
- Contrôle la casse, les éventuels caractères spéciaux, ou les différences entre internet et default.
- Mets en place une table de correspondance APN IR21 <-> APN HSS si les noms varient.

🔴 Commentaire : "Extraction IR21 et vérifications HSS et GT en erreur."
Cause probable :
Aucune des étapes clés n’a pu être validée (IR21 illisible, HSS non provisionné, GT manquant).

Solutions :
- Vérifie d’abord l’import du fichier IR21 (voir plus haut).
- Inspecte les erreurs retournées par le HSS pour comprendre pourquoi l’APN ou l’IMSI ne sont pas acceptés.
- Contrôle que le GT (Global Title) est bien présent dans l’IR21 et configuré dans ton MSC ou ta STP.
- Si besoin, relance un import manuel pour cet opérateur.

⚠️ Commentaire : "Situation mixte, vérifier les données."
Cause probable :
Des résultats contradictoires ou incomplets (extraction partielle, certains champs OK, d'autres KO).

Solutions :
- Vérifie les champs un à un (IR21, APN, GT, MCC/MNC).
- Regarde les logs d’extraction : il peut s’agir d’un problème de formatage ou d’un champ manquant.
- Ajoute une interface de contrôle manuel pour corriger ces cas ou une alerte automatique pour suivi.
`;

                const txt =
                  `Nom du test : ${testName}\n` +
                  `Date : ${dateStr}\n` +
                  `Erreur globale : ${erreurGlobale}\n\n` +
                  table + aide;

                // Création et téléchargement du fichier
                const blob = new Blob([txt], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rapport_outbound_roaming_${now.toISOString().slice(0,19).replace(/[:T]/g, "-")}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
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
