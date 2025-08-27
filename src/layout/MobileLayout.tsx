import * as React from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Box, Paper,
  BottomNavigation, BottomNavigationAction, useTheme, useMediaQuery
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { useAuth } from '../contexts/AuthContext'; // ajuste o path se preciso
import HotCompentencias from '../pages/Home/components/HotCompetencias';
import Right from './components/Right'; // seu componente atual
import LogoSvg from '../../public/AqConnectaIcon.svg'; // ajuste se necessário

// DnD Kit
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MobilePerfilTab from '../pages/perfil/MobilePerfilTab';
import UsuarioProfileMobile from '../pages/Usuario/UsuarioPerfilMobile';

type TabId = 'vagas' | 'competencias' | 'perfil';
type TabItem = { id: TabId; label: string; icon: React.ReactNode; };

const DEFAULT_TABS: TabItem[] = [
  { id: 'vagas', label: 'Vagas', icon: <WorkOutlineIcon /> },
  { id: 'competencias', label: 'Competências', icon: <StarOutlineIcon /> },
  { id: 'perfil', label: 'Perfil', icon: <PersonOutlineIcon /> },
];

function DraggableAction({
  item, index, value, onChange,
}: { item: TabItem; index: number; value: number; onChange: (_: any, v: number) => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BottomNavigationAction
        value={index}
        onClick={(e) => onChange(e, index)}
        label={item.label}
        icon={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {item.icon}
            <DragIndicatorIcon fontSize="small" {...attributes} {...listeners} aria-label={`Reordenar ${item.label}`} />
          </Box>
        }
        sx={{ minWidth: 64 }}
      />
    </div>
  );
}

export default function MobileLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // só renderiza no mobile; no desktop você usa seu layout atual
  if (!isMobile) return null;

  // estado/ordem das abas
  const [order, setOrder] = React.useState<TabId[]>(() => {
    const saved = localStorage.getItem('homeTabsOrder');
    return saved ? (JSON.parse(saved) as TabId[]) : DEFAULT_TABS.map(t => t.id);
  });
  const [active, setActive] = React.useState<number>(() => Number(localStorage.getItem('homeTabsActive') ?? 0));
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const tabs = React.useMemo(
    () => order.map(id => DEFAULT_TABS.find(t => t.id === id)!).filter(Boolean),
    [order]
  );

  React.useEffect(() => { localStorage.setItem('homeTabsOrder', JSON.stringify(order)); }, [order]);
  React.useEffect(() => { localStorage.setItem('homeTabsActive', String(active)); }, [active]);

  function onDragEnd(e: DragEndEvent) {
    const { active: a, over } = e;
    if (!over || a.id === over.id) return;
    const oldIndex = order.indexOf(a.id as TabId);
    const newIndex = order.indexOf(over.id as TabId);
    setOrder(prev => arrayMove(prev, oldIndex, newIndex));
    setActive(prev => arrayMove(order, oldIndex, newIndex).indexOf(order[prev]));
  }

  return (
    <Box sx={{ bgcolor: '#f4f2ee', minHeight: '100vh', pb: 'calc(56px + env(safe-area-inset-bottom))' }}>
      {/* AppBar compacto mantendo sua identidade */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', color: 'inherit', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Toolbar sx={{ minHeight: 56, px: 2 }}>
          <Link to={isAdmin ? '/admin' : '/home'} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img src={LogoSvg} alt="AqConnecta" width={24} height={24} />
          </Link>
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 700, color: 'primary.main' }}>
            {isAdmin ? 'Painel' : 'AqConnecta'}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton color="primary" onClick={logout} aria-label="Sair">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Conteúdo com swipe entre abas */}
      <Box sx={{ height: 'calc(100dvh - 56px - (56px + env(safe-area-inset-bottom)))', overflow: 'hidden' }}>
        <SwipeableViews index={active} onChangeIndex={setActive} resistance>
          {/* Vagas (usa o conteúdo da rota atual) */}
          <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <Outlet />
          </Box>

          {/* Competências (seu componente atual + filtro pode ficar aqui) */}
          <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <HotCompentencias />
            {/* Se quiser, traga também o checkbox "iniciante" aqui */}
          </Box>

          {/* Perfil (reaproveitando seu Right) */}
          <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <UsuarioProfileMobile />
          </Box>
        </SwipeableViews>
      </Box>

      {/* Bottom Navigation com drag & drop + safe-area */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          left: 0, right: 0, bottom: 0,
          pb: 'env(safe-area-inset-bottom)', // evita sobrepor a área do gesto do iOS
        }}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={order} strategy={horizontalListSortingStrategy}>
            <BottomNavigation
              value={active}
              onChange={(_, v) => setActive(v)}
              showLabels
            >
              {tabs.map((t, idx) => (
                <DraggableAction key={t.id} item={t} index={idx} value={active} onChange={(_, v) => setActive(v)} />
              ))}
            </BottomNavigation>
          </SortableContext>
        </DndContext>
      </Paper>
    </Box>
  );
}
