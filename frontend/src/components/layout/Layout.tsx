// ============================================================================
// Layout — la "coquille" commune à toutes les pages : un en-tête et une
// barre latérale de navigation qui restent fixes, seule la zone centrale
// change selon la page visitée.
//
// Le composant clé est <Outlet /> (React Router) : un emplacement vide où
// le routeur injecte la page correspondant à l'URL courante
// (/ → TasksPage, /pomodoro → PomodoroPage, ...).
// ============================================================================

import {
  ActionIcon,
  AppShell,
  Group,
  NavLink,
  Text,
  ThemeIcon,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconBook,
  IconCalendarEvent,
  IconCards,
  IconClock,
  IconHome,
  IconMoon,
  IconSun,
  IconTargetArrow,
} from '@tabler/icons-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import FloatingTimer from '../timer/FloatingTimer';
import FocusOverlay from '../timer/FocusOverlay';

// Bouton de bascule clair / sombre (réutilisable).
export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <Tooltip label={dark ? 'Passer en clair' : 'Passer en sombre'} withArrow>
      <ActionIcon
        variant="default"
        size="lg"
        radius="md"
        aria-label="Basculer le thème clair/sombre"
        onClick={() => setColorScheme(dark ? 'light' : 'dark')}
      >
        {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}

// La liste des entrées du menu : ajouter une page = ajouter une ligne ici.
// Tâches et Progression ne sont plus dans le menu : elles se gèrent désormais
// à l'intérieur de chaque programme (voir ProgrammeDetailPage).
const navItems = [
  { label: 'Accueil', path: '/app', icon: IconHome },
  { label: 'Programmes', path: '/programmes', icon: IconTargetArrow },
  { label: 'Flashcards', path: '/flashcards', icon: IconCards },
  { label: 'Échéances', path: '/echeances', icon: IconCalendarEvent },
  { label: 'Matières', path: '/matieres', icon: IconBook },
  { label: 'Pomodoro', path: '/pomodoro', icon: IconClock },
];

export default function Layout() {
  // Hook de React Router : nous donne l'URL courante à chaque navigation
  // (le composant se re-rend quand elle change) — sert à surligner
  // l'entrée active du menu.
  const location = useLocation();

  return (
    // AppShell : le composant Mantine "squelette d'application" —
    // header + navbar + zone principale, avec le responsive géré pour nous.
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 220, breakpoint: 'sm' }}
      padding="lg"
    >
      <AppShell.Header p="md">
        <Group justify="space-between" h="100%">
          {/* Logo cliquable vers l'accueil de l'app */}
          <Link to="/app" style={{ textDecoration: 'none', color: 'inherit', width: 'fit-content' }}>
            <Group gap={8}>
              <ThemeIcon size={26} radius="md" variant="gradient" gradient={{ from: 'brand.6', to: 'success.6', deg: 135 }}>
                <IconBook size={16} />
              </ThemeIcon>
              <Text fw={800} fz="lg">StudyMate</Text>
            </Group>
          </Link>
          <ColorSchemeToggle />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        {navItems.map((item) => (
          // NavLink (Mantine) = une entrée de menu stylée.
          // component={Link} : on lui fait utiliser le Link de React Router,
          // qui navigue SANS recharger la page (contrairement à un <a> classique).
          <NavLink
            key={item.path}
            component={Link}
            to={item.path}
            label={item.label}
            leftSection={<item.icon size={18} stroke={1.5} />}
            active={location.pathname === item.path}
          />
        ))}
      </AppShell.Navbar>

      {/* La zone centrale : React Router y affiche la page de l'URL courante.
          La clé = l'URL → le contenu se remonte à chaque navigation, ce qui
          rejoue l'animation de fondu (transition de page). */}
      <AppShell.Main>
        <div key={location.pathname} className="route-fade">
          <Outlet />
        </div>
      </AppShell.Main>

      {/* Pastille flottante du minuteur, présente sur toutes les pages */}
      <FloatingTimer />

      {/* Mode focus plein écran (par-dessus tout quand activé) */}
      <FocusOverlay />
    </AppShell>
  );
}
