export interface Exercise {
  id: string;
  number: number;
  module?: string;
  difficulty?: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  number: number;
  content: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation: string;
  hints: string[];
}

export interface ExamData {
  type: string;
  period: {
    month: string;
    year: string;
  };
  zone: string;
  series: string;
  subject: string;
}