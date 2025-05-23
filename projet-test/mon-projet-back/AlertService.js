const AlertService = {
  deleteAlert: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'alerte:', error);
      throw error;
    }
  },
};

export default AlertService; 