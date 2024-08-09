import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { removeBearerToken } from '../services/endpoints/_axios';
import { useAuth } from '../contexts/AuthContext.tsx';

const routes = [
  {
    path: '/competencias',
    label: 'Competências',
  },
  {
    path: '/endereco',
    label: 'Endereço',
  },
  {
    path: '/experiencias',
    label: 'Experiencias',
  },
]

function Sidebar():React.JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate('/login');
  }

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    removeBearerToken();
    navigate('/login');
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: 200,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 200,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box>
            <Box>
              Olá,
              {user.nome}
            </Box>
          </Box>
          <Box>
            <Box>Navegação</Box>
            <List>
              {routes.map((route) => (
                <ListItem>
                  <ListItemButton
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Link to={`${route.path}`}>{route.label}</Link>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box>
            <Link to="/login" onClick={() => handleLogout()}>Logout</Link>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
