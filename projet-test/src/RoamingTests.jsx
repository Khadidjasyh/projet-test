import React, { useState } from 'react';
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
  FaSortDown
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
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

// Données des tests à afficher
const initialTests = [
  {
    id: 1,
    name: "Partenaires Roaming & Services",
    description: "Vérification des accords et services disponibles (GSM, CAMEL, GPRS, LTE).",
    status: "pending"
  },
  {
    id: 2,
    name: "Inbound Roaming",
    description: "Analyse du provisioning et de la configuration pour les visiteurs étrangers.",
    status: "pending"
  },
  {
    id: 3,
    name: "Outbound Roaming",
    description: "Test de connectivité pour les abonnés voyageant à l'étranger.",
    status: "pending"
  },
  {
    id: 4,
    name: "Tests CAMEL Phase Service Inbound Roaming",
    description: "Vérification des services CAMEL pour les visiteurs étrangers (USSD, VPN, etc.).",
    status: "pending"
  },
  {
    id: 5,
    name: "Tests CAMEL Phase Service Outbound Roaming",
    description: "Vérification des services CAMEL pour les abonnés à l'étranger (USSD, VPN, etc.).",
    status: "pending"
  },
  {
    id: 6,
    name: "Tests Data Inbound Roaming",
    description: "Vérification de la connectivité data (3G/4G) pour les visiteurs étrangers.",
    status: "pending"
  }
];

const RoamingTests = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("Afghanistan");
  const [selectedOperator, setSelectedOperator] = useState("Telecom Development Company Afghanistan Ltd.");
  const [tests, setTests] = useState(initialTests);
  const [viewMode, setViewMode] = useState('table');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showAuditTable, setShowAuditTable] = useState(false);
  // Nouveaux states pour l'audit table
  const [searchTerm, setSearchTerm] = useState('');
  const [auditData, setAuditData] = useState([]);
  
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('Tous');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  const countries = Object.keys(operatorData);
  const operators = operatorData[selectedCountry] || [];



  const handleRunTest = async (testId) => {
    setTests(tests.map(test =>
      test.id === testId
        ? { ...test, status: "running" }
        : test
    ));

    // Si c'est "Partenaires Roaming & Services", on va chercher les données
    const test = tests.find(t => t.id === testId);
    if (test && test.name === "Partenaires Roaming & Services") {
      try {
        const response = await fetch("http://localhost:5178/situation-globale");
        if (!response.ok) throw new Error("Erreur lors de la récupération des données");
        const data = await response.json();
        setAuditData(data);
        setTests(tests.map(test =>
          test.id === testId
            ? { ...test, status: "success" }
            : test
        ));
      } catch (error) {
        setTests(tests.map(test =>
          test.id === testId
            ? { ...test, status: "failed" }
            : test
        ));
        alert("Erreur lors de la récupération des données de la situation globale.");
      }
    } else {
      // Comportement inchangé pour les autres tests
      setTimeout(() => {
        const randomStatus = Math.random() > 0.5 ? "success" : "failed";
        setTests(tests.map(test =>
          test.id === testId
            ? { ...test, status: randomStatus }
            : test
        ));
      }, 2000);
    }
  };

  const handleShowResults = (test) => {
    if (test.name === "Partenaires Roaming & Services") {
      setShowAuditTable(true);
      setShowResults(false);
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
    setShowAuditTable(false);
    setShowResults(false);
    setSelectedTest(null);
  };

  const handleGenerateReport = async () => {
    try {
      // Calcul des statistiques
      const totalOperators = auditData.length;
      const totalIssues = auditData.filter(row => 
        !row.gsm || !row.camel || !row.gprs || !row.troisg || !row.lte
      ).length;
      const camelIssues = auditData.filter(row => !row.camel).length;
      const gprsIssues = auditData.filter(row => !row.gprs).length;
      const threegIssues = auditData.filter(row => !row.troisg).length;
      const lteIssues = auditData.filter(row => !row.lte).length;

      // Préparation des données du rapport
      const reportData = {
        id: `AUD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        test_id: selectedTest ? selectedTest.id : 1,
        title: selectedTest ? `${selectedTest.name} - Rapport d'audit` : 'Rapport d\'audit Roaming',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: 'Admin', // À remplacer par l'utilisateur connecté
        validated_by: null,
        total_operators: totalOperators,
        total_issues: totalIssues,
        camel_issues: camelIssues,
        gprs_issues: gprsIssues,
        threeg_issues: threegIssues,
        lte_issues: lteIssues,
        results_data: JSON.stringify(auditData),
        solutions: JSON.stringify({
          recommendations: [
            "Vérifier les configurations CAMEL pour les opérateurs en erreur",
            "Mettre à jour les accords GPRS manquants",
            "Configurer les services 3G/4G pour les opérateurs concernés"
          ]
        }),
        attachments: JSON.stringify([]),
        validation_notes: null,
        implemented_changes: null
      };

      console.log('Envoi des données du rapport:', reportData);

      // Envoi des données au backend pour sauvegarde
      const response = await fetch('http://localhost:5178/save-audit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde du rapport');
      }

      // Afficher un message de succès
      alert('Rapport généré avec succès !');

      // Redirection vers la page RapportAudit
      navigate('/rapport-audit');
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Une erreur est survenue lors de la génération du rapport: ' + error.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <FaCheckCircle className="text-[#34C759]" />;
      case "error":
        return <FaExclamationCircle className="text-[#FF3737]" />;
      case "failed":
        return <FaTimesCircle className="text-[#FF3737]" />;
      case "running":
        return <FaSpinner className="animate-spin text-[#34C759]" />;
      default:
        return <FaPlay className="text-[#34C759]" />;
    }
  };

  const renderTestResults = () => {
    if (!selectedTest) return null;

    const mockResults = {
      "Partenaires Roaming & Services": {
        details: [
          { name: "GSM", status: "success", message: "Service GSM actif et fonctionnel" },
          { name: "CAMEL", status: "success", message: "Service CAMEL correctement configuré" },
          { name: "GPRS", status: "success", message: "Service GPRS opérationnel" },
          { name: "LTE", status: "success", message: "Service LTE disponible" }
        ]
      },
      "Inbound Roaming": {
        type: "table",
        headers: [
          "Opérateur",
          "Route Provisioning SCCP",
          "VPLMN IR21 sur HPLMN MSS/MSC",
          "Implémentation de l'IMSI",
          "Conversion IMSI / MGT",
          "Table de Routage (E.214 & E.212)",
          "VPLMN MSISDN & MSRN (HPLMN)",
          "Commentaires"
        ],
        data: [
          {
            operateur: "Mobilis",
            routeProvisioning: "✅ Réussi",
            vplmnIr21: "✅ Réussi",
            implementationImsi: "✅ Réussi",
            conversionImsi: "✅ Réussi",
            tableRoutage: "✅ Réussi",
            vplmnMsisdn: "✅ Réussi",
            commentaires: "Test effectué avec succès, aucune anomalie détectée."
          },
          {
            operateur: "Orange",
            routeProvisioning: "✅ Réussi",
            vplmnIr21: "✅ Réussi",
            implementationImsi: "✅ Réussi",
            conversionImsi: "✅ Réussi",
            tableRoutage: "✅ Réussi",
            vplmnMsisdn: "✅ Réussi",
            commentaires: "Aucune déviation dans les configurations. Service stable."
          },
          {
            operateur: "Djezzy",
            routeProvisioning: "✅ Réussi",
            vplmnIr21: "✅ Réussi",
            implementationImsi: "✅ Réussi",
            conversionImsi: "✅ Réussi",
            tableRoutage: "✅ Réussi",
            vplmnMsisdn: "✅ Réussi",
            commentaires: "Test conforme aux attentes, pas de problème majeur."
          },
          {
            operateur: "Ooredoo",
            routeProvisioning: "✅ Réussi",
            vplmnIr21: "✅ Réussi",
            implementationImsi: "✅ Réussi",
            conversionImsi: "✅ Réussi",
            tableRoutage: "✅ Réussi",
            vplmnMsisdn: "✅ Réussi",
            commentaires: "Les tests ont montré que tout fonctionne correctement."
          }
        ]
      },
      "Outbound Roaming": {
        details: [
          { name: "Connectivité", status: "success", message: "Connectivité établie" },
          { name: "Authentification", status: "success", message: "Authentification réussie" },
          { name: "Services", status: "success", message: "Tous les services disponibles" }
        ]
      },
      "Test d'appel vocal": {
        details: [
          { name: "Appels entrants", status: "success", message: "Appels entrants fonctionnels" },
          { name: "Appels sortants", status: "success", message: "Appels sortants fonctionnels" },
          { name: "Qualité audio", status: "success", message: "Qualité audio optimale" }
        ]
      },
      "Test SMS": {
        details: [
          { name: "Envoi SMS", status: "success", message: "Envoi SMS fonctionnel" },
          { name: "Réception SMS", status: "success", message: "Réception SMS fonctionnelle" },
          { name: "Délai de livraison", status: "success", message: "Délai de livraison conforme" }
        ]
      },
      "Test données mobiles": {
        details: [
          { name: "3G", status: "success", message: "Connexion 3G établie" },
          { name: "4G", status: "success", message: "Connexion 4G établie" },
          { name: "Débit", status: "success", message: "Débit conforme aux attentes" }
        ]
      }
    };

    const results = mockResults[selectedTest.name] || { details: [] };

    if (results.type === "table") {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Résultats détaillés - {selectedTest.name}</h2>
              <button 
                onClick={handleCloseResults}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-50">
                  <tr>
                    {results.headers.map((header, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.operateur}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.routeProvisioning}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.vplmnIr21}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.implementationImsi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.conversionImsi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tableRoutage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.vplmnMsisdn}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.commentaires}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseResults}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    // Retourner le rendu par défaut pour les autres types de résultats
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Résultats détaillés - {selectedTest.name}</h2>
            <button 
              onClick={handleCloseResults}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            {results.details.map((detail, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(detail.status)}
                    <span className="font-medium text-gray-800">{detail.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    detail.status === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {detail.status === "success" ? "Réussi" : "Échec"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{detail.message}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCloseResults}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
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
                  <span className="ml-2">{test.status === "running" ? "En cours..." : test.status === "success" ? "Succès" : test.status === "failed" ? "Échoué" : test.status === "pending" ? "En attente" : test.status}</span>
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
                    {test.name === "Outbound Roaming" && (
                      <button
                        onClick={() => {
                          setSelectedTest(test);
                          handleGenerateReport();
                        }}
                        className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
                      >
                        <FaChartBar />
                        <span>Générer un rapport</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderMapView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.map((test) => (
        <motion.div 
          key={test.id} 
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{test.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {`${test.description} [${selectedCountry} - ${selectedOperator}]`}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Dernier résultat :</span>
              <div className="flex items-center space-x-1">
                {test.status === "running" ? (
                  <FaSpinner className="animate-spin text-gray-500 w-3 h-3" />
                ) : (
                  getStatusIcon(test.status)
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  test.status === "success" ? "bg-green-100 text-green-600" :
                  test.status === "failed" ? "bg-red-100 text-red-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {test.status === "pending" ? "En attente" : 
                   test.status === "running" ? "En cours" :
                   test.status === "success" ? "Réussi" : "Échec"}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleRunTest(test.id)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                disabled={test.status === "running"}
              >
                {test.status === "running" ? (
                  <FaSpinner className="animate-spin text-white" />
                ) : (
                  getStatusIcon(test.status)
                )}
                <span>{test.status === "running" ? "En cours..." : "Lancer"}</span>
              </button>
              <button
                onClick={() => handleShowResults(test)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <FaChartBar />
                <span>Résultats</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAuditTable = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
        {/* Bouton Générer un rapport en haut du tableau d'audit */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setSelectedTest(tests.find(t => t.name === "Partenaires Roaming & Services"));
              handleGenerateReport();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
          <motion.select
            id="country"
            value={selectedCountry}
            onChange={(e) => {
              const country = e.target.value;
              setSelectedCountry(country);
              setSelectedOperator(operatorData[country][0]);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            whileHover={{ borderColor: 'rgb(59 130 246)' }}
            whileFocus={{ borderColor: 'rgb(59 130 246)' }}
          >
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </motion.select>
        </div>

        <div className="flex-1">
          <label htmlFor="operator" className="block text-sm font-medium text-gray-700 mb-2">Opérateur</label>
          <motion.select
            id="operator"
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            whileHover={{ borderColor: 'rgb(59 130 246)' }}
            whileFocus={{ borderColor: 'rgb(59 130 246)' }}
          >
            {operators.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </motion.select>
        </div>
      </div>

      {viewMode === 'table' ? renderTableView() : renderMapView()}
      {showResults && renderTestResults()}
      {showAuditTable && renderAuditTable()}
    </motion.div>
  );
};

// (SUPPRIMÉ) Génération du rapport (TXT)
// function handleGenerateReport() { ... }


export default RoamingTests;