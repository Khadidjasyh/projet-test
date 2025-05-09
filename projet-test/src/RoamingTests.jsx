import React, { useState } from 'react';
import {
  FaPlay,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import { motion } from 'framer-motion';
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
    name: "Test d'appel vocal",
    description: "Vérification des appels entrants et sortants en roaming.",
    status: "pending"
  },
  {
    id: 5,
    name: "Test SMS",
    description: "Vérification de l'envoi et réception de SMS en roaming.",
    status: "pending"
  },
  {
    id: 6,
    name: "Test données mobiles",
    description: "Vérification de la connectivité data (3G/4G) en roaming.",
    status: "pending"
  }
];

// Icônes pour l’état du test
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

const RoamingTests = () => {
  const [selectedCountry, setSelectedCountry] = useState("Afghanistan");
  const [selectedOperator, setSelectedOperator] = useState("Telecom Development Company Afghanistan Ltd.");
  const [tests, setTests] = useState(initialTests);

  const countries = Object.keys(operatorData);
  const operators = operatorData[selectedCountry] || [];

  const handleRunTest = (testId) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, status: "running" } 
        : test
    ));

    // Simuler un test qui prend 2 secondes
    setTimeout(() => {
      const randomStatus = Math.random() > 0.5 ? "success" : "failed";
      setTests(tests.map(test => 
        test.id === testId 
          ? { ...test, status: randomStatus } 
          : test
      ));
    }, 2000);
  };

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
        <h1 className="text-3xl font-bold text-green-600 mb-2">Tests de Roaming</h1>
        <p className="text-green-600 text-lg max-w-2xl">
          Gestion et exécution des tests d'itinérance pour les opérateurs internationaux
        </p>
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
              <button 
                onClick={() => handleRunTest(test.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
                disabled={test.status === "running"}
              >
                <div className="flex items-center space-x-2">
                  {test.status === "running" ? (
                    <FaSpinner className="animate-spin text-white" />
                  ) : (
                    getStatusIcon(test.status)
                  )}
                  <span>{test.status === "running" ? "En cours..." : "Lancer"}</span>
                </div>
              </button>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
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
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RoamingTests;