import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { auth, checkRole } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN']),
  userType: z.string(),
  educationLevel: z.string().optional(),
  currentClass: z.string().optional(),
  schoolName: z.string().optional(),
  city: z.string().optional(),
  teachingLevels: z.array(z.string()).optional(),
  teachingClasses: z.array(z.string()).optional(),
  subject: z.string().optional()
});

// Créer un utilisateur
router.post('/', auth, checkRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const data = userSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });

    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: 'Données invalides' });
  }
});

// Récupérer tous les utilisateurs
router.get('/', auth, checkRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  const { role, userType } = req.query;
  
  const where: any = {};
  if (role) where.role = role;
  if (userType) where.userType = userType;

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      role: true,
      userType: true,
      educationLevel: true,
      currentClass: true,
      schoolName: true,
      city: true,
      createdAt: true,
      teachingLevels: true,
      teachingClasses: true,
      subject: true
    }
  });
  
  res.json(users);
});

// Récupérer un utilisateur par ID
router.get('/:id', auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      role: true,
      userType: true,
      educationLevel: true,
      currentClass: true,
      schoolName: true,
      city: true,
      createdAt: true,
      teachingLevels: true,
      teachingClasses: true,
      subject: true
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }

  res.json(user);
});

// Mettre à jour un utilisateur
router.put('/:id', auth, checkRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const data = userSchema.partial().parse(req.body);
    
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        userType: true,
        educationLevel: true,
        currentClass: true,
        schoolName: true,
        city: true,
        createdAt: true,
        teachingLevels: true,
        teachingClasses: true,
        subject: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Données invalides' });
  }
});

// Supprimer un utilisateur
router.delete('/:id', auth, checkRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id }
  });
  res.status(204).send();
});

export default router;