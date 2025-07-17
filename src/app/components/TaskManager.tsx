'use client'

import React, { useState, useTransition, useRef } from 'react'
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material'
import {
  Edit,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material'
import { Task } from '../../../lib/types'
import { addTask, deleteTask, toggleTask, updateTask } from '../actions'

export default function TaskManager({
  initialTasks,
}: {
  initialTasks: Task[]
}) {
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [editingText, setEditingText] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleAddTask = async (formData: FormData) => {
    // Reset the form input field after submission
    formRef.current?.reset()
    await addTask(formData)
  }

  const handleToggleTask = async (id: number, completed: boolean) => {
    startTransition(() => {
      toggleTask(id, completed)
    })
  }

  const handleDeleteTask = async (id: number) => {
    startTransition(() => {
      deleteTask(id)
    })
  }

  const handleStartEdit = (task: Task) => {
    setEditingTask(task.id)
    setEditingText(task.title)
  }

  const handleSaveEdit = async (id: number) => {
    startTransition(async () => {
      await updateTask(id, editingText)
      setEditingTask(null)
      setEditingText('')
    })
  }

  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          Simple Task List
        </Typography>
        {/* The form now directly calls the Server Action */}
        <form ref={formRef} action={handleAddTask}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              variant='outlined'
              label='New Task'
              name='title' // The name attribute is used by formData
              required
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add Task
            </Button>
          </Box>
        </form>

        {isPending && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <List>
          {initialTasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                my: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <IconButton
                onClick={() => handleToggleTask(task.id, task.completed)}
                disabled={isPending}
              >
                {task.completed ? (
                  <CheckCircle color='success' />
                ) : (
                  <RadioButtonUnchecked />
                )}
              </IconButton>
              {editingTask === task.id ? (
                <TextField
                  fullWidth
                  variant='standard'
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => handleSaveEdit(task.id)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleSaveEdit(task.id)
                  }
                  autoFocus
                />
              ) : (
                <ListItemText
                  primary={task.title}
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                />
              )}
              <Box sx={{ ml: 'auto' }}>
                <IconButton
                  onClick={() => handleStartEdit(task)}
                  disabled={isPending}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={isPending}
                >
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
}
