import React from "react";
import { Users, HeartHandshake, Lightbulb, UserCircle, Shield, Globe, Settings, BarChart } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-[600px] flex items-center justify-center overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/mobilis4.png')",
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative w-full max-w-2xl p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
            Fiers de notre histoire, tournés vers l'avenir
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-gray-700 mt-6 text-center">
            Nous nous engageons à transformer la manière dont chacun vit l'univers digital. 
            Notre mission est de permettre à nos clients à travers le monde de profiter pleinement d'Internet, 
            avec une expérience unique et personnalisée.
          </p>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Engageant",
              text: "Nous contribuons activement à nos communautés en construisant des réseaux fiables et sécurisés.",
              icon: <Users className="w-16 h-16 mx-auto mb-6 text-green-600" />
            },
            {
              title: "Soutenant",
              text: "Nous mettons un point d'honneur à rendre votre expérience fluide et transparente.",
              icon: <HeartHandshake className="w-16 h-16 mx-auto mb-6 text-green-600" />
            },
            {
              title: "Innovant",
              text: "Nous relevons les défis avec un regard neuf, toujours en quête d'excellence et d'innovation.",
              icon: <Lightbulb className="w-16 h-16 mx-auto mb-6 text-green-600" />
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border border-gray-100"
            >
              {item.icon}
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobilis Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full md:w-[55%] h-[700px] rounded-3xl shadow-2xl overflow-hidden"
              style={{ 
                backgroundImage: "url('/mobilis6.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            <motion.div 
              initial={{ x: 50 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full md:w-[45%]"
            >
              <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Mobilis Algérie</h2>
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    Filiale du Groupe Télécom Algérie, ATM Mobilis s'est imposé comme le premier opérateur mobile en Algérie depuis sa création en 2002. En août 2003, Mobilis a acquis son autonomie, lui permettant de se concentrer sur ses objectifs clés : la satisfaction et fidélisation des clients, l'innovation et le progrès technologique. Cette stratégie a porté ses fruits, avec une croissance fulgurante et l'acquisition de près de 23 millions d'abonnés en un temps record.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Mobilis s'est résolument engagé dans une politique de développement et d'innovation. L'entreprise travaille constamment à améliorer son image de marque et à offrir à ses clients une expérience optimale. En déployant un réseau de haute qualité, en assurant un service client irréprochable et en proposant des produits et services innovants, Mobilis se positionne comme un opérateur proche de ses partenaires et de ses clients. Sa signature institutionnelle, « Together we make the future », résume parfaitement cet engagement.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Mobilis est une entreprise qui embrasse la modernisation et la digitalisation. Nous nous engageons à développer notre image de marque et offrir le meilleur à nos clients grâce à un réseau de haute qualité, un service client exceptionnel et une gamme de produits et services innovants. Mobilis se positionne comme leader National du secteur de la téléphonie mobile.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Notre engagement se traduit par le déploiement d'une grande couverture réseau sur l'ensemble du territoire national, ainsi que par un service client attentif et réactif. Mobilis est un opérateur garantissant une assistance technique à ses partenaires.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Roaming Audit Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl shadow-xl"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Roaming Audit</h2>
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  L'audit de l'itinérance permet aux opérateurs de tirer pleinement parti de leur activité d'itinérance en maintenant à jour la configuration de l'itinérance. Des revenus sont perdus chaque jour en raison des modifications constantes des configurations des partenaires d'itinérance.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  L'audit de l'itinérance est une suite d'outils permettant aux équipes en charge de l'itinérance de gérer, auditer et collaborer sur tous les aspects liés à l'itinérance.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  L'audit de l'itinérance maintient une base de données des informations IR.21 provenant à la fois des opérateurs conformes RAEX et non conformes RAEX. Ces données peuvent ensuite être comparées à la configuration active du réseau pour signaler toute incohérence détectée.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  L'audit de l'itinérance valide l'analyse des IMSI, des différents Global Titles, ainsi que des plages IP dans les nœuds passerelles et les pare-feux.
                  Il s'agit d'un service web non intrusif que toute équipe d'itinérance peut utiliser.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Équipe</h2>
            <p className="text-lg text-gray-600">
              Une équipe d'experts dédiés à l'excellence et à l'innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sayah Khadidja",
                role: "Développeur Frontend",
                image: "/profile1.jpg",
                description: "Expert en développement d'interfaces utilisateur modernes et réactives."
              },
              {
                name: "Nemiri Lyna Ferial",
                role: "Chef de Projet",
                image: "/profile2.jpg",
                description: "Gestionnaire de projets avec une expertise en déploiement de réseaux."
              },
              {
                name: "Bechafi Yasmine",
                role: "Développeur Backend",
                image: "/profile3.jpg",
                description: "Expert en développement de services et d'API robustes."
              },
              {
                name: "Khelif Hadil",
                role: "Développeur Full Stack",
                image: "/profile4.jpg",
                description: "Spécialiste en développement d'applications web complètes."
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Nos Compétences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Globe className="h-12 w-12 text-green-600" />,
                  title: "Réseaux",
                  description: "Expertise en déploiement et maintenance de réseaux de télécommunications"
                },
                {
                  icon: <Settings className="h-12 w-12 text-green-600" />,
                  title: "Solutions",
                  description: "Développement de solutions innovantes pour les opérateurs"
                },
                {
                  icon: <Shield className="h-12 w-12 text-green-600" />,
                  title: "Sécurité",
                  description: "Protection et sécurisation des infrastructures réseau"
                },
                {
                  icon: <BarChart className="h-12 w-12 text-green-600" />,
                  title: "Performance",
                  description: "Optimisation et monitoring des performances réseau"
                }
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center"
                >
                  <div className="flex justify-center mb-6">
                    {skill.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{skill.title}</h4>
                  <p className="text-gray-600">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
