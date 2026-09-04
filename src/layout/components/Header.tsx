import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Menu,
  LogOut,
  User,
  Briefcase,
  FileText,
  FolderKanban,
  ShieldCheck
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet'
import { useAuth } from '../../contexts/AuthContext'
import LogoSvg from '/AqConnectaIcon.svg?url'

function Header() {
  const { logout, isAdmin, user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function logoutUser() {
    logout()
    setDrawerOpen(false)
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value)
    setShowResults(event.target.value.length > 0)
  }

  function handleOptionClick(path: string) {
    navigate(path)
    setShowResults(false)
    setSearchQuery('')
    setDrawerOpen(false)
  }

  const menuItems = user
    ? [
        { text: 'Projetos', icon: FolderKanban, path: '/projetos' },
        { text: 'Meu Perfil', icon: User, path: '/usuario' },
        { text: 'Minhas Vagas', icon: Briefcase, path: '/minhas-vagas' },
        { text: 'Minhas Candidaturas', icon: FileText, path: '/minhas-candidaturas' },
        ...(isAdmin ? [{ text: 'Administração', icon: ShieldCheck, path: '/admin' }] : []),
      ]
    : [{ text: 'Projetos', icon: FolderKanban, path: '/projetos' }]

  const SearchResults = () => (
    showResults ? (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50">
        <button
          onClick={() => handleOptionClick(`/buscar?tipo=vagas&filtro=${searchQuery}`)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
        >
          Filtrar por Título de Vaga
        </button>
        <button
          onClick={() => handleOptionClick(`/buscar?tipo=usuarios&filtro=${searchQuery}`)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
        >
          Filtrar por Usuário
        </button>
      </div>
    ) : null
  )

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 md:gap-8 flex-1 md:flex-initial">
              <Link to="/home" className="flex items-center gap-2">
                <img src={LogoSvg} alt="AQConnecta" className="w-8 h-8" />
                <span className="text-primary font-semibold text-lg hidden sm:block">
                  AQConnecta
                </span>
              </Link>

              {/* Barra de pesquisa - Desktop */}
              <div className="hidden md:flex items-center relative w-80">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                <SearchResults />
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.text}</span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              {user ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logoutUser()}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" onClick={() => navigate('/login')}>Entrar</Button>
                  <Button onClick={() => navigate('/register')}>Cadastrar</Button>
                </div>
              )}
            </div>
          </div>

          {/* Barra de pesquisa - Mobile */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <SearchResults />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle className="text-primary">Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleOptionClick(item.path)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.text}</span>
              </button>
            ))}
          </nav>

          {!user && (
            <div className="mt-6 flex flex-col gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => handleOptionClick('/login')}>Entrar</Button>
              <Button onClick={() => handleOptionClick('/register')}>Cadastrar</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Header
