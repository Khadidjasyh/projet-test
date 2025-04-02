import React, { useState} from 'react';
import { BsFillShieldLockFill, BsExclamationTriangleFill, BsCheckCircleFill, BsGearFill } from 'react-icons/bs';
import { FaNetworkWired, FaGlobe, FaExchangeAlt, FaFileUpload } from 'react-icons/fa';

const Dashboard = () => {
  const [stats] = useState({
    totalAudits: 12,
    errorsDetected: 24,
    partnersConnected: 45,
    pendingTasks: 8
  });
  
  const [recentAudits] = useState([
    { date: '02/04/2025', operateur: 'Orange France', status: 'Complété', erreurs: 3 },
    { date: '01/04/2025', operateur: 'Vodafone Espagne', status: 'En cours', erreurs: 7 },
    { date: '29/03/2025', operateur: 'TIM Italie', status: 'Complété', erreurs: 0 },
    { date: '28/03/2025', operateur: 'Deutsche Telekom', status: 'Complété', erreurs: 5 }
  ]);
  
  const [criticalAlerts] = useState([
    { operateur: 'Orange France', message: 'Configuration IMSI manquante', timestamp: '02/04/2025 10:23' },
    { operateur: 'Vodafone Espagne', message: 'Erreur de routage GT', timestamp: '01/04/2025 15:42' }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Complété': return 'text-green-600';
      case 'En cours': return 'text-blue-600';
      case 'Erreur': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tableau de Bord - Audit Roaming</h1>
        <p className="text-gray-600">Supervision des configurations et détection d'anomalies</p>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Audits ce mois-ci</p>
              <p className="text-2xl font-bold">{stats.totalAudits}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BsFillShieldLockFill className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Erreurs détectées</p>
              <p className="text-2xl font-bold">{stats.errorsDetected}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <BsExclamationTriangleFill className="text-red-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Partenaires connectés</p>
              <p className="text-2xl font-bold">{stats.partnersConnected}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaNetworkWired className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tâches en attente</p>
              <p className="text-2xl font-bold">{stats.pendingTasks}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BsGearFill className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Carte du monde et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Couverture des Partenaires Roaming</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-xl">45</p>
              <p className="text-sm text-gray-600">Opérateurs partenaires</p>
            </div>
            <div>
              <p className="font-bold text-xl">32</p>
              <p className="text-sm text-gray-600">Pays connectés</p>
            </div>
            <div>
              <p className="font-bold text-xl">98%</p>
              <p className="text-sm text-gray-600">Disponibilité réseau</p>
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <FaGlobe className="text-blue-300 text-6xl" />
            <p className="ml-4 text-gray-500">Carte du monde des partenaires</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Alertes Critiques</h2>
          <div className="space-y-4">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <p className="font-medium text-red-800">{alert.operateur}</p>
                <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
              </div>
            ))}
            {criticalAlerts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune alerte critique</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions rapides et audits récents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Audits Récents</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Opérateur</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Statut</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Erreurs</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAudits.map((audit, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{audit.date}</td>
                    <td className="py-3 px-4 text-sm">{audit.operateur}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center ${getStatusColor(audit.status)}`}>
                        {audit.status === 'Complété' && <BsCheckCircleFill className="mr-1" />}
                        {audit.status === 'En cours' && <FaExchangeAlt className="mr-1" />}
                        {audit.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {audit.erreurs > 0 ? (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {audit.erreurs} erreurs
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Aucune erreur
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Actions Rapides</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
              <FaFileUpload className="mr-2" />
              Importer un fichier IR.21/IR.85
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
              <BsFillShieldLockFill className="mr-2" />
              Lancer un nouvel audit
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
              <BsGearFill className="mr-2" />
              Vérifier les configurations
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-50">
              Voir tous les rapports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;