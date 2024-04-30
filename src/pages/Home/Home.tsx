import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { Usuario } from '../../services/endpoints/auth';
import Sidebar from '../../components/Sidebar';

function Home() {
  const user: Usuario = JSON.parse(localStorage.getItem('user') || '');

  if (!user) {
    return <Link to="/login">Login</Link>;
  }

  return (
    <Box>
      <Sidebar />
    </Box>
  );
}

export default Home;
