/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from 'styled-components'
import { Box, IconButton, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import LogoSvg from '../../../public/AqConnectaIcon.svg'
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0px 24px;
  position: sticky;
  top: 0;
  left: 0;
  width: 97.5%;
  z-index: 10;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  height: 100%; 
  padding: 8px 32px;
  max-width: 1128px;
`

const Logo = styled.span`
  margin-right: 8px;
  font-size: 0;
`

function Header() {
  const { logout } = useAuth()
  function logoutUser() {
    logout()
  }

  return (
    <Container>
      <Content>
        <Logo>
          <a href="/home">
            <img src={LogoSvg} alt="" width="24px" height="24px" />
          </a>
        </Logo>
        {/* <Search> */}
        {/* <div> */}
        {/* <input type="text" placeholder="Search" /> */}
        {/* </div> */}
        {/* <SearchIcon> */}
        {/* <img src="/images/search-icon.svg" alt="" /> */}
        {/* </SearchIcon> */}
        {/* </Search> */}
        <Box />
        <Box />
        <Box />
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
          <Link to="/usuario">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0px' }}>
              <PermIdentityOutlinedIcon />
              <Typography sx={{ fontSize: '14px' }}>Meu Perfil</Typography>
            </Box>
          </Link>
          <Link to="/minhas-vagas">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0px' }}>
              <BusinessCenterOutlinedIcon />
              <Typography sx={{ fontSize: '14px' }}>Minhas vagas</Typography>
            </Box>
          </Link>
        </Box>
        <Box>
          <IconButton color="primary" onClick={() => logoutUser()}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Content>
    </Container>
  )
}

export default Header
