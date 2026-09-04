import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { useAuth } from '../../contexts/AuthContext'

function Right() {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (!user) return null;
  const photoUrl = user.fotoPerfil || undefined

  return (
    <div className="min-w-[200px]">
      <Card className="overflow-hidden">
        <div 
          className="h-14 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/card-bg.svg')" }}
        />
        <CardContent className="pt-0 -mt-9 text-center">
          <Avatar 
            className="w-[72px] h-[72px] mx-auto border-2 border-white cursor-pointer shadow-md"
            onClick={() => navigate('/usuario')}
          >
            <AvatarImage src={photoUrl} alt={user.nome} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {user.nome?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <p className="mt-3 text-base font-semibold text-foreground">
            Olá, {user.nome || ''}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Right
