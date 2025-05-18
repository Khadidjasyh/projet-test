import React, { useState, useMemo } from 'react';
import { FaQuestionCircle, FaBook, FaTools, FaFileAlt, FaSearch, FaDownload, FaUpload, FaEdit, FaChartBar, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const [activeSection, setActiveSection] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');

  const faqItems = [
    {
      question: "Comment importer un fichier ?",
      answer: "Pour importer un fichier, cliquez sur le bouton 'Importer' dans la barre de navigation. Sélectionnez votre fichier et suivez les instructions à l'écran. Les formats acceptés sont : .xlsx, .csv, .log, .xml, .pdf"
    },
    {
      question: "Comment importer un fichier XML ?",
      answer: "Pour importer un fichier XML, assurez-vous que le fichier respecte le schéma XSD défini. Cliquez sur 'Importer' et sélectionnez votre fichier XML. Le système validera automatiquement la structure du fichier avant l'importation."
    },
    {
      question: "Comment importer un fichier PDF ?",
      answer: "Pour importer un fichier PDF, sélectionnez le fichier via le bouton 'Importer'. Le système extraira automatiquement les données tabulaires du PDF. Assurez-vous que le PDF contient des tableaux bien structurés pour une extraction optimale."
    },
    {
      question: "Comment modifier les données ?",
      answer: "Cliquez sur le bouton 'Modifier' à côté de la ligne que vous souhaitez modifier. Une fois les modifications effectuées, cliquez sur 'Enregistrer'. Les modifications seront immédiatement appliquées."
    },
    {
      question: "Comment exporter les données ?",
      answer: "Pour exporter les données, cliquez sur le bouton 'Exporter' dans la barre d'outils. Vous pouvez choisir entre les formats CSV, Excel, XML ou PDF."
    },
    {
      question: "Comment filtrer les données ?",
      answer: "Utilisez la barre de recherche en haut du tableau pour filtrer les données. Vous pouvez également utiliser les filtres avancés en cliquant sur l'icône de filtre."
    },
    {
      question: "Comment consulter les statistiques ?",
      answer: "Accédez à la section 'Statistiques' dans le menu principal. Vous y trouverez des graphiques et des tableaux récapitulatifs de vos données."
    }
  ];

  const guides = [
    {
      title: "Guide d'importation de fichiers",
      content: "Apprenez à importer différents types de fichiers dans l'application. Ce guide couvre les formats acceptés (.xlsx, .csv, .log, .xml, .pdf), la structure des données et les bonnes pratiques.",
      icon: <FaUpload className="text-green-500 text-2xl mb-2" />,
      fullContent: `
        Pour importer un fichier :
        1. Cliquez sur le bouton 'Importer' dans la barre de navigation
        2. Sélectionnez votre fichier
        3. Vérifiez que le format est accepté (.xlsx, .csv, .log, .xml, .pdf)
        4. Suivez les instructions à l'écran
        5. Attendez la confirmation d'importation
        
        Bonnes pratiques :
        - Vérifiez le format du fichier avant l'importation
        - Assurez-vous que les données sont bien structurées
        - Sauvegardez une copie de votre fichier original
      `
    },
    {
      title: "Guide d'importation XML",
      content: "Guide complet pour l'importation de fichiers XML. Inclut les spécifications du schéma XSD, les exemples de structure et les bonnes pratiques pour une importation réussie.",
      icon: <FaFileAlt className="text-green-500 text-2xl mb-2" />,
      fullContent: `
        Importation de fichiers XML :
        1. Préparez votre fichier XML selon le schéma XSD
        2. Vérifiez la structure des données
        3. Cliquez sur 'Importer' et sélectionnez votre fichier
        4. Le système validera automatiquement la structure
        5. Attendez la confirmation d'importation
        
        Structure XML requise :
        - Respect du schéma XSD
        - Balises correctement fermées
        - Encodage UTF-8
      `
    },
    {
      title: "Guide d'importation PDF",
      content: "Découvrez comment importer efficacement des données depuis des fichiers PDF. Ce guide explique comment préparer vos PDF pour une extraction optimale des données.",
      icon: <FaFileAlt className="text-green-500 text-2xl mb-2" />,
      fullContent: `
        Importation de fichiers PDF :
        1. Assurez-vous que le PDF contient des tableaux
        2. Vérifiez la lisibilité du texte
        3. Cliquez sur 'Importer' et sélectionnez votre PDF
        4. Le système extraira les données tabulaires
        5. Vérifiez les données extraites
        
        Bonnes pratiques :
        - Utilisez des tableaux bien structurés
        - Évitez les PDF scannés
        - Vérifiez la qualité du texte
      `
    },
    {
      title: "Guide de modification des données",
      content: "Découvrez comment modifier efficacement vos données. Ce guide explique les différentes options d'édition et les validations en place.",
      icon: <FaEdit className="text-green-500 text-2xl mb-2" />,
      fullContent: `
        Modification des données :
        1. Cliquez sur le bouton 'Modifier' à côté de la ligne concernée
        2. Modifiez les champs nécessaires
        3. Vérifiez que les modifications respectent les règles de validation
        4. Cliquez sur 'Enregistrer' pour valider les changements
        5. Une confirmation s'affichera si la modification est réussie
        
        Règles de validation :
        - Les champs obligatoires doivent être remplis
        - Les formats de données doivent être respectés
        - Les valeurs doivent être dans les plages autorisées
      `
    },
    {
      title: "Guide d'exportation des données",
      content: "Maîtrisez l'exportation de vos données dans différents formats (CSV, Excel, XML, PDF). Ce guide détaille les options d'export et les formats disponibles.",
      icon: <FaDownload className="text-green-500 text-2xl mb-2" />,
      fullContent: `
        Exportation des données :
        1. Sélectionnez les données à exporter
        2. Cliquez sur le bouton 'Exporter'
        3. Choisissez le format d'export :
           - CSV : pour l'importation dans d'autres applications
           - Excel : pour l'analyse dans Microsoft Excel
           - XML : pour l'échange de données structurées
           - PDF : pour la documentation et l'impression
        4. Configurez les options d'export si nécessaire
        5. Téléchargez le fichier généré
        
        Options d'export :
        - Sélection des colonnes
        - Filtrage des données
        - Formatage des dates et nombres
        - Encodage du fichier
      `
    },
    {
      title: "Guide des statistiques",
      content: "Explorez les fonctionnalités statistiques de l'application. Ce guide vous montre comment interpréter les graphiques et les tableaux.",
      icon: <FaChartBar className="text-green-500 text-2xl mb-2" />,
      fullContent: `
        Utilisation des statistiques :
        1. Accédez à la section 'Statistiques'
        2. Sélectionnez la période d'analyse
        3. Choisissez les indicateurs à visualiser
        4. Explorez les différents types de graphiques :
           - Graphiques en barres
           - Graphiques en courbes
           - Graphiques circulaires
           - Tableaux de bord
        
        Fonctionnalités avancées :
        - Export des graphiques en image
        - Personnalisation des couleurs
        - Filtrage dynamique
        - Comparaison de périodes
      `
    }
  ];

  const technicalSupport = [
    {
      title: "Erreurs courantes",
      items: [
        "Erreur 404 : Page non trouvée - Vérifiez l'URL ou rafraîchissez la page",
        "Erreur 500 : Erreur serveur - Contactez le support technique",
        "Erreur d'authentification - Vérifiez vos identifiants",
        "Erreur d'importation XML - Vérifiez la structure du fichier",
        "Erreur d'importation PDF - Vérifiez le format du tableau",
        "Erreur de connexion - Vérifiez votre connexion internet"
      ]
    },
    {
      title: "Solutions rapides",
      items: [
        "Rafraîchissez la page (F5)",
        "Videz le cache du navigateur",
        "Vérifiez votre connexion internet",
        "Assurez-vous d'utiliser un navigateur à jour",
        "Contactez le support si le problème persiste"
      ]
    }
  ];

  const documentation = [
    {
      title: "API Documentation",
      content: "Documentation complète des endpoints API disponibles dans l'application. Inclut les méthodes, les paramètres et les réponses.",
      icon: <FaInfoCircle className="text-green-500 text-2xl mb-2" />
    },
    {
      title: "Formats de fichiers",
      content: "Liste des formats de fichiers acceptés et leurs spécifications :\n- Excel (.xlsx)\n- CSV (.csv)\n- Logs (.log)\n- XML (.xml) - avec validation XSD\n- PDF (.pdf) - extraction de tableaux\nInclut des exemples et des modèles pour chaque format.",
      icon: <FaFileAlt className="text-green-500 text-2xl mb-2" />
    },
    {
      title: "Bonnes pratiques",
      content: "Guide des bonnes pratiques pour l'utilisation de l'application. Inclut des conseils pour optimiser votre expérience.",
      icon: <FaExclamationTriangle className="text-green-500 text-2xl mb-2" />
    }
  ];

  // Fonction de filtrage pour la recherche
  const filterContent = (items) => {
    if (!searchTerm || !items) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      if (!item) return false;
      
      if (item.question) {
        return (item.question?.toLowerCase() || '').includes(term) || 
               (item.answer?.toLowerCase() || '').includes(term);
      }
      if (item.title) {
        return (item.title?.toLowerCase() || '').includes(term) || 
               (item.content?.toLowerCase() || '').includes(term);
      }
      if (item.items) {
        return item.items.some(item => (item?.toLowerCase() || '').includes(term));
      }
      return false;
    });
  };

  // Utilisation de useMemo pour optimiser les performances
  const filteredFaqItems = useMemo(() => filterContent(faqItems), [searchTerm, faqItems]);
  const filteredGuides = useMemo(() => filterContent(guides), [searchTerm, guides]);
  const filteredTechnicalSupport = useMemo(() => filterContent(technicalSupport), [searchTerm, technicalSupport]);
  const filteredDocumentation = useMemo(() => filterContent(documentation), [searchTerm, documentation]);

  // Fonction pour mettre en évidence le texte recherché
  const highlightText = (text) => {
    if (!searchTerm || !text) return text;
    try {
      const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === searchTerm.toLowerCase() 
          ? <span key={i} className="bg-green-100">{part}</span> 
          : part
      );
    } catch (error) {
      console.error('Erreur lors de la mise en évidence du texte:', error);
      return text;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Centre d'aide</h1>
          <p className="mt-2 text-gray-600">Trouvez des réponses à vos questions et apprenez à utiliser l'application</p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setActiveSection('faq')}
            className={`flex items-center p-4 rounded-lg ${
              activeSection === 'faq' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <FaQuestionCircle className="mr-2" />
            FAQ
          </button>
          <button
            onClick={() => setActiveSection('guides')}
            className={`flex items-center p-4 rounded-lg ${
              activeSection === 'guides' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <FaBook className="mr-2" />
            Guides
          </button>
          <button
            onClick={() => setActiveSection('support')}
            className={`flex items-center p-4 rounded-lg ${
              activeSection === 'support' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <FaTools className="mr-2" />
            Support
          </button>
          <button
            onClick={() => setActiveSection('docs')}
            className={`flex items-center p-4 rounded-lg ${
              activeSection === 'docs' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <FaFileAlt className="mr-2" />
            Documentation
          </button>
        </div>

        {/* Contenu des sections */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeSection === 'faq' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
              {filteredFaqItems.length === 0 ? (
                <p className="text-gray-600">Aucun résultat trouvé pour "{searchTerm}"</p>
              ) : (
                <div className="space-y-4">
                  {filteredFaqItems.map((item, index) => (
                    <div key={index} className="border-b pb-4">
                      <h3 className="font-semibold text-lg">{highlightText(item.question)}</h3>
                      <p className="text-gray-600 mt-2">{highlightText(item.answer)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'guides' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Guides d'utilisation</h2>
              {filteredGuides.length === 0 ? (
                <p className="text-gray-600">Aucun résultat trouvé pour "{searchTerm}"</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGuides.map((guide, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        {guide.icon}
                      </div>
                      <h3 className="font-semibold text-lg">{highlightText(guide.title)}</h3>
                      <p className="text-gray-600 mt-2">{highlightText(guide.content)}</p>
                      <button 
                        onClick={() => alert(guide.fullContent)}
                        className="text-green-500 mt-2 inline-block hover:text-green-600"
                      >
                        Voir le guide complet →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'support' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Support technique</h2>
              {filteredTechnicalSupport.length === 0 ? (
                <p className="text-gray-600">Aucun résultat trouvé pour "{searchTerm}"</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTechnicalSupport.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{highlightText(section.title)}</h3>
                      <ul className="list-disc pl-4">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-600 py-1">{highlightText(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'docs' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Documentation</h2>
              {filteredDocumentation.length === 0 ? (
                <p className="text-gray-600">Aucun résultat trouvé pour "{searchTerm}"</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredDocumentation.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        {doc.icon}
                      </div>
                      <h3 className="font-semibold text-lg">{highlightText(doc.title)}</h3>
                      <p className="text-gray-600 mt-2 whitespace-pre-line">{highlightText(doc.content)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 