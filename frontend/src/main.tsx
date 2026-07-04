// ============================================================================
// main.tsx — LE POINT D'ENTRÉE du frontend (l'équivalent du main() Java).
//
// Rôle : prendre notre composant racine <App /> et le "monter" dans la page
// HTML (index.html contient un <div id="root"> vide ; React remplit ce div
// et gère tout ce qui s'y affiche ensuite).
// ============================================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Le CSS de Mantine (importé une seule fois, ici, pour toute l'app)
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';
import { PomodoroProvider } from './context/PomodoroContext';

// Le "client" TanStack Query : l'objet qui gère le cache de toutes les
// données venues du backend (tâches, notes...). Créé une seule fois.
const queryClient = new QueryClient();

// Un "Provider" est un composant qui rend un service disponible pour tous
// ses descendants — le pendant front du conteneur de beans Spring :
//   - MantineProvider     → thème et styles pour tous les composants Mantine
//   - QueryClientProvider → accès au cache pour tous les useQuery/useMutation
// <StrictMode> : mode développement qui signale les erreurs courantes.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        {/* PomodoroProvider : le minuteur global, sous QueryClient (il
            enregistre les sessions) et au-dessus de l'app entière. */}
        <PomodoroProvider>
          <App />
        </PomodoroProvider>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
