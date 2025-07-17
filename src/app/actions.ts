'use server'

import { revalidatePath } from 'next/cache'
import pool from '../../lib/db'
import { Task } from '../../lib/types'
import { auth } from '../../auth'

/**
 * Retrieves the current user's session and ID.
 * Throws an error if the user is not authenticated.
 * @returns {Promise<string>} The user's ID.
 */
async function getUserId(): Promise<string> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    // This error will be caught by the calling function's try/catch block.
    throw new Error('You must be logged in to perform this action.')
  }
  return userId
}

/**
 * Fetches all tasks for the currently authenticated user.
 * @returns {Promise<Task[]>} A list of the user's tasks.
 */
export async function getTasks(): Promise<Task[]> {
  try {
    const userId = await getUserId() //  Secure: Get user ID
    const client = await pool.connect()
    const result = await client.query(
      //  Query is now filtered by the logged-in user
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    client.release()
    return result.rows as Task[]
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    // Return empty array if user is not logged in or if there's a DB error.
    return []
  }
}

/**
 * Adds a new task for the currently authenticated user.
 * @param {FormData} formData - The form data containing the task title.
 */
export async function addTask(formData: FormData) {
  const title = formData.get('title') as string

  if (!title) {
    return { error: 'Title is required' }
  }

  try {
    const userId = await getUserId() //  Secure: Get user ID
    const client = await pool.connect()
    //  Insert now includes the user_id
    await client.query('INSERT INTO tasks (title, user_id) VALUES ($1, $2)', [
      title,
      userId,
    ])
    client.release()

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to create task:', error)
    return { error: 'Failed to create task' }
  }
}

/**
 * Toggles the completion status of a task owned by the authenticated user.
 * @param {number} id - The ID of the task to toggle.
 * @param {boolean} completed - The current completion status of the task.
 */
export async function toggleTask(id: number, completed: boolean) {
  try {
    const userId = await getUserId() //  Secure: Get user ID
    const client = await pool.connect()
    //  The WHERE clause ensures a user can only update their own tasks
    await client.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3',
      [!completed, id, userId]
    )
    client.release()
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to toggle task:', error)
    return { error: 'Failed to toggle task' }
  }
}

/**
 * Deletes a task owned by the authenticated user.
 * @param {number} id - The ID of the task to delete.
 */
export async function deleteTask(id: number) {
  try {
    const userId = await getUserId() //  Secure: Get user ID
    const client = await pool.connect()
    //  The WHERE clause ensures a user can only delete their own tasks
    await client.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ])
    client.release()
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to delete task:', error)
    return { error: 'Failed to delete task' }
  }
}

/**
 * Updates the title of a task owned by the authenticated user.
 * @param {number} id - The ID of the task to update.
 * @param {string} newTitle - The new title for the task.
 */
export async function updateTask(id: number, newTitle: string) {
  try {
    const userId = await getUserId() //  Secure: Get user ID
    const client = await pool.connect()
    //  The WHERE clause ensures a user can only update their own tasks
    await client.query(
      'UPDATE tasks SET title = $1 WHERE id = $2 AND user_id = $3',
      [newTitle, id, userId]
    )
    client.release()
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to update task:', error)
    return { error: 'Failed to update task' }
  }
}
