import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-gray-500 text-sm">{label}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

export default StatCard;