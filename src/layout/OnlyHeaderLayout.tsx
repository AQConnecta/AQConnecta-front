import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';

function OnlyHeaderLayout() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '32px' }}>
      <Header />
      <Outlet />
    </Box>
  );
}

export default OnlyHeaderLayout;
