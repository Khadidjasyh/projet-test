import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-10">
      {/* Section avec texte et image */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl w-full mb-20">
        <div className="text-left">
          <h1 className="text-5xl font-extrabold text-green-600">
            Optimisez votre itinérance avec une solution d'audit intelligente et automatisée
          </h1>
        </div>

        <div className="flex justify-center">
          <img
            src="/Mobilia-scaled.jpeg.webp"
            alt="Audit Roaming Illustration"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Section des mini-images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full mb-16 text-center">
        {[
          { src: "/1651144761097.jpeg", title: "Gestion des coûts" },
          { src: "/1690045848182.jpeg", title: "Surveillance en temps réel" },
          { src: "/1695627008916.jpeg", title: "Rapports détaillés" },
          { src: "/Damjan (1).png", title: "Support 24/7" }
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={item.src}
              alt={item.title}
              className="w-10 h-10 object-cover rounded-md shadow-sm"
            />
            <p className="text-sm text-gray-700 mt-2 font-semibold">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Section des 3 grandes images */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full text-center">
        {[
          { src: "/260px-Pie-chart.jpg", title: "TABLEAU DE BORD INTERACTIF", text: "Visualisez vos données et suivez l'évolution en temps réel." },
          { src: "/téléchargement.png", title: "GÉNÉRATION DE RAPPORTS", text: "Téléchargez des rapports détaillés pour une meilleure analyse." },
          { src: "/avertissement-précaution-attention-icône-d-alerte-point-exclamation-en-forme-de-triangle-vecteur-stock-161619022.webp", title: "ALERTE AUTOMATIQUE", text: "Recevez des alertes en cas de dépassement des seuils." }
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={item.src}
              alt={item.title}
              className="w-32 h-32 rounded-lg shadow-md"
            />
            <h2 className="text-lg font-bold text-green-600 mt-3">{item.title}</h2>
            <p className="text-sm text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Comparaison Automatique */}
      <div className="flex justify-center my-16">
        <div className="flex flex-col items-center text-center">
          <img
            src="/comparer-deux-fichiers-excel.webp"
            alt="Comparaison Automatique"
            className="w-28 h-28 rounded-lg shadow-md"
          />
          <h2 className="text-lg font-bold text-green-600 mt-3">
            COMPARAISON AUTOMATIQUE
          </h2>
          <p className="text-sm text-gray-700 max-w-sm">
            Comparez vos usages et optimisez vos coûts grâce à une analyse intelligente.
          </p>
        </div>
      </div>

      {/* Audit - Image à gauche, texte à droite */}
      <div className="my-16 flex flex-col items-center justify-center px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl w-full">
          <div className="flex justify-center">
            <img
              src="/1651144761097.jpeg"
              alt="Audit Illustration"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>

          <div className="text-left">
            <h2 className="text-4xl font-extrabold text-green-600 mb-4">
              Optimisation et automatisation de l'audit d'itinérance
            </h2>
            <p className="text-lg text-gray-700">
              Notre solution révolutionne la gestion de l'itinérance en automatisant l'audit des fichiers IR.21/IR.85 et en réduisant les erreurs humaines. Grâce à l'intégration intelligente des données et à la comparaison automatisée des configurations réseau, nous garantissons un processus plus rapide, plus fiable et plus efficace. Les anomalies sont détectées en temps réel pour une correction immédiate, assurant ainsi une qualité optimale pour les utilisateurs.
            </p>
          </div>
        </div>
      </div>

      {/* Nouvelle Section ajoutée avec les textes et images */}
      <div className="max-w-6xl w-full my-16">
        {/* Première partie - Texte à gauche, image à droite */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-16">
          {/* Texte à gauche */}
          <div className="text-left">
            <h2 className="text-3xl font-bold text-green-600">
              Une Technologie Innovante pour une Performance Maximale
            </h2>
            <p className="text-gray-700 text-lg mt-2">
              Contrairement aux méthodes traditionnelles encore largement basées sur des interventions manuelles, notre solution offre une <span className="font-semibold">automatisation complète de l'audit.</span> 
              Elle intègre un <span className="font-semibold">tableau de bord interactif</span> qui permet une visualisation en temps réel des résultats, un suivi détaillé des erreurs et des recommandations de correction.
            </p>
            <p className="text-gray-700 text-lg mt-2">
              De plus, notre technologie est entièrement compatible avec InfoCenter et les formats standardisés (RAEX, XML), garantissant une intégration fluide et une gestion optimisée des accords d'itinérance.
            </p>
          </div>

          {/* Image à droite */}
          <div className="flex justify-center">
            <img
              src="/innovations-dans-domaine-technologies-durables_624163-1944.jpg"
              alt="Technologie Innovante"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Deuxième partie - Image à gauche, texte à droite */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Image à gauche */}
          <div className="flex justify-center">
            <img
              src="/1695627008916.jpeg"
              alt="Impact Qualité et Rentabilité"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>

          {/* Texte à droite */}
          <div className="text-left">
            <h2 className="text-3xl font-bold text-green-600">
              Un Impact Concret sur la Qualité et la Rentabilité
            </h2>
            <p className="text-gray-700 text-lg mt-2">
              Avant notre solution, l'audit manuel entraînait un risque accru d'erreurs, des délais de correction longs et des interruptions de service potentielles, impactant directement l'expérience utilisateur et la rentabilité des services d'itinérance.
            </p>
            <p className="text-gray-700 text-lg mt-2">
              Grâce à notre approche automatisée, <span className="font-semibold">Mobilis bénéficie désormais d'un audit rapide et précis</span>, d'une détection préventive des incohérences et d'un suivi en temps réel via une interface intuitive.
            </p>
            <p className="text-gray-700 text-lg mt-2">
              En optimisant la gestion des accords d'itinérance et en minimisant les erreurs, nous aidons les opérateurs à maximiser leurs revenus et améliorer la satisfaction de leurs abonnés.
            </p>
          </div>
        </div>
      </div>

      {/* New Simple Footer */}
      <footer className="w-full py-8 mt-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <Link to="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
            Contact Us
          </Link>
          <Link to="/aboutus" className="text-gray-600 hover:text-green-600 transition-colors">
            About Us
          </Link>
        </div>
        <p className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} Mobilis. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;