import React, { useState, useEffect } from 'react';

const CamelOutboundResults = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5178/camel-outbound-analyse');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(`Erreur lors du chargement des résultats: ${err.message}`);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(
    row =>
      (row.operateur && row.operateur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.pays && row.pays.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row["Valeur IR (IR.21/IR.85)"] && row["Valeur IR (IR.21/IR.85)"].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row["Valeur observée (anres_value)"] && row["Valeur observée (anres_value)"].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row["Résultat du test CAMEL Outbound"] && row["Résultat du test CAMEL Outbound"].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.Commentaire && row.Commentaire.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Génère une solution détaillée et créative selon le contexte du roaming outbound Mobilis
  function getCamelSolution(row) {
    if (row["Résultat du test CAMEL Outbound"] === "Réussi") {
      return (
        "✅ Test réussi :\n" +
        "- La configuration CAMEL Outbound est conforme entre IR.21/IR.85 et la valeur observée sur le réseau partenaire.\n" +
        "- L'abonné ATM Mobilis pourra utiliser les services à valeur ajoutée (ex : rechargement, contrôle de solde, services IN) à l'étranger sans restriction.\n" +
        "- Aucun correctif n'est nécessaire pour cet opérateur."
      );
    }
    if (row.Commentaire && row.Commentaire.includes("Mismatch")) {
      return (
        "❌ Mismatch détecté :\n" +
        "- La valeur CAMEL attendue (IR.21/IR.85) : " + (row["Valeur IR (IR.21/IR.85)"] || "Non renseignée") + "\n" +
        "- Valeur observée sur le réseau partenaire : " + (row["Valeur observée (anres_value)"] || "Non observée") + "\n" +
        "Actions recommandées :\n" +
        "• Vérifier que le fichier IR.21/IR.85 du partenaire est bien à jour et correctement importé.\n" +
        "• Contacter l'opérateur partenaire pour confirmer la configuration CAMEL sur leur HLR/HSS.\n" +
        "• S'assurer que la signalisation MAP/CAP est bien ouverte pour ATM Mobilis (vérifier les traces MAP si besoin).\n" +
        "• Si le partenaire ne supporte pas le même CAP version, demander une mise à jour ou adapter la configuration Mobilis."
      );
    }
    if (!row["Valeur IR (IR.21/IR.85)"]) {
      return (
        "⚠️ Donnée CAMEL Outbound absente dans IR.21/IR.85 :\n" +
        "- Impossible de valider la compatibilité CAMEL pour ce partenaire.\n" +
        "Actions recommandées :\n" +
        "• Demander à l'opérateur partenaire de fournir un IR.21/IR.85 à jour avec la section CAMEL renseignée.\n" +
        "• Vérifier que l'importation IR.21/IR.85 dans l'outil a bien fonctionné (format XML, balises présentes).\n" +
        "• Sans cette information, le roaming CAMEL ne peut être garanti pour les abonnés Mobilis."
      );
    }
    if (!row["Valeur observée (anres_value)"]) {
      return (
        "⚠️ Aucune valeur observée ANRES :\n" +
        "- Les logs MSS ne montrent pas de trafic CAMEL pour ce partenaire.\n" +
        "Actions recommandées :\n" +
        "• Vérifier que des abonnés ATM Mobilis ont bien tenté d'utiliser des services à valeur ajoutée sur ce réseau.\n" +
        "• S'assurer que les IMSI Mobilis sont bien provisionnés côté partenaire.\n" +
        "• Contrôler la collecte des logs MSS et la correspondance des IMSI dans la base Mobilis."
      );
    }
    return (
      "ℹ️ Cas particulier ou données incomplètes :\n" +
      "- Vérifier manuellement la cohérence des valeurs IR.21/IR.85 et ANRES.\n" +
      "- Consulter les équipes Roaming et IT pour une analyse approfondie.\n" +
      "- Ajouter une alerte de suivi si ce cas se répète."
    );
  }

  // Génération du rapport TXT
  const handleGenerateReport = async () => {
    if (filteredData.length === 0) return;

    try {
      let txtContent = 'Rapport Analyse CAMEL Outbound – Tests Outbound Roaming ATM Mobilis\n\n';

      filteredData.forEach(row => {
        txtContent += `Opérateur : ${row.operateur}\n`;
        txtContent += `Pays      : ${row.pays}\n`;
        txtContent += `Valeur CAMEL Outbound (IR.21/IR.85) : ${row["Valeur IR (IR.21/IR.85)"]}\n`;
        txtContent += `Valeur observée ANRES : ${row["Valeur observée (anres_value)"]}\n`;
        txtContent += `Résultat du test CAMEL Outbound : ${row["Résultat du test CAMEL Outbound"] === "Réussi" ? "✅" : "❌"}\n`;
        txtContent += `Commentaire : ${row.Commentaire}\n`;
        txtContent += `Solution / Recommandation :\n${getCamelSolution(row)}\n`;
        txtContent += '\n----------------------------------------\n\n';
      });

      txtContent +=
        "Légende :\n" +
        "✅ = Test réussi, aucune action requise\n" +
        "❌ = Test échoué, action requise\n" +
        "⚠️ = Attention, données manquantes ou incohérentes\n" +
        "ℹ️ = Information complémentaire\n\n" +
        "Ce rapport a été généré automatiquement pour faciliter le suivi de la qualité du roaming outbound des abonnés ATM Mobilis à l'étranger.\n" +
        "Pour toute anomalie, contacter l'équipe Roaming ou IT Mobilis.\n";

      // Création et téléchargement du fichier
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rapport_camel_outbound_analyse.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Préparation des données pour la sauvegarde dans la base de données
      const now = new Date();
      const reportData = {
        id: `AUD_CO_${now.getTime().toString().slice(-8)}`,
        test_id: 5,
        title: `Rapport CAMEL Outbound - ${now.toLocaleDateString()}`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: 'Système',
        total_operators: filteredData.length,
        total_issues: filteredData.filter(row => row["Résultat du test CAMEL Outbound"] !== 'Réussi').length,
        results_data: JSON.stringify(filteredData),
        solutions: JSON.stringify([
          "Vérifier que le fichier IR.21/IR.85 du partenaire est bien à jour et correctement importé.",
          "Contacter l'opérateur partenaire pour confirmer la configuration CAMEL sur leur HLR/HSS.",
          "S'assurer que la signalisation MAP/CAP est bien ouverte.",
          "Vérifier que des abonnés ATM Mobilis ont bien tenté d'utiliser des services à valeur ajoutée sur ce réseau."
        ]),
        validation_notes: `Total : ${filteredData.length}, Échoués : ${filteredData.filter(row => row["Résultat du test CAMEL Outbound"] !== 'Réussi').length}`
      };

      // Sauvegarde dans la base de données
      console.log('Envoi des données au serveur:', reportData);
      const response = await fetch('http://localhost:5178/audit-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Réponse du serveur:', errorData);
        throw new Error(`Erreur lors de la sauvegarde du rapport en base: ${errorData}`);
      }

      alert('Rapport généré, téléchargé et sauvegardé avec succès !');

    } catch (error) {
      console.error("Erreur lors de la génération/sauvegarde du rapport:", error);
      alert("Une erreur est survenue lors de la génération ou de la sauvegarde du rapport.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analyse CAMEL Outbound</h1>
          <p className="text-gray-600">Comparaison des valeurs IR.21/IR.85 et observées (anres_value)</p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          Générer rapport
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher par opérateur, pays, valeur IR, observée ou commentaire"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 bg-white"
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Opérateur</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Pays</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Valeur CAMEL Outbound (IR.21/IR.85)</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Valeur observée ANRES</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Résultat du test</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={row.operateur + row.pays + idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 border-b font-medium">{row.operateur}</td>
                  <td className="px-3 py-2 border-b">{row.pays}</td>
                  <td className="px-3 py-2 border-b text-center">{row["Valeur IR (IR.21/IR.85)"]}</td>
                  <td className="px-3 py-2 border-b text-center">{row["Valeur observée (anres_value)"]}</td>
                  <td className="px-3 py-2 border-b text-center">
                    {row["Résultat du test CAMEL Outbound"] === "Réussi" ? "✅" : "❌"}
                  </td>
                  <td className="px-3 py-2 border-b">{row.Commentaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 px-4">
            <span className="text-sm text-gray-700">Total: {filteredData.length} résultat(s)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CamelOutboundResults;