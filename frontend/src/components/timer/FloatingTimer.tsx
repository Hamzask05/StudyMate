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

  // Rien à montrer si le minuteur est "neuf" (jamais lancé / remis à zéro)
  if (timer.isIdle) return null;

  const meta = PHASE_META[timer.phase];
  // Page "propriétaire" du minuteur : le programme rattaché, sinon /pomodoro
  const target = timer.attached ? `/programmes/${timer.attached.id}` : '/pomodoro';

  // Inutile d'afficher la pastille si on est déjà sur cette page
  if (location.pathname === target) return null;

  return (
    <Paper
      shadow="md"
      p="xs"
      radius="md"
      withBorder
      style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 300 }}
    >
      <Group gap="xs" wrap="nowrap">
        <RingProgress
          size={44}
          thickness={4}
          sections={[
            { value: (1 - timer.secondsLeft / timer.totalSeconds) * 100, color: meta.color },
          ]}
          label={
            <Text ta="center" size="9px" fw={700} ff="monospace">
              {formatTime(timer.secondsLeft)}
            </Text>
          }
        />
        <div>
          <Text size="sm" fw={600}>{meta.label}</Text>
          <Text size="xs" c="dimmed">
            {timer.attached ? timer.attached.name : 'Mode libre'}
          </Text>
        </div>
        <ActionIcon
          variant="light"
          color={meta.color}
          onClick={timer.isRunning ? timer.pause : timer.start}
          aria-label={timer.isRunning ? 'Pause' : 'Reprendre'}
        >
          {timer.isRunning ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => navigate(target)}
          aria-label="Ouvrir le minuteur"
        >
          <IconArrowUpRight size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
