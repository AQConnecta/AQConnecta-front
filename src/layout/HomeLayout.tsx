// src/layout/HomeLayout.tsx
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Header from './components/Header'
import Right from './components/Right'
import Left from './components/Left'
import MobileHomeLayout from './MobileLayout'

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  column-gap: 16px;
  padding: 0px 32px;
  width: 100%;
  max-width: 95.68%;
  margin: 25px 0px;
`

function HomeLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    // layout mobile novo
    return <MobileHomeLayout />;
  }

  // layout desktop original
  return (
    <Box sx={{ backgroundColor: '#f4f2ee', minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Left />
        <Outlet />
        <Right />
      </Layout>
    </Box>
  )
}

export default HomeLayout
