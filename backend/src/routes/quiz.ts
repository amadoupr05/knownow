import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const attemptSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  timeTaken: z.number()
});

// Soumettre une réponse
router.post('/attempt', auth, async (req, res) => {
  try {
    const { questionId, answer, timeTaken } = attemptSchema.parse(req.body);

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question non trouvée' });
    }

    const isCorrect = answer === question.correctAnswer;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user!.id,
        questionId,
        answer,
        isCorrect,
        timeTaken
      }
    });

    res.status(201).json({
      ...attempt,
      isCorrect,
      explanation: question.explanation
    });
  } catch (error) {
    res.status(400).json({ error: 'Données invalides' });
  }
});

// Obtenir les statistiques d'un utilisateur
router.get('/stats', auth, async (req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: req.user!.id },
    include: {
      question: {
        select: {
          subject: true,
          level: true,
          module: true,
          difficulty: true
        }
      }
    }
  });

  const stats = {
    totalAttempts: attempts.length,
    correctAnswers: attempts.filter(a => a.isCorrect).length,
    averageTime: attempts.reduce((acc, curr) => acc + curr.timeTaken, 0) / attempts.length,
    bySubject: {} as any,
    byDifficulty: {} as any
  };

  attempts.forEach(attempt => {
    // Stats par matière
    const subject = attempt.question.subject;
    if (!stats.bySubject[subject]) {
      stats.bySubject[subject] = {
        total: 0,
        correct: 0
      };
    }
    stats.bySubject[subject].total++;
    if (attempt.isCorrect) {
      stats.bySubject[subject].correct++;
    }

    // Stats par difficulté
    const difficulty = attempt.question.difficulty;
    if (!stats.byDifficulty[difficulty]) {
      stats.byDifficulty[difficulty] = {
        total: 0,
        correct: 0
      };
    }
    stats.byDifficulty[difficulty].total++;
    if (attempt.isCorrect) {
      stats.byDifficulty[difficulty].correct++;
    }
  });

  res.json(stats);
});

export default router;