import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, checkRole } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const questionSchema = z.object({
  subject: z.string(),
  level: z.string(),
  module: z.string(),
  difficulty: z.enum(['BEGINNER', 'PROGRESSIVE', 'MEDIUM', 'DIFFICULT', 'ADVANCED', 'LEGEND', 'RANDOM']),
  content: z.string(),
  question: z.string(),
  answers: z.array(z.string()),
  correctAnswer: z.string(),
  explanation: z.string(),
  hints: z.array(z.string()),
  figures: z.array(z.string())
});

// Créer une question
router.post('/', auth, checkRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const data = questionSchema.parse(req.body);
    const question = await prisma.question.create({
      data: {
        ...data,
        adminId: req.user!.id
      }
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: 'Données invalides' });
  }
});

// Récupérer toutes les questions
router.get('/', auth, async (req, res) => {
  const { subject, level, module, difficulty } = req.query;
  
  const where: any = {};
  if (subject) where.subject = subject;
  if (level) where.level = level;
  if (module) where.module = module;
  if (difficulty) where.difficulty = difficulty;

  const questions = await prisma.question.findMany({
    where,
    include: {
      admin: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });
  
  res.json(questions);
});

// Récupérer une question par ID
router.get('/:id', auth, async (req, res) => {
  const question = await prisma.question.findUnique({
    where: { id: req.params.id },
    include: {
      admin: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });

  if (!question) {
    return res.status(404).json({ error: 'Question non trouvée' });
  }

  res.json(question);
});

// Mettre à jour une question
router.put('/:id', auth, checkRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const data = questionSchema.parse(req.body);
    const question = await prisma.question.update({
      where: { id: req.params.id },
      data
    });
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: 'Données invalides' });
  }
});

// Supprimer une question
router.delete('/:id', auth, checkRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  await prisma.question.delete({
    where: { id: req.params.id }
  });
  res.status(204).send();
});

export default router;