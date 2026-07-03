// ============================================================================
// Layout — la "coquille" commune à toutes les pages : un en-tête et une
// barre latérale de navigation qui restent fixes, seule la zone centrale
// change selon la page visitée.
//
// Le composant clé est <Outlet /> (React Router) : un emplacement vide où
// le routeur injecte la page correspondant à l'URL courante
// (/ → TasksPage, /pomodoro → PomodoroPage, ...).
// ============================================================================

import { AppShell, NavLink, Title } from '@mantine/core';
import { IconChartLine, IconClock, IconListCheck } from '@tabler/icons-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

// La liste des entrées du menu : ajouter une page = ajouter une ligne ici.
const navItems = [
  { label: 'Tâches', path: '/', icon: IconListCheck },
  { label: 'Pomodoro', path: '/pomodoro', icon: IconClock },
  { label: 'Progression', path: '/progression', icon: IconChartLine },
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
        <Title order={3}>StudyMate</Title>
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

      {/* La zone centrale : React Router y affiche la page de l'URL courante */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
