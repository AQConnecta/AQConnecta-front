import ReactDOM from 'react-dom/client'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@mui/material'
import App from './App.tsx'
import './App.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import theme from './styles/muiTheme.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      preventDuplicate
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
  </ThemeProvider>
  ,
)
