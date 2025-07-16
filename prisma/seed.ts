import { PrismaClient, Role } from '../generated/prisma'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

/**
 * Creates a Company
 * @param name - Company name
 */
const createCompany = async (name: string) => {
  const existingCompany = await prisma.company.findFirst({
    where: { name }
  })
  
  if (existingCompany) {
    return existingCompany
  }
  
  return await prisma.company.create({
    data: {
      name,
    },
  })
}

/**
 * Creates a Branch
 * @param name - Branch name
 * @param companyId - Company ID
 */
const createBranch = async (name: string, companyId: string) => {
  const existingBranch = await prisma.branch.findFirst({
    where: { name }
  })
  
  if (existingBranch) {
    return existingBranch
  }
  
  return await prisma.branch.create({
    data: {
      name,
      companyId,
    },
  })
}

/**
 * Creates a SUPER ADMIN user
 * @param email - User email
 * @param firstName - User first name
 * @param lastName - User last name
 * @param password - User password (will be hashed)
 * @param companyId - Company ID
 * @param branchId - Branch ID
 */
const createSuperAdmin = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  companyId: string,
  branchId: string
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
      companyId,
      branchId,
    },
  })
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create Company
  const company = await createCompany('BetaFore')
  console.log(`✅ Created Company: ${company.name}`)

  // Create Branch
  const branch = await createBranch('Main Branch', company.id)
  console.log(`✅ Created Branch: ${branch.name}`)

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
      admin.password,
      company.id,
      branch.id
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