import React from 'react';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from './RegisterForm';

function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>

        <div className="bg-white rounded-lg shadow-sm">
          <RegisterForm onCancel={() => window.history.back()} />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;