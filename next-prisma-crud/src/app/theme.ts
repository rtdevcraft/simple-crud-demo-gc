'use client'
import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    error: { main: red.A400 },
    background: { default: '#121212', paper: '#1e1e1e' },
  },
})

export default theme
