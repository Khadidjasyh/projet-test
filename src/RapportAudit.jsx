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
  TrashIcon
} from '@heroicons/react/24/outline';

// Service simulé pour les données d'audit
const AuditService = {
  async fetchAuditReports() {
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'AUD-2023-001',
        title: 'Audit Routage International',
        date: '2023-10-15',
        type: 'Réseau',
        status: 'Validé',
        createdBy: 'Khadidja Sayah',
        validatedBy: 'Lyna Nemiri',
        findings: 12,
        critical: 3,
        medium: 5,
        low: 4,
        attachments: [
          { name: 'Rapport_Complet.pdf', type: 'PDF', size: '2.4 MB' },
          { name: 'Annexes_Techniques.zip', type: 'Archive', size: '5.1 MB' }
        ]
      },
      {
        id: 'AUD-2023-002',
        title: 'Contrôle Qualité SMS',
        date: '2023-11-02',
        type: 'Service',
        status: 'En cours',
        createdBy: 'Yasmine Serial',
        validatedBy: null,
        findings: 8,
        critical: 1,
        medium: 4,
        low: 3,
        attachments: [
          { name: 'Rapport_Intermediaire.docx', type: 'Document', size: '1.2 MB' }
        ]
      },
      {
        id: 'AUD-2023-003',
        title: 'Audit Sécurité GGSN',
        date: '2023-09-28',
        type: 'Sécurité',
        status: 'Rejeté',
        createdBy: 'Hadil Khelif',
        validatedBy: 'Yasmine Bechafi',
        findings: 15,
        critical: 5,
        medium: 6,
        low: 4,
        attachments: [
          { name: 'Rapport_Initial.pdf', type: 'PDF', size: '3.0 MB' },
          { name: 'Preuves.zip', type: 'Archive', size: '8.7 MB' }
        ]
      },
      {
        id: 'AUD-2023-004',
        title: 'Vérification Roaming Data',
        date: '2023-12-10',
        type: 'Réseau',
        status: 'Validé',
        createdBy: 'Lyna Nemiri',
        validatedBy: 'Khadidja Sayah',
        findings: 7,
        critical: 0,
        medium: 3,
        low: 4,
        attachments: [
          { name: 'Rapport_Final.pdf', type: 'PDF', size: '1.8 MB' },
          { name: 'Logs_Analyse.log', type: 'Log', size: '4.2 MB' }
        ]
      }
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
    type: 'all',
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
    // Filtre par terme de recherche
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtre par statut
    if (filters.status !== 'all' && report.status !== filters.status) {
      return false;
    }
    
    // Filtre par type
    if (filters.type !== 'all' && report.type !== filters.type) {
      return false;
    }
    
    // Filtre par date
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
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">Tous les types</option>
              <option value="Réseau">Réseau</option>
              <option value="Service">Service</option>
              <option value="Sécurité">Sécurité</option>
            </select>
            
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            />
          </div>
        </div>

        {/* Tableau des rapports */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      ID
                      <SortIcon className="ml-1 h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Findings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{report.title}</div>
                      <div className="text-gray-500">Créé par: {report.createdBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {getSeverityBadge(report.critical, 'critical')}
                        {getSeverityBadge(report.medium, 'medium')}
                        {getSeverityBadge(report.low, 'low')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{report.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-green-600 hover:text-green-900"
                          title="Voir détails"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Télécharger"
                        >
                          <DownloadIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Imprimer"
                        >
                          <PrinterIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de détails */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-green-600">
                  Détails du Rapport: {selectedReport.id}
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Informations Générales</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Titre:</span> {selectedReport.title}</p>
                      <p><span className="font-medium">Type:</span> {selectedReport.type}</p>
                      <p><span className="font-medium">Date:</span> {new Date(selectedReport.date).toLocaleDateString()}</p>
                      <p><span className="font-medium">Créé par:</span> {selectedReport.createdBy}</p>
                      {selectedReport.validatedBy && (
                        <p><span className="font-medium">Validé par:</span> {selectedReport.validatedBy}</p>
                      )}
                      <p><span className="font-medium">Test associé:</span> Test #{selectedReport.test_id}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Statistiques</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Total Findings:</span> {selectedReport.findings}</p>
                      <div className="flex flex-wrap gap-2">
                        {getSeverityBadge(selectedReport.critical, 'critical')}
                        {getSeverityBadge(selectedReport.medium, 'medium')}
                        {getSeverityBadge(selectedReport.low, 'low')}
                      </div>
                      <p>
                        <span className="font-medium">Statut:</span> 
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedReport.status === 'Validé' ? 'bg-green-100 text-green-800' :
                          selectedReport.status === 'Rejeté' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedReport.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Détails de correction proposés</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedReport.correction_details}</p>
                  </div>
                </div>

                {selectedReport.implemented_changes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Changements implémentés</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedReport.implemented_changes.changes.map((change, i) => (
                          <li key={i}>{change}</li>
                        ))}
                      </ul>
                      {selectedReport.implemented_changes.validation_notes && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="font-semibold">Notes de validation :</p>
                          <p>{selectedReport.implemented_changes.validation_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pièces Jointes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedReport.attachments.map((file, index) => (
                      <div key={index} className="border rounded-lg p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.type} • {file.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => console.log(`Download ${file.name}`)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Télécharger"
                        >
                          <DownloadIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 border-t pt-4">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                  {currentUser?.role === 'Admin' && selectedReport.status === 'En cours' && (
                    <>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => handleUpdateReport('Rejeté')}
                      >
                        Rejeter
                      </button>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        onClick={() => handleUpdateReport('Validé')}
                      >
                        Valider
                      </button>
                    </>
                  )}
                </div>
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
