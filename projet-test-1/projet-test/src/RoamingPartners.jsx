import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoamingPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [importing, setImporting] = useState({});

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5177/roaming-partners');
      console.log('Données reçues:', response.data);
      // Assurez-vous que les données sont correctement formatées
      const formattedPartners = response.data.map(partner => ({
        ...partner,
        mcc: partner.mcc?.toString().padStart(3, '0') || '-',
        mnc: partner.mnc?.toString().padStart(2, '0') || '-',
        imsi_prefix: partner.imsi_prefix?.toString() || '-'
      }));
      setPartners(formattedPartners);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  };

  // Fonction pour construire l'IMSI complet
  const buildIMSI = (mcc, mnc) => {
    if (!mcc || !mnc || mcc === '-' || mnc === '-') return '-';
    return `${mcc}${mnc}`;
  };

  // Fonction de tri
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Fonction de filtrage
  const filteredPartners = partners.filter((partner) => {
    const searchLower = searchTerm.toLowerCase();
    const imsiComplete = buildIMSI(partner.mcc, partner.mnc);
    return (
      partner.id.toString().includes(searchLower) ||
      partner.imsi_prefix.toLowerCase().includes(searchLower) ||
      partner.operateur.toLowerCase().includes(searchLower) ||
      partner.gt.toString().toLowerCase().includes(searchLower) ||
      partner.mcc.toLowerCase().includes(searchLower) ||
      partner.mnc.toLowerCase().includes(searchLower) ||
      partner.country?.toLowerCase().includes(searchLower) ||
      imsiComplete.toLowerCase().includes(searchLower)
    );
  });

  // Appliquer le tri
  const sortedPartners = [...filteredPartners].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const handleImportIR21 = async (partnerId, operatorName) => {
    setImporting(prev => ({ ...prev, [partnerId]: true }));
    try {
      const formData = new FormData();
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xml,.pdf,.ir21';
      
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          // Vérification du type de fichier
          const fileType = file.name.split('.').pop().toLowerCase();
          if (!['xml', 'pdf', 'ir21'].includes(fileType)) {
            alert('Format de fichier non supporté. Veuillez sélectionner un fichier XML, PDF ou IR21.');
            setImporting(prev => ({ ...prev, [partnerId]: false }));
            return;
          }

          formData.append('ir21File', file);
          formData.append('operatorId', partnerId);
          formData.append('operatorName', operatorName);
          formData.append('fileType', fileType);
          
          try {
            const response = await axios.post('http://localhost:5177/import-ir21', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            alert('Fichier IR21 importé avec succès !');
          } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            alert('Erreur lors de l\'import du fichier IR21');
          }
        }
      };
      
      fileInput.click();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'import du fichier IR21');
    } finally {
      setImporting(prev => ({ ...prev, [partnerId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchPartners}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Aucun partenaire trouvé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Situation Globale des Partenaires Roaming</h1>
      
      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par IMSI, GT, Opérateur, MCC, MNC, Pays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">ID</th>
              <th className="px-6 py-3 border-b text-left">Opérateur</th>
              <th className="px-6 py-3 border-b text-left">IMSI Prefix</th>
              <th className="px-6 py-3 border-b text-left">MCC</th>
              <th className="px-6 py-3 border-b text-left">MNC</th>
              <th className="px-6 py-3 border-b text-left">IMSI Complet</th>
              <th className="px-6 py-3 border-b text-left">GT</th>
              <th className="px-6 py-3 border-b text-left">Pays</th>
              <th className="px-6 py-3 border-b text-left">Bilatéral</th>
              <th className="px-6 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPartners.map((partner) => (
              <tr key={partner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{partner.id}</td>
                <td className="px-6 py-4 border-b">{partner.operateur}</td>
                <td className="px-6 py-4 border-b">{partner.imsi_prefix}</td>
                <td className="px-6 py-4 border-b">{partner.mcc}</td>
                <td className="px-6 py-4 border-b">{partner.mnc}</td>
                <td className="px-6 py-4 border-b">{buildIMSI(partner.mcc, partner.mnc)}</td>
                <td className="px-6 py-4 border-b">{partner.gt}</td>
                <td className="px-6 py-4 border-b">{partner.country || '-'}</td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    partner.bilateral 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {partner.bilateral ? 'Oui' : 'Non'}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">
                  <button
                    onClick={() => handleImportIR21(partner.id, partner.operateur)}
                    disabled={importing[partner.id]}
                    className={`px-4 py-2 rounded ${
                      importing[partner.id]
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {importing[partner.id] ? 'Import...' : 'IR21'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-gray-600">
        Total : {sortedPartners.length} partenaires
      </div>
    </div>
  );
};

export default RoamingPartners; 