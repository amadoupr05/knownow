import React from 'react';

interface ConsentStepProps {
  formData: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    parentalConsent: boolean;
  };
  setFormData: (data: any) => void;
}

function ConsentStep({ formData, setFormData }: ConsentStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Consentements</h2>
      
      <div className="space-y-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
            className="mt-1 mr-3"
          />
          <span className="text-sm text-gray-700">
            J'accepte les{' '}
            <button type="button" className="text-[#4F6D0B] hover:underline">
              conditions générales d'utilisation
            </button>
            {' '}de la plateforme
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.privacyAccepted}
            onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
            className="mt-1 mr-3"
          />
          <span className="text-sm text-gray-700">
            J'autorise l'utilisation des données personnelles conformément à la{' '}
            <button type="button" className="text-[#4F6D0B] hover:underline">
              politique de confidentialité
            </button>
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.parentalConsent}
            onChange={(e) => setFormData({ ...formData, parentalConsent: e.target.checked })}
            className="mt-1 mr-3"
          />
          <span className="text-sm text-gray-700">
            J'accepte que mon parent/tuteur soit contacté pour les communications importantes
          </span>
        </label>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          En vous inscrivant, vous acceptez de recevoir des communications importantes concernant
          votre compte, les mises à jour de la plateforme et les informations relatives à
          votre apprentissage. Vous pourrez gérer vos préférences de communication dans les
          paramètres de votre compte.
        </p>
      </div>
    </div>
  );
}

export default ConsentStep;