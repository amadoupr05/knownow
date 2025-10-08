import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

function ContactUsView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentUser = sessionStorage.getItem('currentUser');
      const userId = currentUser ? JSON.parse(currentUser).id : null;

      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          ...formData,
          user_id: userId,
          status: 'nouveau'
        }]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#4F6D0B] to-[#7DA81E] p-12 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Nous Contacter</h1>
          <p className="text-xl text-white/90">
            Une question? Un problème? Notre équipe est là pour vous aider!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">n.mady@bayaala.com</p>
          </div>

          <div className="bg-white p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Téléphone</h3>
            <p className="text-gray-600">+225 07 05 91 66 51</p>
          </div>

          <div className="bg-white p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
            <p className="text-gray-600">Abidjan, Côte d'Ivoire</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Message envoyé avec succès! Nous vous répondrons bientôt.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="Problème technique">Problème technique</option>
                  <option value="Question sur un cours">Question sur un cours</option>
                  <option value="Suggestion">Suggestion d'amélioration</option>
                  <option value="Devenir enseignant">Devenir enseignant</option>
                  <option value="Facturation">Facturation</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#4F6D0B] text-white font-semibold hover:bg-[#4F6D0B]/90 transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Envoi...' : 'Envoyer le message'}</span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Questions fréquentes
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Comment créer un compte?</h4>
                  <p className="text-gray-600 text-sm">
                    Cliquez sur "S'inscrire" en haut à droite et suivez les étapes d'inscription.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Les cours sont-ils gratuits?</h4>
                  <p className="text-gray-600 text-sm">
                    Nous proposons des contenus gratuits et des programmes premium payants.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Comment devenir enseignant?</h4>
                  <p className="text-gray-600 text-sm">
                    Créez un compte enseignant et complétez votre profil pour commencer à publier du contenu.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Horaires de support</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Lundi - Vendredi:</strong> 8h00 - 18h00
              </p>
              <p className="text-sm text-gray-600">
                <strong>Week-end:</strong> 9h00 - 15h00
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Temps de réponse moyen: 24-48 heures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsView;
