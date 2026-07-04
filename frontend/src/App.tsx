// ============================================================================
// App.tsx — LE COMPOSANT RACINE. Définit le ROUTING (URL → page).
// Depuis l'ajout des deux modes, l'accueil "/" est l'écran de CHOIX ;
// les outils (tâches, matières, pomodoro...) restent accessibles via le menu.
// ============================================================================

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import NewProgrammePage from './pages/NewProgrammePage';
import ProgrammesPage from './pages/ProgrammesPage';
import ProgrammeDetailPage from './pages/ProgrammeDetailPage';
import SpontaneousPage from './pages/SpontaneousPage';
import SubjectsPage from './pages/SubjectsPage';
import PomodoroPage from './pages/PomodoroPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/revision" element={<SpontaneousPage />} />
          <Route path="/programmes" element={<ProgrammesPage />} />
          <Route path="/programmes/nouveau" element={<NewProgrammePage />} />
          <Route path="/programmes/:id" element={<ProgrammeDetailPage />} />
          <Route path="/matieres" element={<SubjectsPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
