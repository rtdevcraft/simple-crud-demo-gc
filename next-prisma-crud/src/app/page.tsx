'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  AppBar,
  Avatar,
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Box,
  Paper,
  CircularProgress,
  Toolbar,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

interface Task {
  id: number
  title: string
  completed: boolean
}

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        if (response.status === 401) {
          setError('You are not authorized. Please log in again.')
          return
        }
        throw new Error(`Failed to fetch tasks: ${response.statusText}`)
      }
      const data: Task[] = await response.json()
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle }),
      })
      if (!response.ok) throw new Error('Failed to add task')
      setNewTaskTitle('')
      await fetchTasks()
    } catch (err) {
      console.error('Failed to add task:', err) // FIXED
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  const handleToggleTask = async (id: number, completed: boolean) => {
    try {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      )
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      })
    } catch (err) {
      console.error('Failed to update task:', err) // FIXED
      setError('Failed to update task. Reverting.')
      await fetchTasks()
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      setTasks(tasks.filter((task) => task.id !== id))
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete task:', err) // FIXED
      setError('Failed to delete task. Reverting.')
      await fetchTasks()
    }
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, mt: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom align='center'>
        My Tasks
      </Typography>
      <Box
        component='form'
        onSubmit={handleAddTask}
        sx={{ display: 'flex', gap: 2, mb: 4 }}
      >
        <TextField
          fullWidth
          variant='outlined'
          label='New Task'
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          size='small'
        />
        <Button type='submit' variant='contained' color='primary'>
          Add
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color='error' align='center'>
          {error}
        </Typography>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <IconButton
                  edge='end'
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
              sx={{
                mb: 1,
                bgcolor: 'background.default',
                borderRadius: 1,
                p: 1,
              }}
            >
              <Checkbox
                edge='start'
                checked={task.completed}
                onClick={() => handleToggleTask(task.id, task.completed)}
              />
              <ListItemText
                primary={task.title}
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary',
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  )
}

export default function HomePage() {
  const { data: session, status } = useSession()

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          {session?.user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={session.user.image ?? undefined}
                alt={session.user.name ?? 'User'}
              />
              <Button
                color='inherit'
                startIcon={<LogoutIcon />}
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth='md'>
        {status === 'loading' && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80vh',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {status === 'unauthenticated' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80vh',
              gap: 2,
            }}
          >
            <Typography variant='h5'>Please sign in to continue</Typography>
            <Button
              variant='contained'
              startIcon={<LoginIcon />}
              onClick={() => signIn('google')}
            >
              Sign in with Google
            </Button>
          </Box>
        )}
        {status === 'authenticated' && <TaskManager />}
      </Container>
    </>
  )
}
