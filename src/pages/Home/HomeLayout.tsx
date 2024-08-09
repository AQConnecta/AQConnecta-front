import { Box } from '@mui/material'
// import Sidebar from '../../components/Sidebar'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Left from './components/Sidebar'

const Layout = styled.div`
  display: grid;
  grid-template-areas: 'left main right';
  grid-template-columns: minmax(0, 5fr) minmax(0, 12fr) minmax(300px, 7fr);
  column-gap: 25px;
  row-gap: 25px;
  padding: 0px 32px;
  margin: 25px 0;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
  }
`

function HomeLayout() {
  return (
    <>
      <Header />
      <Layout>
        <>
          <Box />
          <Box />
        </>
        <Outlet />
        <Left />
      </Layout>
    </>
  )
}

export default HomeLayout
