import * as React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Briefcase, Star, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import HotCompetencias from '../pages/Home/components/HotCompetencias';
import UsuarioProfileMobile from '../pages/Usuario/UsuarioPerfilMobile';
import LogoSvg from '../../public/AqConnectaIcon.svg';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

type TabId = 'vagas' | 'competencias' | 'perfil';

export default function MobileLayout() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<TabId>(() => {
    const saved = localStorage.getItem('mobileActiveTab') as TabId | null;
    return saved || 'vagas';
  });

  React.useEffect(() => {
    localStorage.setItem('mobileActiveTab', activeTab);
  }, [activeTab]);

  // Check if mobile using CSS media query logic
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only render on mobile
  if (!isMobile) return null;

  return (
    <div className="bg-muted/30 min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/home" className="flex items-center gap-2">
            <img src={LogoSvg} alt="AqConnecta" className="w-6 h-6" />
            <span className="font-bold text-primary">AqConnecta</span>
          </Link>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin')}
                aria-label="Administração"
              >
                <ShieldCheck className="h-5 w-5 text-primary" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)} className="h-full">
        <div className="min-h-[calc(100vh-56px-64px)]">
          <TabsContent value="vagas" className="p-4 mt-0">
            <Outlet />
          </TabsContent>

          <TabsContent value="competencias" className="p-4 mt-0">
            <HotCompetencias />
          </TabsContent>

          <TabsContent value="perfil" className="mt-0">
            <UsuarioProfileMobile />
          </TabsContent>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <TabsList className="w-full h-16 rounded-none grid grid-cols-3 bg-background">
            <TabsTrigger
              value="vagas"
              className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-muted"
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-xs">Vagas</span>
            </TabsTrigger>
            <TabsTrigger
              value="competencias"
              className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-muted"
            >
              <Star className="h-5 w-5" />
              <span className="text-xs">Competências</span>
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-muted"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Perfil</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
