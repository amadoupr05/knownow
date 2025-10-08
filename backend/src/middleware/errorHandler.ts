import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Un enregistrement avec ces données existe déjà'
      });
    }
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Données invalides',
      details: err.errors
    });
  }

  res.status(500).json({
    error: 'Une erreur est survenue'
  });
};