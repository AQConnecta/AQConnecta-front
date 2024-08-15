import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './components/Header'
import Right from './components/Right'
import Left from './components/Left'

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  column-gap: 16px;
  padding: 0px 32px;
  width: 100%;
  max-width: 96.68%;
  margin: 25px 0px;
`

function HomeLayout() {
  return (
    <Box sx={{ backgroundColor: '#f4f2ee', height: '100vh' }}>
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
