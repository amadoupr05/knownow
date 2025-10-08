import React from 'react';
import { Users, TrendingUp, BookOpen, DollarSign, Play, CheckCircle, Award, Target } from 'lucide-react';

function TeachWithUsView() {
  const handleGetStarted = () => {
    const event = new CustomEvent('openLogin', { detail: { asTeacher: true } });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#2C5F2D] via-[#4F6D0B] to-[#7DA81E] text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Venez enseigner avec nous
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Rejoignez une communauté d'enseignants passionnés et partagez vos connaissances
                avec des milliers d'élèves à travers le Cameroun
              </p>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-[#4F6D0B] font-bold text-lg hover:bg-gray-100 transition"
              >
                <span>Commencer</span>
                <Play className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">15K+</div>
                <div className="text-white/80">Élèves actifs</div>
              </div>
              <div className="bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-white/80">Enseignants</div>
              </div>
              <div className="bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">2000+</div>
                <div className="text-white/80">Programmes</div>
              </div>
              <div className="bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-white/80">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pourquoi enseigner sur KN?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme pensée pour les enseignants, avec tous les outils nécessaires
            pour créer, gérer et monétiser vos contenus pédagogiques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Large audience</h3>
            <p className="text-gray-600">
              Accédez à des milliers d'élèves motivés cherchant à améliorer leurs résultats
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenus attractifs</h3>
            <p className="text-gray-600">
              Gardez 70% de vos ventes et bénéficiez de paiements mensuels réguliers
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Outils puissants</h3>
            <p className="text-gray-600">
              Éditeur mathématique avancé, gestion de contenu intuitive, statistiques détaillées
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reconnaissance</h3>
            <p className="text-gray-600">
              Construisez votre réputation et devenez une référence dans votre domaine
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Comment ça marche
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8">
              <div className="w-12 h-12 bg-[#4F6D0B] text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Créez votre compte</h3>
              <p className="text-gray-600">
                Inscrivez-vous en quelques minutes et complétez votre profil d'enseignant
              </p>
            </div>

            <div className="bg-white p-8">
              <div className="w-12 h-12 bg-[#4F6D0B] text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Créez votre contenu</h3>
              <p className="text-gray-600">
                Utilisez nos outils pour créer des programmes, exercices et contenus de qualité
              </p>
            </div>

            <div className="bg-white p-8">
              <div className="w-12 h-12 bg-[#4F6D0B] text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Gagnez de l'argent</h3>
              <p className="text-gray-600">
                Publiez vos programmes et commencez à générer des revenus dès maintenant
              </p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Ce que disent nos enseignants
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-md border-t-4 border-[#4F6D0B]">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Mme Ngo Balla</div>
                  <div className="text-sm text-gray-600">Prof. de Mathématiques</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "KN m'a permis d'atteindre bien plus d'élèves que je ne l'aurais jamais imaginé.
                La plateforme est intuitive et le support excellent."
              </p>
            </div>

            <div className="bg-white p-6 shadow-md border-t-4 border-[#4F6D0B]">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">M. Kamga Jean</div>
                  <div className="text-sm text-gray-600">Prof. de Physique</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "En 6 mois, j'ai créé 15 programmes et généré des revenus significatifs.
                C'est une vraie révolution pour l'éducation au Cameroun."
              </p>
            </div>

            <div className="bg-white p-6 shadow-md border-t-4 border-[#4F6D0B]">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Mme Fouda Marie</div>
                  <div className="text-sm text-gray-600">Prof. de Français</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "J'adore la flexibilité qu'offre KN. Je peux créer du contenu à mon rythme
                et mes élèves progressent vraiment."
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer votre aventure d'enseignement?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'enseignants qui transforment déjà l'éducation
            et génèrent des revenus avec leurs connaissances
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 font-bold text-lg hover:bg-gray-100 transition"
          >
            <span>Créer mon compte enseignant</span>
            <Play className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Questions fréquentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 shadow-sm border-l-4 border-[#4F6D0B]">
              <h3 className="font-semibold text-gray-900 mb-2">
                Ai-je besoin d'être enseignant certifié?
              </h3>
              <p className="text-gray-600">
                Non, nous accueillons tous les experts passionnés. Que vous soyez enseignant certifié,
                répétiteur ou professionnel, vous pouvez partager vos connaissances.
              </p>
            </div>

            <div className="bg-white p-6 shadow-sm border-l-4 border-[#4F6D0B]">
              <h3 className="font-semibold text-gray-900 mb-2">
                Comment suis-je rémunéré?
              </h3>
              <p className="text-gray-600">
                Vous recevez 70% du prix de vente de vos programmes. Les paiements sont effectués
                mensuellement via mobile money ou virement bancaire.
              </p>
            </div>

            <div className="bg-white p-6 shadow-sm border-l-4 border-[#4F6D0B]">
              <h3 className="font-semibold text-gray-900 mb-2">
                Combien de temps faut-il pour créer un programme?
              </h3>
              <p className="text-gray-600">
                Cela dépend de la complexité, mais avec nos outils, vous pouvez créer votre
                premier programme en quelques heures seulement.
              </p>
            </div>

            <div className="bg-white p-6 shadow-sm border-l-4 border-[#4F6D0B]">
              <h3 className="font-semibold text-gray-900 mb-2">
                Y a-t-il des frais d'inscription?
              </h3>
              <p className="text-gray-600">
                Non, l'inscription et l'utilisation de la plateforme sont entièrement gratuites.
                Nous ne prenons qu'une commission sur les ventes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeachWithUsView;
