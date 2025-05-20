import React, { useState, useEffect } from 'react';
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

export default function RapportAudit() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    test_type: 'all',
    dateRange: ''
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'Réseau',
    description: '',
    test_id: '',
    correction_details: '',
    attachments: [],
    implemented_changes: null
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tests, setTests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reportsData, testsData, userData] = await Promise.all([
          AuditService.fetchAuditReports(),
          AuditService.fetchTestResults(),
          AuditService.getCurrentUser()
        ]);
        setReports(reportsData);
        setTests(testsData);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredReports = reports.filter(report => {
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && report.status !== filters.status) {
      return false;
    }
    if (filters.test_type !== 'all' && report.test_type !== filters.test_type) {
      return false;
    }
    if (filters.dateRange && !report.date.includes(filters.dateRange)) {
      return false;
    }
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Validé': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Rejeté': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'En cours': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getSeverityBadge = (count, severity) => {
    if (count === 0) return null;
    
    const colors = {
      critical: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[severity]}`}>
        {count} {severity}
      </span>
    );
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
      if (!newReport.test_id || !newReport.correction_details) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const selectedTest = tests.find(t => t.test_id === parseInt(newReport.test_id));
      
      const report = {
        id: `AUD-${new Date().getFullYear()}-${String(reports.length + 1).padStart(3, '0')}`,
        title: newReport.title,
        date: new Date().toISOString().split('T')[0],
        type: newReport.type,
        status: 'En cours',
        createdBy: currentUser.name,
        validatedBy: null,
        test_id: parseInt(newReport.test_id),
        correction_details: newReport.correction_details,
        findings: 0,
        critical: 0,
        medium: 0,
        low: 0,
        attachments: uploadedFiles.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        })),
        description: newReport.description,
        implemented_changes: null
      };

      setReports([...reports, report]);
      setShowNewReportModal(false);
      setNewReport({
        title: '',
        type: 'Réseau',
        description: '',
        test_id: '',
        correction_details: '',
        attachments: [],
        implemented_changes: null
      });
      setUploadedFiles([]);
    } catch (error) {
      console.error("Erreur lors de la création du rapport:", error);
    }
  };

  const handleUpdateReport = async (updatedStatus) => {
    if (!selectedReport) return;

    const updatedReport = {
      ...selectedReport,
      status: updatedStatus,
      validation_date: new Date().toISOString(),
      validated_by: {
        user_id: currentUser.user_id,
        name: currentUser.name,
        role: currentUser.role
      }
    };

    if (updatedStatus === 'Validé' && !selectedReport.implemented_changes) {
      updatedReport.implemented_changes = {
        config_id: tests.find(t => t.test_id === selectedReport.test_id)?.config_id || 0,
        changes: ['Changements implémentés selon correction proposée'],
        validation_notes: 'Validé par ' + currentUser.name
      };
    }

    const result = await AuditService.updateReport(updatedReport);
    setReports(reports.map(r => r.id === result.id ? result : r));
    setSelectedReport(result);
  };

  const handleDownloadReport = async (report) => {
    try {
      const response = await fetch(`http://localhost:5178/api/audit-reports/${report.id}/download`);
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du rapport');
      }
      
      // Récupérer le nom du fichier depuis les headers
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `rapport_${report.id}.txt`;

      // Créer un blob avec le contenu
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien temporaire pour le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du rapport');
    }
  };

  const renderReportDetails = (report) => {
    return (
      <div className="space-y-6">
        {/* En-tête du rapport */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Rapport du test : {report.test_type}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p>Date : {new Date(report.date).toLocaleDateString()}</p>
              <p>Heure : {report.time}</p>
            </div>
            <div>
              <p>Créé par : {report.created_by}</p>
              {report.validated_by && <p>Validé par : {report.validated_by}</p>}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Opérateurs</p>
              <p className="text-2xl font-bold text-gray-900">{report.total_operators}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Problèmes</p>
              <p className="text-2xl font-bold text-red-600">{report.total_issues}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">CAMEL</p>
              <p className="text-2xl font-bold text-yellow-600">{report.camel_issues}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">LTE</p>
              <p className="text-2xl font-bold text-blue-600">{report.lte_issues}</p>
            </div>
          </div>
        </div>

        {/* Résultats détaillés */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résultats détaillés</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pays</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opérateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Problèmes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.results_data.operators.map((op, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.operator}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {op.issues.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Solutions proposées */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Solutions proposées</h3>
          <ul className="list-disc pl-5 space-y-2">
            {report.solutions.map((solution, index) => (
              <li key={index} className="text-gray-600">{solution}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-600">Rapports d'Audit</h1>
            <p className="text-gray-600">Gestion et consultation des rapports d'audit technique</p>
          </div>
          <button 
            onClick={() => setShowNewReportModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Nouveau Rapport
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">Tous les statuts</option>
              <option value="Validé">Validé</option>
              <option value="En cours">En cours</option>
              <option value="Rejeté">Rejeté</option>
            </select>
            
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={filters.test_type}
              onChange={(e) => setFilters({...filters, test_type: e.target.value})}
            >
              <option value="all">Tous les types de test</option>
              <option value="Partenaires Roaming & Services">Partenaires Roaming & Services</option>
              <option value="Inbound Roaming">Inbound Roaming</option>
              <option value="Outbound Roaming">Outbound Roaming</option>
            </select>
            
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            />
          </div>
        </div>

        {/* Liste des rapports */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(report.date).toLocaleDateString()} à {report.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.status === 'Validé' ? 'bg-green-100 text-green-800' :
                        report.status === 'Rejeté' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Télécharger le rapport"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-green-600 hover:text-green-800"
                        title="Voir les détails"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Opérateurs</p>
                      <p className="text-lg font-semibold text-gray-900">{report.total_operators}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Problèmes</p>
                      <p className="text-lg font-semibold text-red-600">{report.total_issues}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">CAMEL</p>
                      <p className="text-lg font-semibold text-yellow-600">{report.camel_issues}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">LTE</p>
                      <p className="text-lg font-semibold text-blue-600">{report.lte_issues}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de détails */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-green-600">
                  Détails du Rapport: {selectedReport.id}
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                {renderReportDetails(selectedReport)}
              </div>
            </div>
          </div>
        )}

        {/* New Report Modal */}
        {showNewReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Nouveau Rapport d'Audit</h2>
                <button 
                  onClick={() => setShowNewReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Test associé (obligatoire)</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={newReport.test_id}
                    onChange={(e) => setNewReport({...newReport, test_id: e.target.value})}
                  >
                    <option value="">Sélectionner un test</option>
                    {tests.map(test => (
                      <option key={test.test_id} value={test.test_id}>
                        Test #{test.test_id} - {test.test_type} (Partenaire {test.partner_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={newReport.title}
                    onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={newReport.type}
                    onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                  >
                    <option value="Réseau">Réseau</option>
                    <option value="Service">Service</option>
                    <option value="Sécurité">Sécurité</option>
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows="4"
                    value={newReport.description}
                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
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
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowNewReportModal(false);
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
      </div>
    </div>
  );
}
