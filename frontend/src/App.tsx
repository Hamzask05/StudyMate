// ============================================================================
// App.tsx — LE COMPOSANT RACINE. Son rôle désormais : définir le ROUTING,
// c'est-à-dire la correspondance URL → page.
//
// C'est le cœur d'une SPA : quand on clique un lien du menu, React Router
// change l'URL SANS recharger la page, puis affiche le composant associé
// dans le <Outlet /> du Layout. Le backend n'est pas sollicité pour
// naviguer — seulement pour les données.
// ============================================================================

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TasksPage from './pages/TasksPage';
import PomodoroPage from './pages/PomodoroPage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route "parent" sans path : le Layout enveloppe toutes les pages.
            Chaque route enfant s'affiche dans son <Outlet />. */}
        <Route element={<Layout />}>
          <Route path="/" element={<TasksPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/progression" element={<ProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
