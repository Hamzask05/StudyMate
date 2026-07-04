// ============================================================================
// FloatingTimer — la pastille flottante du minuteur.
// Position fixe en bas à droite, visible sur TOUTES les pages tant qu'un
// minuteur est actif (en cours ou en pause). Permet de garder le minuteur
// sous les yeux quand on navigue ou qu'on change d'onglet.
// ============================================================================

import { ActionIcon, Group, Paper, RingProgress, Text } from '@mantine/core';
import { IconPlayerPause, IconPlayerPlay, IconArrowUpRight } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePomodoroTimer } from '../../context/PomodoroContext';
import { formatTime, PHASE_META } from './PomodoroTimer';

export default function FloatingTimer() {
  const timer = usePomodoroTimer();
  const location = useLocation();
  const navigate = useNavigate();

  // Rien à montrer si le minuteur est "neuf", ou si le mode focus est actif
  // (dans ce cas l'overlay plein écran prend le relais)
  if (timer.isIdle || timer.focusMode) return null;

  const meta = PHASE_META[timer.phase];
  // Page "propriétaire" du minuteur : le programme rattaché, sinon /pomodoro
  const target = timer.attached ? `/programmes/${timer.attached.id}` : '/pomodoro';

  // Inutile d'afficher la pastille si on est déjà sur cette page
  if (location.pathname === target) return null;

  return (
    <Paper
      shadow="lg"
      p="md"
      radius="lg"
      withBorder
      // Plus grande et centrée horizontalement en bas de l'écran
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
      }}
    >
      <Group gap="md" wrap="nowrap">
        <RingProgress
          size={64}
          thickness={5}
          roundCaps
          sections={[
            { value: (1 - timer.secondsLeft / timer.totalSeconds) * 100, color: meta.color },
          ]}
          label={
            <Text ta="center" size="12px" fw={700} ff="monospace">
              {formatTime(timer.secondsLeft)}
            </Text>
          }
        />
        <div>
          <Text fw={600}>{meta.label}</Text>
          <Text size="sm" c="dimmed">
            {timer.attached ? timer.attached.name : 'Mode libre'}
          </Text>
        </div>
        <ActionIcon
          size="lg"
          variant="light"
          color={meta.color}
          onClick={timer.isRunning ? timer.pause : timer.start}
          aria-label={timer.isRunning ? 'Pause' : 'Reprendre'}
        >
          {timer.isRunning ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
        </ActionIcon>
        <ActionIcon
          size="lg"
          variant="subtle"
          color="gray"
          onClick={() => navigate(target)}
          aria-label="Ouvrir le minuteur"
        >
          <IconArrowUpRight size={18} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
