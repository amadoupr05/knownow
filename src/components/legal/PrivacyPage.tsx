import React from 'react';
import { ArrowLeft } from 'lucide-react';

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Collecte des Données</h2>
            <p className="text-gray-700">
              Nous collectons uniquement les informations nécessaires pour fournir nos services éducatifs :
            </p>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-2">
              <li>Informations d'identification (nom, prénom)</li>
              <li>Informations scolaires (établissement, niveau)</li>
              <li>Données d'utilisation de la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Utilisation des Données</h2>
            <p className="text-gray-700">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-2">
              <li>Personnaliser votre expérience d'apprentissage</li>
              <li>Améliorer nos services éducatifs</li>
              <li>Communiquer des informations importantes sur votre parcours</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Protection des Données</h2>
            <p className="text-gray-700">
              Nous mettons en œuvre des mesures de sécurité pour protéger vos données :
            </p>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-2">
              <li>Chiffrement des données sensibles</li>
              <li>Accès restreint aux informations personnelles</li>
              <li>Surveillance régulière de nos systèmes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Droits des Utilisateurs</h2>
            <p className="text-gray-700">
              Vous disposez des droits suivants concernant vos données :
            </p>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-2">
              <li>Accès à vos données personnelles</li>
              <li>Rectification des informations inexactes</li>
              <li>Suppression de vos données</li>
              <li>Opposition au traitement de vos données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact</h2>
            <p className="text-gray-700">
              Pour toute question concernant vos données personnelles, contactez notre équipe :
            </p>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">Email : n.mady@bayaala.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;