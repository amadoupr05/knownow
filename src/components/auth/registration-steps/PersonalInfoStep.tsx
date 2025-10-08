import React from 'react';

interface PersonalInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
  };
  setFormData: (data: any) => void;
}

function PersonalInfoStep({ formData, setFormData }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
          Date de naissance
        </label>
        <input
          type="date"
          id="birthDate"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Genre
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="mr-2"
            />
            Masculin
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="mr-2"
            />
            Féminin
          </label>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoStep;