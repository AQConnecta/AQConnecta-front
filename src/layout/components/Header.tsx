/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from 'styled-components'
import { Box, IconButton, Typography, TextField, MenuItem } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { Link, useNavigate } from 'react-router-dom'
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined'
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import LogoSvg from '../../../public/AqConnectaIcon.svg'
import { useAuth } from '../../contexts/AuthContext'

const Container = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  /* padding: 0px 24px; */
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
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

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`

const SearchResults = styled(Box)`
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  width: 100%;
  z-index: 100;
`

function Header() {
  const { logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  function logoutUser() {
    logout()
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value)
    setShowResults(event.target.value.length > 0)
  }

  function handleOptionClick(path) {
    navigate(path)
    setShowResults(false)
    setSearchQuery('')
  }

  return (
    <Container>
      <Content>
        <Logo>
          <a href={isAdmin ? '/admin' : '/home'}>
            <img src={LogoSvg} alt="" width="24px" height="24px" />
          </a>
        </Logo>

        {isAdmin ? (
          <Typography variant="h6" color="primary">Painel Administrativo</Typography>
        ) : (
          <>
            <SearchContainer>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
              {showResults && (
                <SearchResults>
                  <MenuItem sx={{ 'text-decoration': 'underline' }} onClick={() => handleOptionClick(`/buscar?tipo=vagas&filtro=${searchQuery}`)}>
                    Filtrar por Título de Vaga
                  </MenuItem>
                  <MenuItem sx={{ 'text-decoration': 'underline' }} onClick={() => handleOptionClick(`/buscar?tipo=usuarios&filtro=${searchQuery}`)}>
                    Filtrar por Usuário
                  </MenuItem>
                </SearchResults>
              )}
            </SearchContainer>

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
              <Link to="/minhas-candidaturas">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0px' }}>
                  <BusinessCenterOutlinedIcon />
                  <Typography sx={{ fontSize: '14px' }}>Minhas Candidaturas</Typography>
                </Box>
              </Link>
            </Box>
          </>
        )}
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
