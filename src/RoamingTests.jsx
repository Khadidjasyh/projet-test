import React, { useState, useEffect } from 'react';
import {
  FaPlay,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaSpinner,
  FaTable,
  FaMap,
  FaChartBar,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaDownload
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { generateReportFromTest } from './RapportAudit';
import { toast } from 'react-hot-toast';
// Données extraites du fichier Excel
const operatorData = {
  "Afghanistan": ["Telecom Development Company Afghanistan Ltd.", "Etisalat Afghanistan", "MTN", "Afghan Wireless Communication Company"],
  "Albania": ["Albanian Mobile Communications", "Vodafone"],
  "Angola": ["Unitel S,A", "Movicel Angola"],
  "Argentina": ["Telefonica", "Claro"],
  "Armenia": ["K Telecom CJSC", "Armentel"],
  "Aruba": ["Digicel"],
  "Australia": ["Telstra", "Vodafone Hutchison"],
  "Austria": ["T-Mobile", "T-Mobile", "T-Mobile"],
  "Azerbaijan": ["Azercell Telecom BM", "Backcell", "K Telecom CJSC / Azerfon LLC"],
  "Bahamas": ["Be Aliv"],
  "Bahrain": ["Bahrain Telecommunications Company", "ZAIN BAHRAIN", "VIVA BAHRAIN"],
  "Bangladesh": ["Robi Axiata", "Airtel Bangladesh Ltd"],
  "Belarus": ["JLLC Mobile TeleSystems", "Velcom"],
  "Belgium": ["Belgacom Mobile/Proximus", "BASE NV/SA", "Mobistar S.A. / Orange", "Bics", "Telenet BVBA, Belgium"],
  "Benin": ["SPACETEL"],
  "Birmanie": ["OOredOO Birmanie"],
  "Bosnia and Herzegovina": ["HT-ERONET", "RS Telecommunications JSC Banja Luka m:tel"],
  "Bostwana": ["Mascom Bostwana", "Orange Bostwana"],
  "Burkina Faso": ["telecell", "Orange"],
  "Brazil": ["Vivo", "Vivo", "Vivo", "Vivo", "TIM Cellular", "TIM Cellular", "TIM Cellular", "CLARO"],
  "British Virgin Island": ["Digicel"],
  "Brunei Darussalam": ["Datastream Technology Sdn Bhd", "Progressif Cellular Sdn Bhd", "Unified National Networks", "Unified National Networks"],
  "Bulgaria": ["Bulgarian Telecommunications Com VIVAcom", "Telenor Bulgaria Mobile EAD /telefonica", "Mobitel BULGARIA"],
  "Burundi": ["Smart Burundi", "Lumitel Burundi"],
  "Cambodia": ["Metfone", "Metfone", "Cambodia Shinawatra Co. Ltd"],
  "Cameroon": ["MTN", "Orange"],
  "Canada": ["Microcell Telecommunications Inc (Fido)", "Rogers Wireless Inc", "Bell Mobility INC", "Bell Mobility INC", "Sasktel", "videotron", "Telus Canada", "Telus Canada"],
  "Cap Verde": ["Unitel+"],
  "Center Africa": ["moov", "ORANGE"],
  "China": ["China Telecommunications", "China Unicom", "China Unicom", "Mobile", "Mobile", "Mobile", "Mobile"],
  "Chile": ["Claro", "Telefonica", "Telefonica"],
  "Colombia": ["Telefonika Colombia"],
  "Congo": ["Africell", "Vodacom", "Orange", "Orange"],
  "Congo Brazaville": ["Airtel /Warid", "Airtel /Warid"],
  "Comores": ["Telecom Comores"],
  "Costa Rica": ["Ice", "Claro"],
  "Coast Ivory": ["MTN", "Orange"],
  "Croatia": ["Tele 2 d.o.o", "T-Mobile"],
  "Cuba": ["Cubacel"],
  "Curacao Bonaire": ["Digicel"],
  "Cyprus": ["MTN Cyprus Limited/ Salt", "Primetel", "vodafone/Cytamobile"],
  "Czech Republic": ["O2/EUROTEL PRAHA/Telefonica", "Vodafone", "T-MOBILE"],
  "Denmark": ["Sonofon Denmark /Telenor A/S", "TDC Mobil", "Telia Nattjanster Norden AB", "Telia Nattjanster Norden AB"],
  "Djibouti": ["Djibouti Telecom SA"],
  "Dominican Republic": ["ALTICE Dominicana"],
  "Ecuador": ["Telefonica", "Claro Ecuador"],
  "Egypt": ["Etisalat Misr", "Telecom", "Mobinil/ Orange", "Vodafone Egypt Telecommunications S.A.E"],
  "Equatorial Guinea": ["Green Com S,A", "Getesa-Orange"],
  "Estonia": ["Elisa Eesti AS", "Tele 2 Eesti Aktsiaselts"],
  "Ethiopia": ["Ethiopian Telecommunications Corporation", "Safaricom Limited Ethiopia"],
  "Faroe Islands": ["P/F Kall/Vodafone"],
  "Finland": ["Ålands Telekommunikation Ab", "Telenor Finland", "Elisa", "Elisa"],
  "France": ["Orange", "SFR", "SFR", "Bouygues Telecom", "Orange M2M", "FREE CARAIBE", "Free Mobile"],
  "Gabon": ["Airtel Gabon"],
  "Gambia": ["Gamcel", "Africell"],
  "Germany": ["Vodafone GmbH", "TELEKOM/ T-mobile", "Telekom M2M", "E-Plus Mobilfunk GmbH & Co. KG", "Emnify", "Telefonica"],
  "Ghana": ["Ghana Telecommunications Compan/Vodafone", "Millicom Ghana Limited/Celtel Ghana", "MTN Ghana"],
  "Greece": ["COSMOTE / Mobile Telecommunications S.A.", "Vodafone", "WIND HELLAS", "WIND HELLAS"],
  "Guadeloupe /Frensh Guiana /Martinique": ["Digicel"],
  "Guatemala": ["Telecomunicaciones de Guatemala"],
  "Guinea": ["Orange", "MTN", "intercell"],
  "Guinea Bissau": ["Orange", "MTN GUINEA BISSAU"],
  "Guernsey": ["Sure limited Guernsey"],
  "Guyana": ["Digicel"],
  "Haiti": ["Digicel", "Natcom Viettel"],
  "Honduras": ["claro"],
  "Hong Kong": ["PCCW Mobile HK Limited", "PCCW Mobile HK Limited", "Hong Kong CSL Limited HKT", "Hutchison Telecom (HK) Ltd", "Hutchison Telecom (HK) Ltd 3 g HKT", "China Mobile Peoples Telephone Co Ltd"],
  "Hungary": ["T-MOBILE", "Vodafone"],
  "Iceland": ["Siminn hf", "IMC Island ehf/ Viking"],
  "India": ["Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "Bharti Airtel Limited", "AIRTEL,Bharti Cellular,Ltd,INDIA", "AIRTEL ,Bharti Cellular INDIA", "AIRTEL BhartiRajasthan", "AIRTEL ,Bharti Cellular INDIA", "AIRTEL ,Bharti Cellular INDIA", "AIRTEL Bharti Cellular", "AIRTEL ,Bharti Cellular INDIA", "Vodafone Essar East Limited", "Vodafone Essar Gujarat Limited", "Hutchison Max Telecom", "Vodafone Essar Mobile Services Limited", "BPL INDIA", "Reliance telecom Ltd", "Vodafone India"],
  "Indonesia": ["PT Mobile/8 Telekom Tbk", "Indosat"],
  "Iran": ["MCI", "Rightel", "MTN Irancell"],
  "Iraq": ["Asia Cell Telecommunications Company Ltd", "IRAQNA IRAQ /Zain", "Zain Iraq"],
  "Ireland": ["Vodafone", "Meteor"],
  "Italy": ["Vodafone Omnitel N.V.", "Free Mobile Iliad", "Telecom Italia SpA"],
  "Jamaica": ["Digicel"],
  "Japan": ["NTT Docomo , inc", "KNDDI", "KNDDI", "KNDDI"],
  "Jersey": ["Telekom Jersey"],
  "Jordan": ["Zain", "Orange Jordan / Petra", "Umniah Mobile Company"],
  "Kazakhstan": ["Tele 2", "Kar / Tel LLP /Beeline"],
  "Kenya": ["Safaricom Limited", "TELEKOM KENYA (orange)"],
  "Korea Republic of": ["SKT Korea", "KT Corporation"],
  "Kuwait": ["Zain (MTC, Vodafone)", "National Mobile Telecommunications Co. (Wataniya)", "VIVA ( KTC)"],
  "Kyrgyz Republic": ["Bitel Ltd,GSM/900 Kyrgyz Republi", "NUR"],
  "Laos": ["Unitel Laos / Viettel"],
  "Latvia": ["Latvian Mobile Telephone Co", "TELE 2 LATIVIA"],
  "Lebanon": ["MIC 1", "MIC 2"],
  "Lesotho": ["Vodacom", "Econet Telecom"],
  "Liberia": ["MTN", "Comium Services BVI (Liberia)"],
  "Lithuania": ["Tele 2 Lithunia"],
  "Luxembourg": ["P & T Luxembourg", "MTX", "MTX", "Tango SA", "VOX LUXEMBOURG /Orange"],
  "Lybia": ["AL MADAR Telecomm Company"],
  "Macau": ["CTM"],
  "Macedonia": ["One VIP", "COSMOFON AD Skopje/ One VIP"],
  "Madagascar": ["Orange Madagascar S.A.", "Celtel Madagascar"],
  "Malawi": ["Telekom Networks Malawi Ltd"],
  "Mali": ["Malitel", "Orange Mali SA"],
  "Malta": ["Vodafone M2M", "Vodafone Maritime", "Vodafone / Salt", "Go Mobile"],
  "Malaysia": ["U mobile Sdn Bhd Malaysia", "Maxis Communications Berhad"],
  "Mauritania": ["MAURITEL MOBILES", "Chinguitel"],
  "Mauritus": ["Orange"],
  "Mexico": ["Telcel", "AT&T Mexico", "Telefónica México"],
  "Moldova": ["Orange", "Moldtelecom"],
  "Monaco": ["Telecom"],
  "Mongolia": ["Unitel S,A"],
  "Montenegro": ["Telefonica", "m:tel"],
  "Morocco": ["Maroc Telecom", "Orange /meditel", "Wana Morocco"],
  "Mozambique": ["Vodacom", "Movitel Mozambiqe", "Viettel"],
  "Namibia": ["MTC Namibia"],
  "Netherlands": ["Orange Nederland N.V.", "T-Mobile Netherlands", "KPN Mobile The Netherlands", "Vodafone Nertherlands", "Telfort"],
  "New Caledonia": ["OPT"],
  "New Zealand": ["2 Degrees Mobile Ltd", "Vodafone"],
  "Nicaragua": ["Claro", "Claro"],
  "Niger": ["Atlantique (Moov)", "Orange", "Airtel"],
  "Nigeria": ["Celtel nigeria", "MTN Nigeria Communications Limited", "Etisalat Nigeria"],
  "Norway": ["Telenor", "Tele2 Group / lyse norway", "Aeromobile", "MCP", "TDC Norway"],
  "Oman,Sultanateof": ["Omantel", "Vodafone", "Nawres/Ooredoo"],
  "Pakistan": ["CMPak Limited /paktel", "Telenor Pakistan (Pvt) Ltd.", "Warid Telecom (PVT) Ltd"],
  "Palestinian Territory": ["Palestine Telecomm Co Ltd", "Wataniya mobile"],
  "Panama": ["Digicel", "Cable & Wireless Panama"],
  "PARAGUAY": ["AMX Paraguay S.A."],
  "Peru": ["Viettel", "Bitel Peru / Viettel", "Telefonica", "Claro"],
  "Philippines": ["Globe Telecom", "SMART Communications, Inc."],
  "Poland": ["Orange", "P4", "T-Mobile"],
  "polynesia": ["vini frensh polynesia"],
  "Puerto Rico": ["Liberty Mobile", "Claro", "AT & T"],
  "Portugal": ["TMN / MEO - Serviços de Comunicações e…", "Vodafone"],
  "Qatar": ["ooredoo", "Vodafone"],
  "Republic of Maldives": ["ooredoo Maldives"],
  "Romania": ["Cosmote Romanian Mobile Telecommunications S.A.", "Orange", "Vodafone Romania S.A."],
  "Russia": ["OJSC VimpelCom, KP IMPULS, Beeline", "MegaFon, Open Joint Stock Company", "MTS", "tele 2"],
  "Rwanda,Republicof": ["MTN RwandaCell"],
  "Salvador/el salvador": ["Telemovil", "Digicel", "Claro"],
  "Saudi Arabia": ["Saudi Telecom Company (STC)", "Mobily Lebara", "STC Virgin MVNO", "Etihad Etisalat Company", "ZAIN KSA", "ZAIN KSA"],
  "Senegal": ["Sonatel/ orange", "TIGO / Free"],
  "Serbia": ["Telefonika", "Telekom Srbija"],
  "seychelles": ["Airtel"],
  "Sierra Leone": ["Africell", "QCell SL"],
  "Singapore": ["MOBILE ONE SANGAPORE"],
  "Slovak republic": ["Orange Slovensko a.s.", "Slovak Telekom a.s"],
  "Slovenia": ["T2", "Telemach Slovenija", "Mobitel D.D."],
  "South Africa": ["Cell C (Pty) Ltd", "MTN / Mobile Telephone Networks (Pty) Ltd.", "Vodacom (Pty) Ltd"],
  "South Sudan": ["MTN"],
  "Spain": ["Vodafone Espana S.A.", "Vodafone Espana S.A.", "Orange Spain", "Telefonica Moviles España S.A.", "Telefonica Moviles España S.A."],
  "Sri Lanka": ["Mobitel (Pvt) Limited", "Dialog Telekom Ltd", "Hutchison"],
  "Sudan": ["Zain , Mobitel", "MTN Sudan"],
  "suriname": ["Digicel"],
  "Swaziland": ["Swazi MTN Limited"],
  "Sweden": ["Tele 2 AB", "Tele 2 AB", "TeliaSonera Mobile Networks AB Sweden", "Telenor Nordic", "Telenor Nordic", "TDC Sweden"],
  "Switzerland": ["Swisscom (Switzerland) Ltd", "Sunrise Commincation", "Orange Communications SA", "OnAir Switzerland"],
  "Syria": ["Syriatel Mobile Telecom SA", "MTN Syria (JSC)"],
  "Taiwan": ["Star Telecom Taiwan (vibo)"],
  "Tajikistan/North": ["JV Somoncom", "Indigo Tajikistan"],
  "Tanzania": ["Celtel Tanzania Ltd.", "Mic Tanzania", "Vodafone", "Halotel Tanzania", "Smart"],
  "Tchad": ["Airtel Tchad", "Mic Tchad"],
  "Thailand": ["DTAC THAILAND", "DTAC THAILAND", "Advanced Wireless Network", "True Move (Real Future Thailand)", "True Move Company Ltd"],
  "Timor Leste": ["Telkomcel", "Telemor"],
  "Togo": ["Togo Cellulaire"],
  "Tunisia": ["Ooredoo Tunisia", "Tunisie Telecom", "Tunisie Telecom", "Orange Tunisie", "Lyca Mobile"],
  "Turkey": ["TT Mobile ex Avea Iletisim Hizmetleri A.S.", "TT Mobile ex Avea Iletisim Hizmetleri A.S.", "Turkcell Iletisim Hizmetleri A.S.", "Vodafone Telekomunikasyon A.S"],
  "Turkmenistan": ["MTS-Turkmenistan", "TMCELL AMD Telecom"],
  "Trindad & Tobago": ["Digicel"],
  "Uganda": ["Celtel Uganda", "Celtel Uganda", "Smart Uganda"],
  "Ukraine": ["Golden Telekom", "Astelit LLC/lifecell", "Kyivstar GSM JSC", "Ukrainian Radio Systems", "Ukrainian Mobile Communications"],
  "United Arab Emirates": ["Emirates Integrated Telecommunications Company PJSC", "Emirates Telecom Corp/ETISALAT", "THURAYA"],
  "UnitedKingdom": ["T-Mobile (EE)", "Vodafone", "Truphone", "Telefonica UK Limited / O2"],
  "United States of America": ["Limitless Mobile", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "T-Mobile USA", "AT & T", "AT & T", "AT & T", "AT & T", "AT & T", "AT & T", "AT & T Maritime Cruise", "Cincinnati Bell Wireless LLC", "Verizon", "Verizon"],
  "Uruguay": ["AM Wireless Uruguay S.A. claro", "Telefonica", "Antel Ancel"],
  "Uzbekistan": ["COSCOM (TM UCell),", "Uzbektelecom", "UMS LLC", "Unitel"],
  "venezuela": ["Digitel GSM"],
  "Vietnam": ["Vietnamobile Communications Center", "Mobifone", "Vinaphone", "Viettel"],
  "Yemen": ["Yemen Mobile Phone Company / Sabafon", "Spacetel", "Yemen Telecom"],
  "Zambia": ["MTN", "Airtel"],
  "Zimbabwe": ["Telcel"]
};

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RoamingTests = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("Afghanistan");
  const [selectedOperator, setSelectedOperator] = useState("Telecom Development Company Afghanistan Ltd.");
  const [tests, setTests] = useState([
    {
      id: 1,
      name: "Partenaires Roaming & Services",
      description: "Vérifie la configuration des partenaires roaming et leurs services",
      status: "non exécuté",
      results: null,
      showResults: false
    },
    {
      id: 2,
      name: "Inbound Roaming",
      description: "Analyse le provisioning et la configuration pour les visiteurs étrangers",
      status: "non exécuté",
      results: null,
      showResults: false
    },
    {
      id: 3,
      name: "Outbound Roaming",
      description: "Teste la connectivité pour les abonnés voyageant à l'étranger",
      status: "non exécuté",
      results: null,
      showResults: false
    },
    {
      id: 4,
      name: "Test de Performance",
      description: "Évalue les performances du réseau en situation de roaming",
      status: "non exécuté",
      results: null,
      showResults: false
    },
    {
      id: 5,
      name: "Test de Sécurité",
      description: "Vérifie les mesures de sécurité pour le roaming",
      status: "non exécuté",
      results: null,
      showResults: false
    },
    {
      id: 6,
      name: "Test de Compatibilité",
      description: "Vérifie la compatibilité avec différents réseaux et technologies",
      status: "non exécuté",
      results: null,
      showResults: false
    }
  ]);
  const [viewMode, setViewMode] = useState('table');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showAuditTable, setShowAuditTable] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [user, setUser] = useState(null);

  const countries = Object.keys(operatorData);
  const operators = operatorData[selectedCountry] || [];

  const handleRunTest = (testId) => {
    // Mettre à jour le statut en "running"
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, status: "running" } 
        : test
    ));

    // Simuler un délai de 2 secondes
    setTimeout(() => {
      // Tous les tests sont marqués comme réussis
      setTests(tests.map(test => 
        test.id === testId 
          ? { ...test, status: "success" } 
          : test
      ));
    }, 2000);
  };

  const handleShowResults = (test) => {
    if (test.name === "Partenaires Roaming & Services") {
      navigate('/partenaires-roaming-results');
    } else if (test.name === "Inbound Roaming") {
      navigate('/inbound-roaming-results');
    } else if (test.name === "Outbound Roaming") {
      navigate('/outbound-roaming-results');
    } else if (test.name === "Tests CAMEL Phase Service Inbound Roaming") {
      navigate('/camel-inbound-results');
    } else if (test.name === "Tests CAMEL Phase Service Outbound Roaming") {
      navigate('/camel-outbound-results');
    } else if (test.name === "Tests Data Inbound Roaming") {
      navigate('/data-inbound-results');
    } else {
      setSelectedTest(test);
      setShowResults(true);
      setShowAuditTable(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSelectedTest(null);
  };

  const handleBackToTests = () => {
    navigate('/roaming-tests');
  };

  const handleGenerateReport = async (test) => {
    try {
      const now = new Date();
      const dateStr = now.toLocaleString();

      if (test.id === 1) {
        // Récupération des données pour le test Partenaires Roaming
        const response = await fetch('http://localhost:5178/situation-globale');
        if (!response.ok) throw new Error('Erreur lors de la récupération des données');
        const data = await response.json();

        // Préparation des données pour le rapport
        const missingServices = data.filter(row => row.services_manquants);
        const erreurGlobale = missingServices.length > 0 
          ? `Détecté ${missingServices.length} service(s) manquant(s)`
          : "Aucun service manquant détecté.";

        // Construction du tableau pour le fichier texte
        const col1 = 'Pays';
        const col2 = 'Opérateur';
        const col3 = 'Services Manquants';
        const width1 = Math.max(col1.length, ...data.map(r => (r.pays || '').length));
        const width2 = Math.max(col2.length, ...data.map(r => (r.operateur || '').length));
        const width3 = Math.max(col3.length, ...data.map(r => (r.services_manquants || '').length));

        const pad = (txt, len) => (txt || '').padEnd(len, ' ');
        const sep = `| ${pad(col1, width1)} | ${pad(col2, width2)} | ${pad(col3, width3)} |\n`;
        const sepLine = `|-${'-'.repeat(width1)}-|-${'-'.repeat(width2)}-|-${'-'.repeat(width3)}-|\n`;
        let table = sep + sepLine;

        data.forEach(row => {
          table += `| ${pad(row.pays, width1)} | ${pad(row.operateur, width2)} | ${pad(row.services_manquants, width3)} |\n`;
        });

        const aide = `\n\n\n🔴 Services manquants détectés
Cause probable :
- Services non activés dans le système
- Données manquantes dans la base
- Configuration incomplète

Solutions :
- Vérifier l'activation des services dans le système
- Compléter les données manquantes
- Mettre à jour la configuration des services
- Vérifier les accords de roaming avec les opérateurs
`;

        const txt = `Nom du test : Partenaires Roaming & Services\n` +
                    `Date : ${dateStr}\n` +
                    `Erreur globale : ${erreurGlobale}\n\n` +
                    table + aide;

        // Création et téléchargement du fichier
        const blob = new Blob([txt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport_partenaires_roaming_${now.toISOString().slice(0,19).replace(/[:T]/g, "-")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Préparation des données pour la sauvegarde dans la base de données
        const simplifiedData = data.map(row => ({
          pays: row.pays,
          operateur: row.operateur,
          services_manquants: row.services_manquants
        }));

        const reportData = {
          id: `AUD_${Date.now()}`,
          test_id: 1,
          title: `Rapport Partenaires Roaming - ${now.toLocaleDateString()}`,
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().split(' ')[0],
          status: 'En cours',
          created_by: 'Système',
          total_operators: data.length,
          total_issues: missingServices.length,
          results_data: JSON.stringify(simplifiedData),
          solutions: JSON.stringify([
            "Vérifier l'activation des services dans le système",
            "Compléter les données manquantes",
            "Mettre à jour la configuration des services",
            "Vérifier les accords de roaming avec les opérateurs"
          ]),
          validation_notes: erreurGlobale
        };

        // Sauvegarde dans la base de données
        const saveResponse = await fetch('http://localhost:5178/audit-reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reportData)
        });

        if (!saveResponse.ok) {
          throw new Error('Erreur lors de la sauvegarde du rapport');
        }

        alert('Rapport généré et sauvegardé avec succès !');
      }
      // ... existing code for other tests ...
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      alert("Une erreur est survenue lors de la génération du rapport.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'running':
        return <FaSpinner className="text-blue-500" />;
      case 'pending':
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const renderAuditTable = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
        {/* Bouton Générer un rapport en haut du tableau d'audit */}
        <div className="flex justify-end mb-4">
            <button
              onClick={() => handleGenerateReport(tests[0])}
              className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
            >
            <FaChartBar />
            <span>Générer un rapport</span>
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-800">{auditData.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Bilatéraux</div>
              <div className="text-2xl font-bold text-blue-600">
                {auditData.filter(p => p.accord === "Bilatéral").length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Unilatéraux</div>
              <div className="text-2xl font-bold text-purple-600">
                {auditData.filter(p => p.accord === "Unilatéral").length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Conformes</div>
              <div className="text-2xl font-bold text-green-600">
                {auditData.filter(p => !p.erreurs).length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Non Conformes</div>
              <div className="text-2xl font-bold text-red-600">
                {auditData.filter(p => p.erreurs).length}
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">📊 Tableau de Synthèse – Audit Roaming (IR.21)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opérateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PLMN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAMEL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPRS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3G</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditData.map((row, index) => {
                  // Génération automatique du commentaire
                  const services = ['gsm','camel','gprs','troisg','lte'];
                  const missing = [];
                  for (let s of services) {
                    if (row[s] === undefined || row[s] === null || row[s] === '') missing.push(`${s.toUpperCase()} non disponible`);
                  }
                  let commentaireAuto = '';
                  if (missing.length === 0) {
                    commentaireAuto = 'Tous les services sont disponibles';
                  } else {
                    commentaireAuto = missing.join(', ');
                  }
                  let commentaire = row.commentaire;
                  if (commentaireAuto && commentaireAuto !== 'Tous les services sont disponibles') {
                    commentaire = commentaire ? `${commentaire}, ${commentaireAuto}` : commentaireAuto;
                  } else if (commentaireAuto === 'Tous les services sont disponibles' && (!commentaire || commentaire === '' || commentaire === undefined || commentaire === null)) {
                    commentaire = 'Tous les services sont disponibles';
                  }
                  return (
                  <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.pays}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.operateur}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.plmn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.gsm !== undefined && row.gsm !== null && row.gsm !== '' ? row.gsm : 'Aucun'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.camel !== undefined && row.camel !== null && row.camel !== '' ? row.camel : 'Aucun'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.gprs !== undefined && row.gprs !== null && row.gprs !== '' ? row.gprs : 'Aucun'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.troisg !== undefined && row.troisg !== null && row.troisg !== '' ? row.troisg : 'Aucun'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.lte !== undefined && row.lte !== null && row.lte !== '' ? row.lte : 'Aucun'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commentaire !== undefined && commentaire !== null && commentaire !== '' ? commentaire : 'Aucun'}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTableView = () => (
    <>
      <div className="flex flex-wrap items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">
          {tests.length} test{tests.length > 1 ? 's' : ''} affiché{tests.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Test</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Description</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Statut</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, idx) => (
              <tr key={test.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                <td className="px-3 py-2 border-b text-center truncate max-w-[180px]" title={test.name}>{test.name}</td>
                <td className="px-3 py-2 border-b text-center truncate max-w-[300px]" title={test.description}>{test.description}</td>
                <td className="px-3 py-2 border-b text-center">
                  {getStatusIcon(test.status)}
                  <span className={`ml-2 ${
                    test.status === "running" ? "text-blue-500" : 
                    test.status === "success" ? "text-green-500" : 
                    test.status === "failed" ? "text-red-500" : 
                    test.status === "pending" ? "text-red-500" : ""
                  }`}>
                    {test.status === "running" ? "En cours..." : 
                     test.status === "success" ? "Succès" : 
                     test.status === "failed" ? "Échoué" : 
                     test.status === "pending" ? "En attente" : test.status}
                  </span>
                </td>
                <td className="px-3 py-2 border-b text-center">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleRunTest(test.id)}
                      className={`flex-1 px-4 py-2 rounded-lg ${test.status === "running" ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-green-600 text-white hover:bg-green-700"}`}
                      disabled={test.status === "running"}
                    >
                      <FaPlay className="inline mr-1" /> Lancer
                    </button>
                    <button
                      onClick={() => handleShowResults(test)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      <FaChartBar />
                      <span>Résultats</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const checkUserAccess = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5178/current-user', {
        headers: {
          'user-id': userData.id
        }
      });

      if (!response.ok) {
        throw new Error('Erreur de réponse du serveur');
      }

      const data = await response.json();
      console.log('Données utilisateur reçues:', data);
      
      // Vérifie si l'utilisateur est admin
      if (data.role !== 'admin') {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la vérification des droits:', error);
      setAccessDenied(true);
      setLoading(false);
    }
  };

  const renderTestResults = () => {
    if (!selectedTest) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Résultats du test: {selectedTest.name}
            </h2>
            <button
              onClick={handleCloseResults}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{selectedTest.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Statut</h3>
              <div className="flex items-center">
                {getStatusIcon(selectedTest.status)}
                <span className={`ml-2 ${
                  selectedTest.status === "running" ? "text-blue-500" : 
                  selectedTest.status === "success" ? "text-green-500" : 
                  selectedTest.status === "failed" ? "text-red-500" : 
                  "text-gray-500"
                }`}>
                  {selectedTest.status === "running" ? "En cours..." : 
                   selectedTest.status === "success" ? "Succès" : 
                   selectedTest.status === "failed" ? "Échoué" : 
                   selectedTest.status}
                </span>
              </div>
            </div>

            {selectedTest.results && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Résultats détaillés</h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedTest.results, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleBackToTests}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Retour aux tests
              </button>
              <button
                onClick={() => handleGenerateReport(selectedTest)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
              >
                <FaDownload />
                <span>Générer rapport</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  useEffect(() => {
    checkUserAccess();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">
            <FaTimesCircle />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
          </p>
          <p className="text-gray-600">
            Cette page est réservée aux administrateurs.
          </p>
        </div>
      </div>
    );
  }

  if (showAuditTable) {
    return renderAuditTable();
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
            <h1 className="text-3xl font-bold text-green-600 mb-2">Tests de Roaming</h1>
            <p className="text-green-600 text-lg max-w-2xl">
              Gestion et exécution des tests d'itinérance pour les opérateurs internationaux
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'table' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaTable />
              <span>Tableau</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'map' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaMap />
              <span>Carte</span>
            </button>
          </div>
        </div>
      </motion.div>

      {viewMode === 'table' ? renderTableView() : null}
      {showResults && renderTestResults()}
    </motion.div>
  );
};

export default RoamingTests;