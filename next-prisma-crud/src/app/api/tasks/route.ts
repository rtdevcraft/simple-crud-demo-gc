import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import prisma from '../../../../lib/prisma'

// GET /api/tasks - Fetches all tasks for the logged-in user
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tasks = await prisma.task.findMany({
      // CORRECTED: Use 'prisma' directly
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Creates a new task for the logged-in user
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title } = await request.json()
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    const newTask = await prisma.task.create({
      data: {
        title,
        userId: session.user.id,
      },
    })
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
