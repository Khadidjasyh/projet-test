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
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('Tous');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  const countries = Object.keys(operatorData);
  const operators = operatorData[selectedCountry] || [];

  // Données spécifiques pour le premier test
  const auditData = [
    {
      partenaire: "Orange France",
      accord: "Bilatéral",
      gsm: true,
      camel: true,
      gprs: true,
      "3g": true,
      lte: true,
      parametresLte: true,
      erreurs: false,
      commentaires: "Aucun",
      rapport: "Conforme, aucun écart identifié"
    },
    {
      partenaire: "Vodafone UK",
      accord: "Bilatéral",
      gsm: true,
      camel: false,
      gprs: true,
      "3g": true,
      lte: true,
      parametresLte: false,
      erreurs: true,
      commentaires: "CAMEL manquant",
      rapport: "Non conforme – manque service CAMEL"
    },
    {
      partenaire: "TIM Italie",
      accord: "Unilatéral",
      gsm: true,
      camel: true,
      gprs: false,
      "3g": true,
      lte: false,
      parametresLte: null,
      erreurs: true,
      commentaires: "GPRS non activé",
      rapport: "Partiel – GPRS manquant, pas de LTE"
    },
    {
      partenaire: "T-Mobile US",
      accord: "Bilatéral",
      gsm: true,
      camel: true,
      gprs: true,
      "3g": true,
      lte: true,
      parametresLte: true,
      erreurs: false,
      commentaires: "OK",
      rapport: "Conforme – tous services activés"
    },
    {
      partenaire: "MTN Afrique",
      accord: "Bilatéral",
      gsm: true,
      camel: false,
      gprs: false,
      "3g": false,
      lte: false,
      parametresLte: false,
      erreurs: true,
      commentaires: "Plusieurs services indisponibles",
      rapport: "Non conforme – nombreux services KO"
    },
    {
      partenaire: "Telefonica ES",
      accord: "Bilatéral",
      gsm: true,
      camel: true,
      gprs: true,
      "3g": true,
      lte: true,
      parametresLte: true,
      erreurs: false,
      commentaires: "OK",
      rapport: "Conforme – pas de blocage détecté"
    }
  ];

  const handleRunTest = (testId) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, status: "running" } 
        : test
    ));

    setTimeout(() => {
      const randomStatus = Math.random() > 0.5 ? "success" : "failed";
      setTests(tests.map(test => 
        test.id === testId 
          ? { ...test, status: randomStatus } 
          : test
      ));
    }, 2000);
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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tests.map((test) => (
            <tr key={test.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{test.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{test.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getStatusIcon(test.status)}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    test.status === "success" ? "bg-green-100 text-green-600" :
                    test.status === "failed" ? "bg-red-100 text-red-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {test.status === "pending" ? "En attente" : 
                     test.status === "running" ? "En cours" :
                     test.status === "success" ? "Réussi" : "Échec"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleRunTest(test.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
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
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackToTests}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft />
              <span>Retour aux tests</span>
            </button>
            <div className="text-sm text-gray-500">
              Total des partenaires : {auditData.length}
            </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partenaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accord</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAMEL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPRS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3G</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTE/4G</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paramètres LTE OK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Erreurs détectées</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rapport</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.partenaire}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.accord}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.gsm ? "✔️" : "❌"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.camel ? "✔️" : "❌"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.gprs ? "✔️" : "❌"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row["3g"] ? "✔️" : "❌"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.lte ? "✔️" : "❌"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.parametresLte === null ? "N/A" : row.parametresLte ? "✔️" : "❌"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.erreurs ? "❌" : "✔️"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.commentaires}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.rapport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const handleGenerateReport = async () => {
    try {
      // Créer le contenu du rapport
      const reportContent = `
Rapport du test : ${selectedTest.type}
Date : ${new Date().toLocaleDateString()}
Heure : ${new Date().toLocaleTimeString()}

Tableau des résultats :
Pays           | Opérateur                        | Commentaire
--------------------------------------------------------------
${testResults.map(result => `${result.country.padEnd(15)} | ${result.operator.padEnd(35)} | ${result.issues.join(', ')}`).join('\n')}

Solutions :
${solutions.map(solution => `- ${solution}`).join('\n')}
      `;

      // Créer un objet FormData pour envoyer le fichier et les données
      const formData = new FormData();
      formData.append('report', new Blob([reportContent], { type: 'text/plain' }));
      formData.append('title', `Rapport ${selectedTest.type}`);
      formData.append('test_type', selectedTest.type);
      formData.append('created_by', currentUser.name);
      formData.append('total_operators', testResults.length);
      formData.append('total_issues', testResults.reduce((acc, result) => acc + result.issues.length, 0));
      formData.append('camel_issues', testResults.filter(result => result.issues.includes('CAMEL non disponible')).length);
      formData.append('gprs_issues', testResults.filter(result => result.issues.includes('GPRS non disponible')).length);
      formData.append('threeg_issues', testResults.filter(result => result.issues.includes('TROISG non disponible')).length);
      formData.append('lte_issues', testResults.filter(result => result.issues.includes('LTE non disponible')).length);
      formData.append('results_data', JSON.stringify(testResults));
      formData.append('solutions', JSON.stringify(solutions));

      // Envoyer les données au backend
      const response = await fetch('http://localhost:5178/api/audit-reports', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde du rapport');
      }

      const data = await response.json();
      alert('Rapport généré et sauvegardé avec succès');
      
      // Rediriger vers la page des rapports
      navigate('/rapports-audit');
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Erreur lors de la génération du rapport');
    }
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

export default RoamingTests;