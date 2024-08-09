import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import { colors } from '../../styles/colors';

const Container = styled.div`
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0px 24px;
    position: sticky;
    top: 0;
    left: 0;
    width: 70vw;
    z-index: 10;
`

function Home() {
  return (
    <Container>
      <Box sx={{ borderBottom: '8px', backgroundColor: colors.primary, color: colors.background }}>
        <Typography variant="h1" sx={{ textDecoration: 'underline' }}>Home</Typography>
      </Box>
    </Container>
  );
}

export default Home;
