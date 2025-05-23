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
  ArrowPathIcon,
  EyeIcon,
  TrashIcon,
  PaperClipIcon
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
    try {
      const response = await axios.get('http://localhost:5178/alerts');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      throw error;
    }
  },

  async createAlert(newAlert) {
    try {
      const response = await axios.post('http://localhost:5178/alerts', newAlert);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
      throw error;
    }
  },

  async updateAlertStatus(alertId, status) {
    try {
      const response = await axios.put(`http://localhost:5178/alerts/${alertId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  async addUserComment(alertId, comment) {
    try {
      const response = await axios.post(`http://localhost:5178/alerts/${alertId}/comment`, { comment });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      throw error;
    }
  },

  async deleteAlert(id) {
    try {
      await axios.delete(`http://localhost:5178/alerts/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'alerte:', error);
      throw error;
    }
  }
};

const UserService = {
  async getCurrentUser() {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) {
        throw new Error('Aucun utilisateur connecté');
      }

      const response = await fetch('http://localhost:5178/current-user', {
        headers: {
          'user-id': userData.id
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données utilisateur');
      }

      return response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }
};

const DeleteButton = ({ alertId, isDeleting, onDelete, currentUser }) => {
  console.log('DeleteButton render:', { currentUser, alertId });
  
  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <button
      onClick={() => onDelete(alertId)}
      disabled={isDeleting}
      className="hover:text-red-600"
      title="Supprimer"
    >
      <TrashIcon className="h-5 w-5 text-red-500" />
    </button>
  );
};

export default function Alertes() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all'
  });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    titre: '',
    envoye_par: '',
    severite: 'normal',
    date_limite: '',
    statut: 'non traité',
    commentaires: '',
    utilisateurs_concernes: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertFiles, setAlertFiles] = useState({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [alertsData, userData] = await Promise.all([
          AlertService.fetchAlerts(),
          UserService.getCurrentUser()
        ]);
        console.log('Données utilisateur:', userData);
        setAlerts(alertsData);
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
      if (!newAlert.titre || !newAlert.date_limite) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const alertToCreate = {
        ...newAlert,
        envoye_par: currentUser.name,
        date_envoi: new Date().toISOString()
      };

      const createdAlert = await AlertService.createAlert(alertToCreate);
      setAlerts([...alerts, createdAlert]);
      setShowNewAlertModal(false);
      setNewAlert({
        titre: '',
        envoye_par: '',
        severite: 'normal',
        date_limite: '',
        statut: 'non traité',
        commentaires: '',
        utilisateurs_concernes: ''
      });
      toast.success('Alerte créée avec succès');
    } catch (error) {
      toast.error("Erreur lors de la création de l'alerte");
    }
  };

  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5178/alerts/${alertId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      const updatedAlert = await response.json();
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? updatedAlert : alert
      ));
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleAddComment = async (alertId) => {
    if (!newComment.trim()) {
      toast.error('Le commentaire ne peut pas être vide');
      return;
    }

    setCommentLoading(true);
    try {
      const updatedAlert = await AlertService.addUserComment(alertId, newComment);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? updatedAlert : alert
      ));
      setNewComment('');
      toast.success('Commentaire ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDoubleClickComment = (alert) => {
    setEditingComment(alert.id);
    setEditingCommentText(alert.commentaires_utilisateur || '');
  };

  const handleCommentSave = async (alertId) => {
    try {
      const updatedAlert = await AlertService.addUserComment(alertId, editingCommentText);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? updatedAlert : alert
      ));
      setEditingComment(null);
      toast.success('Commentaire mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du commentaire');
    }
  };

  const handleCommentKeyDown = (e, alertId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSave(alertId);
    } else if (e.key === 'Escape') {
      setEditingComment(null);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5178/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'alerte');
      }

      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alerte supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'alerte:', error);
      toast.error('Erreur lors de la suppression de l\'alerte');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchAlertFiles = async (alertId) => {
    const res = await fetch(`http://localhost:5178/alerts/${alertId}/files`);
    const files = await res.json();
    setAlertFiles(prev => ({ ...prev, [alertId]: files }));
  };

  const handleFileUpload = async (e, alertId) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alertId', alertId);

    try {
    const response = await fetch('http://localhost:5178/alerts/upload', {
      method: 'POST',
      body: formData,
    });

      const data = await response.json();

    if (response.ok) {
      toast.success('Fichier attaché avec succès');
      fetchAlertFiles(alertId);
    } else {
        toast.error(data.error || 'Erreur lors de l\'upload du fichier');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload du fichier');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    console.log('Filtrage alerte:', alert); // Log pour déboguer
    if (searchTerm && !alert.titre.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.severity !== 'all' && alert.severite !== filters.severity) {
      return false;
    }
    if (filters.status !== 'all' && alert.statut !== filters.status) {
      return false;
    }
    // Suppression de la condition de filtrage par utilisateur pour les admins
    if (currentUser?.role !== 'admin') {
      const utilisateursConcernes = alert.utilisateurs_concernes ? alert.utilisateurs_concernes.split(',') : [];
      if (!utilisateursConcernes.includes(currentUser.name)) {
        return false;
      }
    }
    return true;
  });

  const getSeverityBadge = (severity) => {
    const colors = {
      critique: 'bg-red-100 text-red-800',
      urgent: 'bg-orange-100 text-orange-800',
      normal: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severity] || 'bg-gray-100 text-gray-800'}`}>
        {severity}
      </span>
    );
  };

  useEffect(() => {
    filteredAlerts.forEach(alert => {
      fetchAlertFiles(alert.id);
    });
    // eslint-disable-next-line
  }, [filteredAlerts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Alertes</h1>
            <p className="text-lg text-gray-600 mt-2">Gestion des alertes système</p>
          </div>
          <button 
            onClick={() => setShowNewAlertModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Nouvelle Alerte
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par titre..."
                className="pl-10 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.severity}
              onChange={(e) => setFilters({...filters, severity: e.target.value})}
            >
              <option value="all">Toutes les sévérités</option>
              <option value="critique">Critique</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="info">Info</option>
            </select>
            <select
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">Tous les statuts</option>
              <option value="traité">Traité</option>
              <option value="non traité">Non traité</option>
            </select>
          </div>
        </div>

        {/* Tableau des alertes */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ArrowPathIcon className="h-12 w-12 text-green-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Envoyé par</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sévérité</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'envoi</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date limite</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateurs concernés</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaires</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{alert.titre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.envoye_par}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getSeverityBadge(alert.severite)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(alert.date_envoi).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(alert.date_limite).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{alert.utilisateurs_concernes || 'Non spécifié'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${alert.statut === 'traité' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{alert.statut}</span>
                      </td>
                      <td 
                        className="px-6 py-4 text-sm text-gray-500 cursor-pointer min-w-[120px]"
                        onDoubleClick={() => handleDoubleClickComment(alert)}
                      >
                        {editingComment === alert.id ? (
                          <div className="relative">
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              onKeyDown={(e) => handleCommentKeyDown(e, alert.id)}
                              autoFocus
                              rows="3"
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingComment(null);
                                }}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentSave(alert.id);
                                }}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Sauvegarder
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="min-h-[60px]">
                            {alert.commentaires_utilisateur || 'Double-cliquez pour ajouter un commentaire'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[240px]">
                        <div className="flex flex-nowrap items-center gap-2">
                          <button
                            onClick={() => setSelectedAlert(alert)}
                            className="hover:text-blue-600 transition-colors duration-200"
                            title="Voir"
                          >
                            <EyeIcon className="h-5 w-5 text-blue-500" />
                          </button>
                          {alert.statut !== 'traité' && (
                            <button
                              onClick={() => handleUpdateStatus(alert.id, 'traité')}
                              className="hover:text-green-600 transition-colors duration-200"
                              title="Marquer comme traité"
                            >
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            </button>
                          )}
                          <DeleteButton
                            alertId={alert.id}
                            isDeleting={isDeleting}
                            onDelete={handleDeleteAlert}
                            currentUser={currentUser}
                          />
                          <button
                            className="hover:text-indigo-600 transition-colors duration-200"
                            title="Attacher un fichier"
                            onClick={() => document.getElementById(`file-upload-${alert.id}`).click()}
                          >
                            <PaperClipIcon className="h-5 w-5 text-indigo-500" />
                            <input
                              id={`file-upload-${alert.id}`}
                              type="file"
                              accept=".txt,.pdf,.xls,.xlsx"
                              style={{ display: 'none' }}
                              onChange={e => handleFileUpload(e, alert.id)}
                            />
                          </button>
                        </div>
                        {alertFiles[alert.id]?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {alertFiles[alert.id].map(file => (
                              <a
                                key={file.id}
                                href={`http://localhost:5178/uploads/${file.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 underline flex items-center gap-1"
                                title={file.file_name}
                              >
                                <PaperClipIcon className="h-4 w-4" />
                                {file.file_name}
                              </a>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                      Aucune alerte trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de détails d'alerte */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de l'Alerte #{selectedAlert.id}
                </h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Générales</h3>
                    <div className="space-y-4">
                      <p><span className="font-medium">Titre:</span> {selectedAlert.titre}</p>
                      <p><span className="font-medium">Envoyé par:</span> {selectedAlert.envoye_par}</p>
                      <p><span className="font-medium">Sévérité:</span> {getSeverityBadge(selectedAlert.severite)}</p>
                      <p><span className="font-medium">Date d'envoi:</span> {new Date(selectedAlert.date_envoi).toLocaleString()}</p>
                      <p><span className="font-medium">Date limite:</span> {new Date(selectedAlert.date_limite).toLocaleString()}</p>
                      <p><span className="font-medium">Utilisateurs concernés:</span> {selectedAlert.utilisateurs_concernes || 'Non spécifié'}</p>
                      <p>
                        <span className="font-medium">Statut:</span> 
                        <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          selectedAlert.statut === 'traité' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedAlert.statut}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Commentaires</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 whitespace-pre-wrap">{selectedAlert.commentaires || 'Aucun commentaire'}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-md font-medium text-gray-900 mb-2">Ajouter un commentaire</h4>
                        <textarea
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Écrivez votre commentaire ici..."
                          rows="3"
                        />
                        <button
                          onClick={() => handleAddComment(selectedAlert.id)}
                          disabled={commentLoading}
                          className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                          {commentLoading ? 'Envoi...' : 'Ajouter le commentaire'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-4">
                  {selectedAlert.statut !== 'traité' && (
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedAlert.id, 'traité');
                        setSelectedAlert(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      Marquer comme traité
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de création d'alerte */}
        {showNewAlertModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="flex justify-between items-center border-b p-6">
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Alerte</h2>
                <button
                  onClick={() => setShowNewAlertModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre *
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newAlert.titre}
                      onChange={(e) => setNewAlert({...newAlert, titre: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Envoyé par *
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newAlert.envoye_par}
                      onChange={(e) => setNewAlert({...newAlert, envoye_par: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sévérité
                    </label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newAlert.severite}
                      onChange={(e) => setNewAlert({...newAlert, severite: e.target.value})}
                    >
                      <option value="critique">Critique</option>
                      <option value="urgent">Urgent</option>
                      <option value="normal">Normal</option>
                      <option value="info">Info</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date limite *
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newAlert.date_limite}
                      onChange={(e) => setNewAlert({...newAlert, date_limite: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Utilisateurs concernés
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newAlert.utilisateurs_concernes}
                      onChange={(e) => setNewAlert({...newAlert, utilisateurs_concernes: e.target.value})}
                      placeholder="Séparés par des virgules"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commentaires
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newAlert.commentaires}
                      onChange={(e) => setNewAlert({...newAlert, commentaires: e.target.value})}
                      rows="4"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowNewAlertModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateAlert}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    Créer l'alerte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}