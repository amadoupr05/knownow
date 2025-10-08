import React from 'react';
import { BookOpen, Users, TrendingUp, DollarSign, Check, Play } from 'lucide-react';

function GettingStartedView() {
  return (
    <div className="space-y-8 p-8">
      <div className="bg-gradient-to-r from-[#4F6D0B] to-[#7DA81E] p-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue sur KN!
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Commencez votre aventure d'enseignement en ligne et aidez des milliers d'élèves à réussir
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comment ça marche?
        </h2>

        <div className="space-y-6">
          <div className="bg-white shadow-sm p-6 border-l-4 border-[#4F6D0B]">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#4F6D0B] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Créez votre profil d'enseignant
                </h3>
                <p className="text-gray-600 mb-3">
                  Renseignez vos informations, vos domaines d'expertise et votre expérience.
                  Un profil complet attire plus d'élèves et augmente votre crédibilité.
                </p>
                <span className="inline-flex items-center text-green-600 text-sm">
                  <Check className="w-4 h-4 mr-1" />
                  Complété
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Créez du contenu pédagogique
                </h3>
                <p className="text-gray-600 mb-3">
                  Commencez par publier des questions et des exercices pour vous faire connaître.
                  Plus votre contenu est de qualité, plus vous gagnerez en visibilité.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Créez des questions détaillées avec des explications claires</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Proposez des exercices variés et progressifs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Répondez aux questions des élèves dans le forum</span>
                  </li>
                </ul>
                <button className="px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600 transition">
                  Commencer à créer du contenu
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Créez vos premiers programmes
                </h3>
                <p className="text-gray-600 mb-3">
                  Une fois que vous avez du contenu de base, créez des programmes complets.
                  Structurez vos cours avec des objectifs d'apprentissage clairs.
                </p>
                <div className="bg-purple-50 p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Structure recommandée:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ Objectifs d'apprentissage précis</li>
                    <li>✓ Contenu structuré par modules</li>
                    <li>✓ Exercices d'application</li>
                    <li>✓ Évaluations régulières</li>
                  </ul>
                </div>
                <button className="px-4 py-2 bg-purple-500 text-white font-medium hover:bg-purple-600 transition">
                  Créer mon premier programme
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Générez des revenus
                </h3>
                <p className="text-gray-600 mb-3">
                  Vos programmes payants et l'engagement sur vos contenus vous génèrent des revenus.
                  Plus vous êtes actif et qualitatif, plus vos revenus augmentent.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-3">
                    <div className="text-2xl font-bold text-green-600 mb-1">30%</div>
                    <div className="text-xs text-gray-600">Commission plateforme</div>
                  </div>
                  <div className="bg-green-50 p-3">
                    <div className="text-2xl font-bold text-green-600 mb-1">70%</div>
                    <div className="text-xs text-gray-600">Votre part sur les ventes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Conseils pour réussir sur KN
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Soyez régulier</h3>
              <p className="text-sm text-gray-600">
                Publiez du contenu régulièrement pour maintenir votre visibilité
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Engagez-vous</h3>
              <p className="text-sm text-gray-600">
                Répondez aux questions et interagissez avec la communauté
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Analysez vos stats</h3>
              <p className="text-sm text-gray-600">
                Utilisez la section Performance pour optimiser votre contenu
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Proposez de la valeur</h3>
              <p className="text-sm text-gray-600">
                Concentrez-vous sur la qualité plutôt que la quantité
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Prêt à commencer?
        </h2>
        <p className="text-gray-600 mb-6">
          Rejoignez des centaines d'enseignants qui font déjà une différence
        </p>
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-[#4F6D0B] text-white font-semibold hover:bg-[#4F6D0B]/90 transition">
          <Play className="w-5 h-5" />
          <span>Créer mon premier contenu</span>
        </button>
      </div>
    </div>
  );
}

export default GettingStartedView;
