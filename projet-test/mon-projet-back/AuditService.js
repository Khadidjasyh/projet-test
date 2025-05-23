const API_URL = 'http://localhost:5178';

export const AuditService = {
  // Récupérer tous les rapports
  async getAllReports() {
    try {
      const response = await fetch(`${API_URL}/audit-reports`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des rapports');
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Récupérer un rapport spécifique
  async getReport(id) {
    try {
      const response = await fetch(`${API_URL}/audit-reports/${id}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération du rapport');
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Créer un nouveau rapport
  async createReport(report) {
    try {
      const response = await fetch(`${API_URL}/audit-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
      if (!response.ok) throw new Error('Erreur lors de la création du rapport');
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Mettre à jour un rapport
  async updateReport(id, report) {
    try {
      const response = await fetch(`${API_URL}/audit-reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du rapport');
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Supprimer un rapport
  async deleteReport(id) {
    try {
      const response = await fetch(`${API_URL}/audit-reports/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du rapport');
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Valider un rapport
  async validateReport(id, validator) {
    try {
      const response = await fetch(`${API_URL}/audit-reports/${id}/validate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ validated_by: validator, status: 'validated' })
      });
      if (!response.ok) throw new Error('Erreur lors de la validation du rapport');
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Télécharger un rapport
  async downloadReport(id) {
    try {
      const response = await fetch(`${API_URL}/audit-reports/${id}/download`);
      if (!response.ok) throw new Error('Erreur lors du téléchargement du rapport');
      return await response.blob();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Récupérer les données de la situation globale
  async getSituationGlobale() {
    try {
      const response = await fetch(`${API_URL}/situation-globale`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des données');
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  }
}; 