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
      const response = await axios.get('http://localhost:5178/roaming-partners');
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
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher par IMSI, GT, Opérateur, MCC, MNC, Pays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">
          {sortedPartners.length} entr{sortedPartners.length > 1 ? 'ées' : 'ée'} affich{sortedPartners.length > 1 ? 'ées' : 'ée'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">ID</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Opérateur</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">IMSI Prefix</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">MCC</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">MNC</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">IMSI Complet</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">GT</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Pays</th>

            </tr>
          </thead>
          <tbody>
            {sortedPartners.map((partner, idx) => (
              <tr key={partner.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                <td className="px-3 py-2 border-b text-center truncate max-w-[60px]" title={partner.id}>{partner.id}</td>
                <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={partner.operateur}>{partner.operateur}</td>
                <td className="px-3 py-2 border-b text-center truncate max-w-[100px]" title={partner.imsi_prefix}>{partner.imsi_prefix}</td>
                <td className="px-3 py-2 border-b text-center truncate max-w-[60px]" title={partner.mcc}>{partner.mcc}</td>
                <td className="px-3 py-2 border-b text-center truncate max-w-[60px]" title={partner.mnc}>{partner.mnc}</td>
                <td className="px-3 py-2 border-b text-center truncate max-w-[80px]" title={buildIMSI(partner.mcc, partner.mnc)}>{buildIMSI(partner.mcc, partner.mnc)}</td>
                <td className="px-3 py-2 border-b text-center truncate max-w-[100px]" title={partner.gt}>{partner.gt}</td>
                <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={partner.country || '-'}>{partner.country || '-'}</td>

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