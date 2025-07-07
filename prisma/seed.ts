import { PrismaClient, Role } from '../generated/prisma'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

/**
 * Creates a SUPER ADMIN user
 * @param email - User email
 * @param firstName - User first name
 * @param lastName - User last name
 * @param password - User password (will be hashed)
 */
const createSuperAdmin = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  return await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  })
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create SUPER ADMIN users
  const superAdmins = [
    {
      email: 'rifath.shaun@gmail.com',
      firstName: 'Super',
      lastName: 'Admin',
      password: 'Admin@123'
    },
  ]

  for (const admin of superAdmins) {
    const user = await createSuperAdmin(
      admin.email,
      admin.firstName,
      admin.lastName,
      admin.password
    )
    console.log(`✅ Created SUPER ADMIN: ${user.email}`)
  }

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 