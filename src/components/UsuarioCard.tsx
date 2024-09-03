import { Avatar, Box, Button, Card, IconButton, Menu, Typography } from '@mui/material';
import React, { useState } from 'react';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { UsuarioFilter } from '../services/endpoints/usuario';

type UsuarioProps = {
    usuario: UsuarioFilter;
}

function UsuarioCard(props: UsuarioProps) {
  const { usuario } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const isMyProfile = usuario.id === user?.id;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ borderBottom: '1px solid #00000014', padding: '16px', width: '500px', backgroundColor: 'white' }} key={usuario.id}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
            <Avatar src={usuario.fotoPerfil} alt="Imagem de perfil" sx={{ height: '40px', width: '40px', borderRadius: '50%' }} />
            <Box>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{usuario.nome}</Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{usuario.email}</Typography>
            </Box>
          </Box>
          {isMyProfile && (
            <>
              <IconButton onClick={handleClick}>
                <MoreVertOutlinedIcon sx={{ height: '24px', width: '24px' }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
              </Menu>
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {!isMyProfile && (
            <Link to={`/usuario/${usuario.userUrl}`}>
                <Button variant="contained" color="primary" sx={{ height: '30px' }}>
                  Ver Perfil
                </Button>
            </Link>
          )}
        </Box>
      </Box>
    </Card>
  );
}

export default UsuarioCard;
