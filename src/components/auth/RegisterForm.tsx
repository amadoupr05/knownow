import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import ProgressBar from './ProgressBar';
import {
  PersonalInfoStep,
  UserTypeStep,
  SchoolInfoStep,
  SubjectsStep,
  AccountStep,
  ConsentStep
} from './registration-steps';

interface RegisterFormProps {
  onCancel: () => void;
}

interface School {
  name: string;
  city: string;
  type: string;
  level: string[];
  classes: string[];
}

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  // User Type
  userType: string;
  // School Info (Student)
  educationLevel: string;
  currentClass: string;
  city: string;
  schoolName: string;
  schoolType: string;
  // School Info (Teacher)
  teachingLevels: string[];
  teachingClasses: string[];
  subject: string;
  isTemporaryTeacher: boolean;
  schoolCount: number;
  schools: School[];
  // Subjects (Student only)
  favoriteSubjects: string[];
  difficultSubjects: string[];
  // Account
  username: string;
  password: string;
  passwordConfirm: string;
  // Consent
  termsAccepted: boolean;
  privacyAccepted: boolean;
  parentalConsent: boolean;
}

function RegisterForm({ onCancel }: RegisterFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    userType: '',
    educationLevel: '',
    currentClass: '',
    city: '',
    schoolName: '',
    schoolType: '',
    teachingLevels: [],
    teachingClasses: [],
    subject: '',
    isTemporaryTeacher: false,
    schoolCount: 0,
    schools: [],
    favoriteSubjects: [],
    difficultSubjects: [],
    username: '',
    password: '',
    passwordConfirm: '',
    termsAccepted: false,
    privacyAccepted: false,
    parentalConsent: false,
  });

  const totalSteps = formData.userType === 'enseignant' ? 5 : 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = {
        username: formData.username,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_type: formData.userType,
        school_name: formData.schoolName || null,
        teaching_subject: formData.subject || null,
        is_temporary_teacher: formData.isTemporaryTeacher || false,
        teaching_levels: JSON.stringify(formData.teachingLevels),
        teaching_classes: JSON.stringify(formData.teachingClasses),
        current_class: formData.currentClass || null
      };

      const { data, error } = await supabase
        .from('local_users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        alert('Erreur lors de l\'inscription: ' + error.message);
        return;
      }

      sessionStorage.setItem('currentUser', JSON.stringify({
        id: data.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
        username: formData.username
      }));

      alert('Inscription réussie!');
      window.location.href = '/';
    } catch (err: any) {
      console.error('Error:', err);
      alert('Erreur lors de l\'inscription: ' + err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <UserTypeStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <SchoolInfoStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        if (formData.userType === 'élève') {
          return (
            <SubjectsStep
              formData={formData}
              setFormData={setFormData}
            />
          );
        }
        return (
          <AccountStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 5:
        if (formData.userType === 'élève') {
          return (
            <AccountStep
              formData={formData}
              setFormData={setFormData}
            />
          );
        }
        return (
          <ConsentStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 6:
        return (
          <ConsentStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = step === totalSteps;

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.birthDate && formData.gender;
      case 2:
        return formData.userType;
      case 3:
        if (formData.userType === 'enseignant') {
          return (
            formData.teachingLevels.length > 0 &&
            formData.teachingClasses.length > 0 &&
            formData.subject &&
            formData.schoolCount > 0 &&
            formData.schools.every(school => school.name && school.city && school.type)
          );
        }
        return formData.educationLevel && formData.currentClass && formData.city && formData.schoolName;
      case 4:
        if (formData.userType === 'élève') {
          return formData.favoriteSubjects.length > 0;
        }
        return formData.username && formData.password && formData.password === formData.passwordConfirm;
      case 5:
        if (formData.userType === 'élève') {
          return formData.username && formData.password && formData.password === formData.passwordConfirm;
        }
        return formData.termsAccepted && formData.privacyAccepted;
      case 6:
        return formData.termsAccepted && formData.privacyAccepted;
      default:
        return false;
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b z-10 p-6">
        <ProgressBar currentStep={step} totalSteps={totalSteps} />
      </div>

      <form onSubmit={isLastStep ? handleSubmit : (e) => e.preventDefault()} className="p-6">
        <div className="mt-6">
          {renderStep()}
        </div>
        
        <div className="mt-8 flex justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Précédent
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-4 py-2 text-white rounded-lg ${
                  canProceed()
                    ? 'bg-[#4F6D0B] hover:bg-[#4F6D0B]/90'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canProceed()}
                className={`px-4 py-2 text-white rounded-lg ${
                  canProceed()
                    ? 'bg-[#4F6D0B] hover:bg-[#4F6D0B]/90'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                S'inscrire
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;