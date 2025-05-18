import React, { useState } from 'react';
import { BsSave, BsGear, BsServer, BsShieldCheck, BsGlobe, BsClock, BsBell } from 'react-icons/bs';

const ConfigurationRoaming = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Mobilis',
      mcc: '603',
      mnc: '01',
      country: 'Algérie',
      timezone: 'Africa/Algiers'
    },
    network: {
      primaryGt: '603011234',
      backupGt: '603015678',
      sccpVariant: 'ITU',
      networkIndicator: 'International',
      routingIndicator: 'GT Based'
    },
    security: {
      passwordExpiration: 90,
      maxLoginAttempts: 3,
      sessionTimeout: 30,
      twoFactorAuth: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      alertThreshold: 'Medium'
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simuler la sauvegarde
    console.log('Settings saved:', settings);
    alert('Configuration sauvegardée avec succès !');
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: BsGear },
    { id: 'network', label: 'Réseau', icon: BsServer },
    { id: 'security', label: 'Sécurité', icon: BsShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: BsBell }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuration Roaming</h1>
        <p className="mt-2 text-gray-600">Gérez les paramètres de votre plateforme de roaming</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b">
          <nav className="flex space-x-4 px-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Paramètres Généraux */}
          <div className={activeTab === 'general' ? '' : 'hidden'}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={settings.general.companyName}
                  onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">MCC</label>
                  <input
                    type="text"
                    value={settings.general.mcc}
                    onChange={(e) => handleInputChange('general', 'mcc', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MNC</label>
                  <input
                    type="text"
                    value={settings.general.mnc}
                    onChange={(e) => handleInputChange('general', 'mnc', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres Réseau */}
          <div className={activeTab === 'network' ? '' : 'hidden'}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">GT Primaire</label>
                <input
                  type="text"
                  value={settings.network.primaryGt}
                  onChange={(e) => handleInputChange('network', 'primaryGt', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GT Secondaire</label>
                <input
                  type="text"
                  value={settings.network.backupGt}
                  onChange={(e) => handleInputChange('network', 'backupGt', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Variante SCCP</label>
                <select
                  value={settings.network.sccpVariant}
                  onChange={(e) => handleInputChange('network', 'sccpVariant', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>ITU</option>
                  <option>ANSI</option>
                  <option>China</option>
                </select>
              </div>
            </div>
          </div>

          {/* Paramètres Sécurité */}
          <div className={activeTab === 'security' ? '' : 'hidden'}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiration du mot de passe (jours)</label>
                <input
                  type="number"
                  value={settings.security.passwordExpiration}
                  onChange={(e) => handleInputChange('security', 'passwordExpiration', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tentatives de connexion max</label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Activer l'authentification à deux facteurs
                </label>
              </div>
            </div>
          </div>

          {/* Paramètres Notifications */}
          <div className={activeTab === 'notifications' ? '' : 'hidden'}>
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Activer les notifications par email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Activer les notifications par SMS
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Seuil d'alerte</label>
                <select
                  value={settings.notifications.alertThreshold}
                  onChange={(e) => handleInputChange('notifications', 'alertThreshold', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <BsSave className="mr-2 -ml-1 h-4 w-4" />
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationRoaming; 