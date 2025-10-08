import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Créer le super admin
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      role: 'SUPER_ADMIN',
      userType: 'admin'
    }
  });

  console.log('Base de données initialisée avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });