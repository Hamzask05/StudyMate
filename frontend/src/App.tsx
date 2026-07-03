// ============================================================================
// App.tsx — LE COMPOSANT RACINE : le sommet de l'arbre de composants.
// Il affiche la page des tâches ; il accueillera bientôt la navigation
// (sidebar) et les autres pages (Pomodoro, Progression...).
// ============================================================================

import { Container, Title } from '@mantine/core';
import TasksPage from './pages/TasksPage';

export default function App() {
  return (
    <Container size="sm" mt="xl">
      <Title order={1} mb="lg">StudyMate</Title>
      <TasksPage />
    </Container>
  );
}
