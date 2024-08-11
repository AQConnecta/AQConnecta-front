import { Box, Typography } from '@mui/material';
import Card from '../../components/Card';

function Home() {
  return (
    <Card sx={{ borderBottom: '1px solid #00000014', padding: '0px 24px', width: '100%', backgroundColor: 'white' }}>
      <Box>
        <Typography variant="h1" sx={{ textDecoration: 'underline' }}>Home</Typography>
        <Box>
          <Box />
        </Box>
      </Box>
    </Card>
  );
}

export default Home;
