import React from 'react';
import { GraduationCap } from 'lucide-react';

interface ExamCardProps {
  subject: string;
  date: string;
}

function ExamCard({ subject, date }: ExamCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <GraduationCap className="h-5 w-5 text-[#C19620]" />
        <span className="ml-3 text-gray-700">{subject}</span>
      </div>
      <span className="text-sm text-gray-500">{date}</span>
    </div>
  );
}

export default ExamCard;