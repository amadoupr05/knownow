import React from 'react';
import { ArrowLeft } from 'lucide-react';

function TermsPage() {
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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales d'Utilisation</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptation des Conditions</h2>
            <p className="text-gray-700">
              En utilisant la plateforme éducative KN, vous acceptez d'être lié par ces conditions d'utilisation. 
              La plateforme est destinée aux élèves et enseignants de Côte d'Ivoire pour soutenir leur parcours éducatif.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Inscription et Compte</h2>
            <p className="text-gray-700">
              L'inscription nécessite des informations exactes et complètes. Les utilisateurs sont responsables 
              de la confidentialité de leurs identifiants et de toutes les activités sur leur compte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Utilisation du Service</h2>
            <p className="text-gray-700">
              Les utilisateurs s'engagent à utiliser la plateforme de manière appropriée, respectueuse et conforme 
              aux lois en vigueur. Tout contenu partagé doit respecter les droits d'auteur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Contenu Éducatif</h2>
            <p className="text-gray-700">
              Le contenu est fourni à des fins éducatives. KN se réserve le droit de modifier ou retirer 
              du contenu à tout moment. Les utilisateurs ne doivent pas reproduire ou distribuer le contenu sans autorisation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Protection des Données</h2>
            <p className="text-gray-700">
              Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité. 
              Les informations collectées sont utilisées uniquement dans le cadre de nos services éducatifs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Modifications</h2>
            <p className="text-gray-700">
              KN se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés 
              des changements importants. L'utilisation continue de la plateforme constitue l'acceptation des modifications.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;