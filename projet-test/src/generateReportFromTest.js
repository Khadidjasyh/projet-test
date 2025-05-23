/**
 * Génère un rapport à partir d'un résultat de test de roaming.
 * @param {Object} testResult - Les données du test (ex: { test_id, partner_id, test_type, details, ... })
 * @returns {Object} - Un objet rapport prêt à être utilisé ou affiché.
 */
export function generateReportFromTest(testResult) {
  if (!testResult) return null;
  return {
    titre: `Rapport Test Roaming #${testResult.test_id}`,
    type: testResult.test_type || 'Roaming',
    date: testResult.date || new Date().toISOString(),
    partenaire: testResult.partner_id || null,
    details: testResult.details || {},
    resultat: testResult.passed ? 'Succès' : 'Échec',
    erreurs: testResult.error_count || 0,
    avertissements: testResult.warning_count || 0,
    commentaire: testResult.comment || '',
  };
}
