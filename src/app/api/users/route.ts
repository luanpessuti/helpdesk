// app/api/users/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/users
export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

// POST /api/users
export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, role } = body

  const newUser = await prisma.user.create({
    data: { name, email, role },
  })

  return NextResponse.json(newUser, { status: 201 })
}
