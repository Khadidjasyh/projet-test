import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    audits: 0,
    messages: 0,
    tasks: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simuler le chargement des données
    const fetchData = async () => {
      try {
        // En production, vous feriez une requête API réelle ici
        const mockData = {
          username: "AdminUser",
          lastLogin: new Date().toLocaleString(),
          role: "Administrateur"
        };

        const mockStats = {
          audits: 12,
          messages: 5,
          tasks: 8
        };

        const mockActivities = [
          { id: 1, action: "Connexion", time: "Il y a 5 minutes", icon: "🔒" },
          { id: 2, action: "Nouveau rapport généré", time: "Il y a 2 heures", icon: "📊" },
          { id: 3, action: "Message reçu", time: "Hier", icon: "✉️" },
          { id: 4, action: "Audit programmé", time: "12/05/2023", icon: "📅" }
        ];

        setUserData(mockData);
        setStats(mockStats);
        setRecentActivities(mockActivities);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-600">Tableau de Bord</h1>
            <p className="text-gray-600">Bienvenue, {userData.username}</p>
            <p className="text-sm text-gray-500">Dernière connexion: {userData.lastLogin}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {userData.role}
            </span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Audits</h3>
          <p className="text-3xl font-bold text-green-600">{stats.audits}</p>
          <p className="text-sm text-gray-500">Ce mois-ci</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Messages</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.messages}</p>
          <p className="text-sm text-gray-500">Non lus</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tâches</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.tasks}</p>
          <p className="text-sm text-gray-500">En attente</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités récentes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-600 mb-4">Activités Récentes</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start border-b pb-4 last:border-0">
                <span className="text-2xl mr-3">{activity.icon}</span>
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-600 mb-4">Actions Rapides</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/rapportaudit')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
            >
              <span className="mr-2">📊</span>
              Créer un rapport
            </button>
            
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
              <span className="mr-2">✉️</span>
              Envoyer un message
            </button>
            
            <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center">
              <span className="mr-2">📅</span>
              Planifier un audit
            </button>
            
            <button 
              onClick={() => navigate('/contact')}
              className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center"
            >
              <span className="mr-2">📩</span>
              Contacter le support
            </button>
          </div>
        </div>
      </div>

      {/* Section supplémentaire */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-green-600 mb-4">Statistiques des Audits</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          [Graphique des statistiques à implémenter]
        </div>
      </div>
    </div>
  );
}

export default Dashboard;