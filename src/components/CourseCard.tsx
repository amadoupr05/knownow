import React from 'react';
import { BookOpen } from 'lucide-react';

interface CourseCardProps {
  title: string;
}

function CourseCard({ title }: CourseCardProps) {
  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <BookOpen className="h-5 w-5 text-[#4F6D0B]" />
      <span className="ml-3 text-gray-700">{title}</span>
    </div>
  );
}

export default CourseCard;