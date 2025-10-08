import React from 'react';

interface UserTypeStepProps {
  formData: {
    userType: string;
  };
  setFormData: (data: any) => void;
}

function UserTypeStep({ formData, setFormData }: UserTypeStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Type d'utilisateur</h2>
      
      <div className="space-y-4">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="userType"
            value="élève"
            checked={formData.userType === 'élève'}
            onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
            className="mr-3"
          />
          <div>
            <div className="font-medium">Élève</div>
            <div className="text-sm text-gray-500">Je suis un(e) élève à la recherche de ressources éducatives</div>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="userType"
            value="enseignant"
            checked={formData.userType === 'enseignant'}
            onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
            className="mr-3"
          />
          <div>
            <div className="font-medium">Enseignant</div>
            <div className="text-sm text-gray-500">Je suis un(e) enseignant(e) souhaitant partager mes connaissances</div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default UserTypeStep;