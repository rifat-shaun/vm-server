import { PrismaClient, Role } from '../generated/prisma'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Rif@t123', 10)
  
  await prisma.user.upsert({
    where: { email: 'rifat448@gmail.com' },
    update: {},
    create: {
      email: 'rifat448@gmail.com',
      firstName: 'Rifat',
      lastName: 'Hasan',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 