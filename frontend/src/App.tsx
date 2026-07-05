// ============================================================================
// App.tsx — LE COMPOSANT RACINE. Définit le ROUTING (URL → page).
// Depuis l'ajout des deux modes, l'accueil "/" est l'écran de CHOIX ;
// les outils (tâches, matières, pomodoro...) restent accessibles via le menu.
// ============================================================================

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import NewProgrammePage from './pages/NewProgrammePage';
import ProgrammesPage from './pages/ProgrammesPage';
import ProgrammeDetailPage from './pages/ProgrammeDetailPage';
import SpontaneousPage from './pages/SpontaneousPage';
import SubjectsPage from './pages/SubjectsPage';
import DeadlinesPage from './pages/DeadlinesPage';
import PomodoroPage from './pages/PomodoroPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page marketing publique, hors de l'application (pas de sidebar) */}
        <Route path="/" element={<LandingPage />} />

        {/* L'application elle-même, sous /app, avec la coquille (sidebar) */}
        <Route element={<Layout />}>
          <Route path="/app" element={<HomePage />} />
          <Route path="/revision" element={<SpontaneousPage />} />
          <Route path="/programmes" element={<ProgrammesPage />} />
          <Route path="/programmes/nouveau" element={<NewProgrammePage />} />
          <Route path="/programmes/:id" element={<ProgrammeDetailPage />} />
          <Route path="/matieres" element={<SubjectsPage />} />
          <Route path="/echeances" element={<DeadlinesPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
