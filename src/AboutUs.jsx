import React from 'react';
import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-green-600 sm:text-5xl sm:tracking-tight lg:text-6xl">
            À propos de Mobilis
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Découvrez notre mission, notre vision et notre équipe dédiée.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-3xl font-bold text-green-600 mb-6">Notre Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Chez Mobilis, nous nous engageons à fournir des solutions innovantes pour 
                simplifier la gestion des audits et optimiser les processus métiers de nos clients.
              </p>
              <p className="text-lg text-gray-600">
                Notre plateforme permet une gestion transparente et efficace des rapports d'audit, 
                offrant une visibilité en temps réel sur les performances.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <img
                className="w-full rounded-lg shadow-xl"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Équipe Mobilis"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "Nous repoussons constamment les limites technologiques pour offrir des solutions avant-gardistes.",
                icon: "💡"
              },
              {
                title: "Transparence",
                description: "Nos processus sont clairs et nos communications sans ambiguïté.",
                icon: "🔍"
              },
              {
                title: "Engagement",
                description: "Nous nous engageons pleinement envers l'excellence et la satisfaction client.",
                icon: "🤝"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-green-600 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section - Version mise à jour avec votre équipe */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-green-600 mb-8 text-center">Notre Équipe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sayah Khadidja */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
              <div className="mx-auto h-40 w-40 bg-green-100 rounded-full flex items-center justify-center text-5xl mb-4 font-bold text-green-600">
                SK
              </div>
              <h3 className="text-xl font-bold text-gray-900">Sayah Khadidja</h3>
              <p className="text-green-600 mb-2">Chef de Projet</p>
              <p className="text-gray-600">20 ans d'expérience dans le secteur des télécommunications</p>
            </div>

            {/* Nemiri Lyna */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
              <div className="mx-auto h-40 w-40 bg-blue-100 rounded-full flex items-center justify-center text-5xl mb-4 font-bold text-blue-600">
                NL
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nemiri Lyna</h3>
              <p className="text-green-600 mb-2">Développeuse Frontend</p>
              <p className="text-gray-600">Spécialiste React et expérience utilisateur</p>
            </div>

            {/* Bechafi Yasmine */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
              <div className="mx-auto h-40 w-40 bg-yellow-100 rounded-full flex items-center justify-center text-5xl mb-4 font-bold text-yellow-600">
                BY
              </div>
              <h3 className="text-xl font-bold text-gray-900">Bechafi Yasmine</h3>
              <p className="text-green-600 mb-2">Responsable Qualité</p>
              <p className="text-gray-600">Assurance qualité et tests utilisateurs</p>
            </div>

            {/* Hadil Khelif */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
              <div className="mx-auto h-40 w-40 bg-red-100 rounded-full flex items-center justify-center text-5xl mb-4 font-bold text-red-600">
                HK
              </div>
              <h3 className="text-xl font-bold text-gray-900">Hadil Khelif</h3>
              <p className="text-green-600 mb-2">Développeuse Backend</p>
              <p className="text-gray-600">Expert en bases de données et API</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Prêt à commencer ?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Rejoignez les nombreuses entreprises qui nous font déjà confiance.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;