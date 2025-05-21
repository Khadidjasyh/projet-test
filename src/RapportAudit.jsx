import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { 
  DocumentTextIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowDownTrayIcon as DownloadIcon,
  ChevronUpDownIcon as SortIcon,
  FunnelIcon as FilterIcon,
  PrinterIcon,
  EyeIcon,
  PencilSquareIcon as EditIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XMarkIcon,
  PaperClipIcon,
  UserCircleIcon,
  CheckBadgeIcon,
  TrashIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Service simulé pour les données d'audit
const AuditService = {
  async fetchAuditReports() {
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'AUD-2024-001',
        title: 'Audit Partenaires Roaming & Services',
        test_type: 'Partenaires Roaming & Services',
        date: '2024-05-19',
        time: '18:39:15',
        status: 'Validé',
        created_by: 'Khadidja Sayah',
        validated_by: 'Lyna Nemiri',
        total_operators: 150,
        total_issues: 45,
        camel_issues: 20,
        gprs_issues: 15,
        threeg_issues: 25,
        lte_issues: 30,
        results_data: {
          operators: [
            {
              country: 'Afghanistan',
              operator: 'Telecom Development Company Afghanistan Ltd.',
              issues: ['CAMEL non disponible', 'GPRS non disponible', 'TROISG non disponible', 'LTE non disponible']
            },
            // ... autres opérateurs
          ]
        },
        solutions: [
          'Activer CAMEL chez les partenaires prioritaires',
          'Pour permettre le roaming des clients prépayés',
          'Lancer des tests de validation avec ces opérateurs',
          'Étendre la couverture Data (GPRS/3G/4G/LTE)',
          'Prioriser les pays à fort trafic ou à potentiel élevé'
        ],
        attachments: [
          { name: 'Rapport_Complet.pdf', type: 'PDF', size: '2.4 MB' },
          { name: 'Annexes_Techniques.zip', type: 'Archive', size: '5.1 MB' }
        ],
        validation_notes: 'Rapport validé après vérification des données',
        implemented_changes: 'Mise à jour des accords avec les opérateurs prioritaires'
      },
      // ... autres rapports
    ];
  },

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
        ran_by: 1
      },
      // ... add more test results ...
    ];
  },

  async getCurrentUser() {
    return {
      user_id: 1,
      name: 'Admin User',
      role: 'Admin',
      permissions: [
        { resource_type: 'Report', access_level: 'Admin' }
      ]
    };
  },

  async updateReport(updatedReport) {
    console.log('Updating report:', updatedReport);
    return updatedReport;
  }
};

const RapportAudit = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    test_id: '',
    description: '',
    correction_details: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0],
    status: 'En cours',
    created_by: '',
    validated_by: null,
    total_operators: 0,
    total_issues: 0,
    camel_issues: 0,
    gprs_issues: 0,
    threeg_issues: 0,
    lte_issues: 0,
    results_data: [],
    solutions: [],
    attachments: [],
    validation_notes: null,
    implemented_changes: null,
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tests, setTests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reportsData, testsData, userData] = await Promise.all([
          fetchReports(),
          fetch('http://localhost:5178/tests').then(res => res.json()),
          fetch('http://localhost:5178/current-user').then(res => res.json()),
        ]);
        setReports(reportsData);
        setTests(testsData);
        setCurrentUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement des données initiales:", error);
        setError("Erreur lors du chargement des données.");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5178/audit-reports');
      if (!response.ok) throw new Error('Erreur lors de la récupération des rapports');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      throw error;
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedReports = () => {
    if (!sortConfig.key) return reports;

    return [...reports].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getFilteredReports = () => {
    return getSortedReports().filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.test_id.toString().includes(searchTerm);
      const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const handleDownload = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:5178/audit-reports/${reportId}/download`);
      if (!response.ok) throw new Error('Erreur lors du téléchargement');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du rapport');
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) return;

    try {
      const response = await fetch(`http://localhost:5178/audit-reports/${reportId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setReports(reports.filter(report => report.id !== reportId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du rapport');
    }
  };

  const handleValidate = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:5178/audit-reports/${reportId}/validate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          validated_by: 'Admin',
          status: 'validated'
        })
      });
      if (!response.ok) throw new Error('Erreur lors de la validation');
      setReports(reports.map(report =>
        report.id === reportId
          ? { ...report, status: 'validated', validated_by: 'Admin' }
          : report
      ));
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      alert('Erreur lors de la validation du rapport');
    }
  };
    
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleCreateReport = async () => {
    try {
      if (!newReport.test_id || !newReport.title || !newReport.correction_details) {
        alert('Veuillez remplir au moins le Test associé, le Titre et les Détails de correction.');
        return;
      }

      const reportToCreate = {
        id: `AUD_${Date.now()}`,
        test_id: parseInt(newReport.test_id),
        title: newReport.title,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: currentUser ? currentUser.name : 'Inconnu',
        validated_by: null,
        total_operators: newReport.total_operators,
        total_issues: newReport.total_issues,
        camel_issues: newReport.camel_issues,
        gprs_issues: newReport.gprs_issues,
        threeg_issues: newReport.threeg_issues,
        lte_issues: newReport.lte_issues,
        results_data: newReport.results_data,
        solutions: newReport.solutions,
        attachments: uploadedFiles.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        })),
        validation_notes: newReport.validation_notes,
        implemented_changes: newReport.implemented_changes,
        description: newReport.description,
        correction_details: newReport.correction_details
      };

      const response = await fetch('http://localhost:5178/audit-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportToCreate)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du rapport sur le serveur');
      }

      const createdReport = await response.json();
      console.log('Rapport créé avec succès:', createdReport);

      const updatedReportsList = await fetchReports();
      setReports(updatedReportsList);
      setShowNewReportModal(false);
      setNewReport({
        title: '',
        test_id: '',
        description: '',
        correction_details: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: '',
        validated_by: null,
        total_operators: 0,
        total_issues: 0,
        camel_issues: 0,
        gprs_issues: 0,
        threeg_issues: 0,
        lte_issues: 0,
        results_data: [],
        solutions: [],
        attachments: [],
        validation_notes: null,
        implemented_changes: null,
      });
      setUploadedFiles([]);

    } catch (error) {
      console.error("Erreur lors de la création du rapport:", error);
      alert("Erreur lors de la création du rapport. " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Rapports d'Audit</h1>
            <p className="text-green-600 text-lg max-w-2xl">
              Gestion et suivi des rapports d'audit de roaming
            </p>
          </div>
          <button 
            onClick={() => setShowNewReportModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Nouveau Rapport
          </button>
        </div>
      </motion.div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un rapport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            </div>
            
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <FaFilter />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="validated">Validé</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Titre</span>
                    {sortConfig.key === 'title' && (
                      sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortConfig.key === 'date' && (
                      sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
          </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Statut</span>
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                    </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Problèmes
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredReports().map((report) => (
                <React.Fragment key={report.id}>
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedReportId(expandedReportId === report.id ? null : report.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.date}</div>
                      <div className="text-sm text-gray-500">{report.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(report.status)}`}>
                        {report.status === 'validated' ? 'Validé' :
                         report.status === 'En cours' ? 'En cours' :
                         report.status === 'rejected' ? 'Rejeté' : report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {report.total_issues > 0 ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {report.total_issues} Problème{report.total_issues > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Aucun problème
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                      <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(report.id); }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Télécharger"
                      >
                          <FaDownload />
                      </button>
                      <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                      >
                          <FaTrash />
                      </button>
                    </div>
                    </td>
                  </tr>
                  {expandedReportId === report.id && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="text-sm text-gray-800">
                          <h3 className="text-lg font-semibold mb-2">Détails du Rapport</h3>
                          
                          {report.results_data && report.results_data.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-1">Résultats Détaillés:</h4>
                              <ul className="list-disc list-inside">
                                {report.results_data.map((result, idx) => (
                                  <li key={idx}>
                                    Pays: {result.country}, Opérateur: {result.operator}, PLMN: {result.plmn} - Problèmes: {result.issues.join(', ' || 'Aucun')}
                                  </li>
                                ))}
                              </ul>
                  </div>
                          )}

                          {report.solutions && report.solutions.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-1">Solutions Proposées:</h4>
                              <ul className="list-disc list-inside">
                                {report.solutions.map((solution, idx) => (
                                  <li key={idx}>{solution}</li>
                                ))}
                              </ul>
          </div>
        )}

                          {report.validation_notes && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-1">Notes de Validation:</h4>
                              <p>{report.validation_notes}</p>
              </div>
                          )}

                          {report.implemented_changes && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-1">Changements Implémentés:</h4>
                              <p>{report.implemented_changes}</p>
          </div>
        )}

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {showNewReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Créer un Nouveau Rapport d'Audit</h2>
                <button 
                  onClick={() => setShowNewReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre (obligatoire)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={newReport.title}
                  onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                  required
                />
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Test associé (obligatoire)</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={newReport.test_id}
                    onChange={(e) => setNewReport({...newReport, test_id: e.target.value})}
                  required
                  >
                    <option value="">Sélectionner un test</option>
                    {tests.map(test => (
                    <option key={test.id} value={test.id}>
                       Test #{test.id} - {test.name || test.description} 
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Détails de correction proposés (obligatoire)</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows="4"
                    value={newReport.correction_details}
                    onChange={(e) => setNewReport({...newReport, correction_details: e.target.value})}
                    placeholder="Décrire en détail les corrections proposées..."
                  required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows="4"
                    value={newReport.description}
                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                   placeholder="Brève description du rapport..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pièces jointes</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                        >
                          <span>Télécharger des fichiers</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, XLS, TXT, ou tout autre type de fichier
                      </p>
                    </div>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.type} • {file.size}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
            <div className="mt-6 flex justify-end space-x-3 border-t p-4">
                <button
                  onClick={() => {
                    setShowNewReportModal(false);
                  setNewReport({
                    title: '',
                    test_id: '',
                    description: '',
                    correction_details: '',
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toTimeString().split(' ')[0],
                    status: 'En cours',
                    created_by: '',
                    validated_by: null,
                    total_operators: 0,
                    total_issues: 0,
                    camel_issues: 0,
                    gprs_issues: 0,
                    threeg_issues: 0,
                    lte_issues: 0,
                    results_data: [],
                    solutions: [],
                    attachments: [],
                    validation_notes: null,
                    implemented_changes: null,
                  });
                    setUploadedFiles([]);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}
    </motion.div>
  );
};

export const generateReportFromTest = async (testResults) => {
  try {
    // Calculer les statistiques
    const totalOperators = testResults.operators.length;
    const totalIssues = testResults.operators.reduce((acc, op) => acc + op.issues.length, 0);
    const criticalIssues = testResults.operators.filter(op => op.issues.length > 2).length;
    const majorIssues = testResults.operators.filter(op => op.issues.length === 2).length;
    const minorIssues = testResults.operators.filter(op => op.issues.length === 1).length;

    // Construire l'objet du rapport
    const report = {
      test_id: testResults.test_id,
      title: `Rapport d'audit - ${testResults.test_type}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      status: 'pending',
      created_by: 'Admin',
      validated_by: '',
      critical_issues: criticalIssues,
      major_issues: majorIssues,
      minor_issues: minorIssues,
      results_data: {
        total_operators: totalOperators,
        total_issues: totalIssues,
        operators: testResults.operators
      },
      solutions: [
        "Vérifier les accords de roaming avec les opérateurs concernés",
        "Mettre à jour les configurations des services manquants",
        "Planifier des tests de validation après les corrections"
      ],
      attachments: []
    };

    // Sauvegarder le rapport dans la base de données
    const response = await fetch('http://localhost:5178/audit-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(report)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde du rapport');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};

export default RapportAudit;
