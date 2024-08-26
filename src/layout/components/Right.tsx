import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext' // Importe o useAuth

const Container = styled.div`
  min-width: 200px;
`

const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  border-radius: 5px;
  background-color: #fff;
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 15%),
    0 0 0 rgb(0 0 0 / 20%);
`

const UserInfo = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;
`

const CardBackground = styled.div`
  background: url('/images/card-bg.svg');
  background-position: center;
  background-size: 462px;
  height: 54px;
  margin: -12px -12px 0;
`

const Photo = styled.img`
  box-shadow: none;
  width: 72px;
  height: 72px;
  object-fit: cover;
  border: 2px solid white;
  margin: -38px auto 12px;
  border-radius: 50%;
  cursor: pointer;
`

const Text = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
`

function Right() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const photoUrl = user?.fotoPerfil || 'https://via.placeholder.com/72x72.png?text=No+Image'

  console.log(user)

  return (
    <Container>
      { user && (
        <ArtCard>
          <UserInfo>
            <CardBackground />
            <Photo
              src={photoUrl}
              onClick={() => navigate('/usuario')}
            />
            <Text>
              Olá,
              {' '}
              {user.nome || ''}
            </Text>
          </UserInfo>
        </ArtCard>
      )}
    </Container>
  )
}

export default Right
