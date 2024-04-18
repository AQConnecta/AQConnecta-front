import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          preventDuplicate={true}>
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);
