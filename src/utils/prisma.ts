// import { PrismaClient } from "@/generated/dbClient"

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// export const prisma: PrismaClient =
//   globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// import { PrismaClient } from "@/generated/dbClient"
// import { withAccelerate } from '@prisma/extension-accelerate'

// export const prisma = new PrismaClient().$extends(withAccelerate())  

// const globalForPrisma = global as unknown as { prisma: typeof prisma }

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import { PrismaClient } from "@/generated/prisma-client"
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient().$extends(withAccelerate())