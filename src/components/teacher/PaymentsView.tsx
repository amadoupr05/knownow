import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Payment {
  id: string;
  month: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid';
  paid_at: string | null;
  created_at: string;
}

function PaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarned, setTotalEarned] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPayments(data || []);

      const total = data?.filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      setTotalEarned(total);

      const pending = data?.filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      setPendingAmount(pending);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'processing':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rémunération</h1>
        <p className="text-gray-600">
          Suivez vos revenus et l'historique de vos paiements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalEarned.toLocaleString()} FCFA
          </div>
          <div className="text-sm text-gray-600">Total perçu</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {pendingAmount.toLocaleString()} FCFA
          </div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {new Date().toLocaleDateString('fr-FR', { month: 'long' })}
          </div>
          <div className="text-sm text-gray-600">Mois en cours</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4F6D0B] to-[#7DA81E] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Rémunération du mois prochain</h3>
            <p className="text-white/90 mb-4">
              Estimation basée sur votre activité actuelle
            </p>
            <div className="text-3xl font-bold">
              {pendingAmount.toLocaleString()} FCFA
            </div>
          </div>
          <DollarSign className="w-20 h-20 text-white/30" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Historique des paiements
        </h2>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Chargement...
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun paiement pour le moment
            </h3>
            <p className="text-gray-500">
              Vos paiements apparaîtront ici une fois que vous aurez commencé à générer des revenus
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mois
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de paiement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Number(payment.amount).toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString('fr-FR')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Comment fonctionne la rémunération?
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Les paiements sont effectués mensuellement</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Vos revenus proviennent des programmes payants et de l'engagement sur vos contenus</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Les paiements sont traités dans les 5 jours ouvrables suivant la fin du mois</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Un montant minimum de 10 000 FCFA est requis pour effectuer un retrait</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentsView;
