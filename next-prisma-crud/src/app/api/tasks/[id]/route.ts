import { NextResponse as AnotherNextResponse } from 'next/server'
import { getServerSession as getServerSessionForId } from 'next-auth'
import { authOptions as idAuthOptions } from '../../../../lib/auth'
import prismaForId from '../../../../lib/prisma'

// PUT /api/tasks/[id] - Updates a task owned by the user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSessionForId(idAuthOptions)

  if (!session?.user?.id) {
    return AnotherNextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, completed } = await request.json()
    const taskId = Number(params.id)

    // Verify the task belongs to the user before updating
    const task = await prismaForId.task.findFirst({
      // CORRECTED: Use prisma import
      where: { id: taskId, userId: session.user.id },
    })

    if (!task) {
      return AnotherNextResponse.json(
        { error: 'Task not found or you do not have permission' },
        { status: 404 }
      )
    }

    const updatedTask = await prismaForId.task.update({
      // CORRECTED: Use prisma import
      where: { id: taskId },
      data: { title, completed },
    })
    return AnotherNextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to update task:', error)
    return AnotherNextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Deletes a task owned by the user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSessionForId(idAuthOptions)

  if (!session?.user?.id) {
    return AnotherNextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const taskId = Number(params.id)

    // Verify the task belongs to the user before deleting
    const task = await prismaForId.task.findFirst({
      // CORRECTED: Use prisma import
      where: { id: taskId, userId: session.user.id },
    })

    if (!task) {
      return AnotherNextResponse.json(
        { error: 'Task not found or you do not have permission' },
        { status: 404 }
      )
    }

    await prismaForId.task.delete({
      // CORRECTED: Use prisma import
      where: { id: taskId },
    })
    return new AnotherNextResponse(null, { status: 204 }) // No Content
  } catch (error) {
    console.error('Failed to delete task:', error)
    return AnotherNextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
