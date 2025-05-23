import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  XCircleIcon,
  BellAlertIcon,
  UserCircleIcon,
  XMarkIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Services de simulation
const TestService = {
  async fetchTestResults() {
    return [
      {
        test_id: 101,
        partner_id: 1,
        config_id: 201,
        test_type: 'Inbound',
        details: { 
          missing_gt: ["306935226000"],
          failed_checks: ['SCCP Route', 'IMSI Conversion']
        },
        passed: false,
        error_count: 2,
        warning_count: 1,
        date: '2024-02-05T14:30:00',
        ran_by: {
          user_id: 1,
          name: 'Admin User',
          role: 'Admin'
        }
      },
      
    ];
  }
};

const AlertService = {
  async fetchAlerts() {
    return [
      {
        alert_id: 1,
        test_id: 101,
        severity: 'Critique',
        description: 'Échec de routage SCCP vers le partenaire XYZ - GT manquante',
        auto_generated: true,
        resolved: false,
        created_at: '2024-02-05T14:30:00',
        resolution_deadline: '2024-02-12T14:30:00',
        assigned_to: {
          user_id: 1,
          name: 'Admin User',
          role: 'Admin'
        },
        audit_details: {
          audit_id: 'AUD-2024-001',
          findings: ['GT manquante dans la table de routage', 'Configuration DNS incorrecte'],
          recommendations: ['Ajouter la GT 306935226000', 'Mettre à jour la configuration DNS']
        }
      },
      
    ];
  },

  async fetchUsers() {
    return [
      {
        user_id: 1,
        name: 'Admin User',
        role: 'Admin'
      },
      
    ];
  },

  async createManualAlert(newAlert) {
    console.log('Creating manual alert:', newAlert);
    return {
      ...newAlert,
      alert_id: Math.floor(Math.random() * 1000) + 100,
      created_at: new Date().toISOString(),
      auto_generated: false
    };
  },

  async resolveAlert(alertId) {
    console.log('Resolving alert:', alertId);
    return true;
  }
};

const UserService = {
  async getCurrentUser() {
    return {
      user_id: 1,
      name: 'Admin User',
      role: 'Admin',
      permissions: [
        { resource_type: 'Alert', access_level: 'Admin' }
      ]
    };
  }
};

export default function Alertes() {
  const [testResults, setTestResults] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    severity: 'all'
  });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    description: '',
    severity: 'Urgent',
    assigned_to: '',
    resolution_deadline: '',
    instructions: ''
  });

  useEffect(() => {
    console.log('Composant Alertes monté');
    async function loadData() {
      setLoading(true);
      try {
        console.log('Chargement des données...');
        const [resultsData, alertsData, usersData, userData] = await Promise.all([
          TestService.fetchTestResults(),
          AlertService.fetchAlerts(),
          AlertService.fetchUsers(),
          UserService.getCurrentUser()
        ]);
        console.log('Données chargées:', { resultsData, alertsData, usersData, userData });
        setTestResults(resultsData);
        setAlerts(alertsData);
        setUsers(usersData);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateAlert = async () => {
    try {
      if (!newAlert.description || !newAlert.assigned_to || !newAlert.resolution_deadline) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const selectedUser = users.find(u => u.user_id === parseInt(newAlert.assigned_to));
      
      const alertToCreate = {
        ...newAlert,
        assigned_to: {
          user_id: selectedUser.user_id,
          name: selectedUser.name,
          role: selectedUser.role
        },
        manual_details: {
          created_by: {
            user_id: currentUser.user_id,
            name: currentUser.name,
            role: currentUser.role
          },
          instructions: newAlert.instructions,
          priority: 'High'
        }
      };

      const createdAlert = await AlertService.createManualAlert(alertToCreate);
      setAlerts([...alerts, createdAlert]);
      setShowNewAlertModal(false);
      setNewAlert({
        description: '',
        severity: 'Urgent',
        assigned_to: '',
        resolution_deadline: '',
        instructions: ''
      });
      toast.success('Alerte créée avec succès');
    } catch (error) {
      console.error("Erreur lors de la création de l'alerte:", error);
      toast.error("Erreur lors de la création de l'alerte");
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await AlertService.resolveAlert(alertId);
      setAlerts(alerts.map(alert => 
        alert.alert_id === alertId ? { ...alert, resolved: true } : alert
      ));
      if (selectedAlert?.alert_id === alertId) {
        setSelectedAlert({ ...selectedAlert, resolved: true });
      }
      toast.success('Alerte marquée comme résolue');
    } catch (error) {
      console.error("Erreur lors de la résolution de l'alerte:", error);
      toast.error("Erreur lors de la résolution de l'alerte");
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (searchTerm && !alert.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && alert.auto_generated !== (filters.type === 'auto')) {
      return false;
    }
    if (filters.status !== 'all' && alert.resolved !== (filters.status === 'resolved')) {
      return false;
    }
    if (filters.severity !== 'all' && alert.severity !== filters.severity) {
      return false;
    }
    return true;
  });

  const getSeverityBadge = (severity) => {
    const colors = {
      Critique: 'bg-red-100 text-red-800',
      Urgent: 'bg-orange-100 text-orange-800',
      Normal: 'bg-yellow-100 text-yellow-800',
      Info: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severity] || 'bg-gray-100 text-gray-800'}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Alertes</h1>
            <p className="text-lg text-gray-600 mt-2">Gestion des alertes automatiques et manuelles</p>
          </div>
          {currentUser?.permissions?.some(p => p.resource_type === 'Alert' && p.access_level === 'Admin') && (
            <button 
              onClick={() => setShowNewAlertModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Nouvelle Alerte
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">Tous les types</option>
              <option value="auto">Automatiques</option>
              <option value="manual">Manuelles</option>
            </select>
            
            <select
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">Tous les statuts</option>
              <option value="resolved">Résolues</option>
              <option value="unresolved">Non résolues</option>
            </select>
            
            <select
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.severity}
              onChange={(e) => setFilters({...filters, severity: e.target.value})}
            >
              <option value="all">Toutes les sévérités</option>
              <option value="Critique">Critique</option>
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
              <option value="Info">Info</option>
            </select>
          </div>
        </div>

        {/* Tableau des alertes */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ArrowPathIcon className="h-12 w-12 text-green-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sévérité
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigné à
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <tr key={alert.alert_id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {alert.alert_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{alert.description}</div>
                        <div className="text-gray-500 text-xs">
                          Créé le: {new Date(alert.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alert.auto_generated ? 'Automatique' : 'Manuelle'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSeverityBadge(alert.severity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                          {alert.assigned_to.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          alert.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.resolved ? 'Résolue' : 'En cours'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="text-green-600 hover:text-green-800 mr-4 transition-colors duration-200"
                        >
                          Détails
                        </button>
                        {!alert.resolved && currentUser?.permissions?.some(p => p.resource_type === 'Alert' && ['Admin', 'Write'].includes(p.access_level)) && (
                          <button
                            onClick={() => handleResolveAlert(alert.alert_id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            Résoudre
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucune alerte trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de création d'alerte */}
        {showNewAlertModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Alerte</h2>
                <button 
                  onClick={() => setShowNewAlertModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    value={newAlert.description}
                    onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                    placeholder="Décrire l'alerte..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sévérité</label>
                  <select
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newAlert.severity}
                    onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                  >
                    <option value="Critique">Critique</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Normal">Normal</option>
                    <option value="Info">Info</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigner à *</label>
                  <select
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newAlert.assigned_to}
                    onChange={(e) => setNewAlert({...newAlert, assigned_to: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    {users.map(user => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date limite *</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newAlert.resolution_deadline}
                    onChange={(e) => setNewAlert({...newAlert, resolution_deadline: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                  <textarea
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    value={newAlert.instructions}
                    onChange={(e) => setNewAlert({...newAlert, instructions: e.target.value})}
                    placeholder="Instructions pour la résolution..."
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowNewAlertModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateAlert}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détails d'alerte */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de l'Alerte #{selectedAlert.alert_id}
                </h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Générales</h3>
                    <div className="space-y-4">
                      <p><span className="font-medium">Description:</span> {selectedAlert.description}</p>
                      <p><span className="font-medium">Type:</span> {selectedAlert.auto_generated ? 'Automatique' : 'Manuelle'}</p>
                      <p><span className="font-medium">Sévérité:</span> {getSeverityBadge(selectedAlert.severity)}</p>
                      <p><span className="font-medium">Créée le:</span> {new Date(selectedAlert.created_at).toLocaleString()}</p>
                      <p><span className="font-medium">Date limite:</span> {new Date(selectedAlert.resolution_deadline).toLocaleString()}</p>
                      <p><span className="font-medium">Assignée à:</span> {selectedAlert.assigned_to.name}</p>
                      <p>
                        <span className="font-medium">Statut:</span> 
                        <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          selectedAlert.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedAlert.resolved ? 'Résolue' : 'En cours'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {selectedAlert.auto_generated ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Détails de l'Audit</h3>
                      <div className="space-y-4">
                        <p><span className="font-medium">ID Audit:</span> {selectedAlert.audit_details.audit_id}</p>
                        <div>
                          <p className="font-medium mb-2">Problèmes identifiés:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            {selectedAlert.audit_details.findings.map((finding, i) => (
                              <li key={i} className="text-gray-600">{finding}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-2">Recommandations:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            {selectedAlert.audit_details.recommendations.map((rec, i) => (
                              <li key={i} className="text-gray-600">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Détails Manuel</h3>
                      <div className="space-y-4">
                        <p><span className="font-medium">Créée par:</span> {selectedAlert.manual_details.created_by.name}</p>
                        <p><span className="font-medium">Priorité:</span> {selectedAlert.manual_details.priority}</p>
                        <div>
                          <p className="font-medium mb-2">Instructions:</p>
                          <p className="text-gray-600 whitespace-pre-wrap">{selectedAlert.manual_details.instructions}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 border-t pt-6">
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Fermer
                  </button>
                  {!selectedAlert.resolved && currentUser?.permissions?.some(p => p.resource_type === 'Alert' && ['Admin', 'Write'].includes(p.access_level)) && (
                    <button
                      onClick={() => handleResolveAlert(selectedAlert.alert_id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
                    >
                      Marquer comme résolue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}