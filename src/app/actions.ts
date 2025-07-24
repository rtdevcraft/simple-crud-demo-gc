'use server'

import { auth } from '../../lib/auth'
import prisma from '../../lib/db'
import { revalidatePath } from 'next/cache'

// Helper: throw if not authenticated
async function requireUserId() {
  const session = await auth()
  if (!session?.session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return session.session.user.id
}

//  Fetch tasks for current user
export async function getTasks() {
  const userId = await requireUserId()

  return await prisma.task.findMany({
    where: { userId },
    orderBy: { created_at: 'desc' },
  })
}

//  Create a new task
export async function createTask(title: string) {
  const userId = await requireUserId()

  await prisma.task.create({
    data: {
      title,
      userId,
    },
  })

  revalidatePath('/')
}

//  Toggle task completion
export async function toggleTask(id: number, completed: boolean) {
  const userId = await requireUserId()

  await prisma.task.update({
    where: { id },
    data: { completed },
  })

  revalidatePath('/')
}

//  Delete a task
export async function deleteTask(id: number) {
  const userId = await requireUserId()

  await prisma.task.delete({
    where: { id },
  })

  revalidatePath('/')
}
