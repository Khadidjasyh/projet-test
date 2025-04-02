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
  ClockIcon
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AuditService.fetchAuditReports();
        setReports(data);
      } catch (error) {
        console.error("Erreur de chargement des rapports:", error);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
       
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-600">Rapports d'Audit</h1>
            <p className="text-gray-600">Gestion et consultation des rapports d'audit technique</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Nouveau Rapport
          </button>
        </div>

        
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
                  <button
                    onClick={() => console.log(`Print ${selectedReport.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <PrinterIcon className="h-5 w-5 mr-2" />
                    Imprimer
                  </button>
                  <button
                    onClick={() => console.log(`Export ${selectedReport.id}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Exporter PDF
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
