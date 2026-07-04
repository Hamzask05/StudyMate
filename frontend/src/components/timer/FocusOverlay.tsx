// ============================================================================
// FocusOverlay — le MODE FOCUS : le minuteur en plein écran, centré, sans
// distraction. Activé via timer.setFocusMode(true). Utilise l'API Fullscreen
// du navigateur pour masquer aussi la barre du navigateur ; si elle échoue,
// l'overlay remplit quand même toute la fenêtre.
// ============================================================================

import { useEffect } from 'react';
import { Badge, Box, Button, Group, RingProgress, Stack, Text } from '@mantine/core';
import {
  IconMinimize,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconRotate,
} from '@tabler/icons-react';
import { usePomodoroTimer } from '../../context/PomodoroContext';
import { formatTime, PHASE_META } from './PomodoroTimer';

export default function FocusOverlay() {
  const timer = usePomodoroTimer();
  const { focusMode, setFocusMode } = timer;

  // Synchronise l'overlay avec l'état "plein écran" du navigateur :
  // sortir du plein écran (Échap) referme aussi le mode focus, et inversement.
  useEffect(() => {
    if (!focusMode) return;
    const onFsChange = () => {
      if (!document.fullscreenElement) setFocusMode(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocusMode(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKey);
      // En quittant le mode focus, on sort aussi du plein écran si besoin
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [focusMode, setFocusMode]);

  if (!focusMode) return null;

  const meta = PHASE_META[timer.phase];

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'var(--mantine-color-body)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Bouton pour quitter le mode focus, en haut à droite */}
      <Button
        variant="subtle"
        color="gray"
        leftSection={<IconMinimize size={18} />}
        onClick={() => setFocusMode(false)}
        style={{ position: 'absolute', top: 24, right: 24 }}
      >
        Quitter le focus
      </Button>

      <Stack align="center" gap="xl">
        <Group>
          <Badge color={meta.color} variant="light" size="xl">
            {meta.label}
          </Badge>
          {timer.attached && (
            <Badge variant="light" color="gray" size="xl">
              {timer.attached.name}
            </Badge>
          )}
        </Group>

        <RingProgress
          size={420}
          thickness={14}
          roundCaps
          sections={[
            { value: (1 - timer.secondsLeft / timer.totalSeconds) * 100, color: meta.color },
          ]}
          label={
            <Text ta="center" size="80px" fw={700} ff="monospace">
              {formatTime(timer.secondsLeft)}
            </Text>
          }
        />

        <Group>
          {timer.isRunning ? (
            <Button size="lg" color={meta.color} leftSection={<IconPlayerPause size={20} />} onClick={timer.pause}>
              Pause
            </Button>
          ) : (
            <Button size="lg" color={meta.color} leftSection={<IconPlayerPlay size={20} />} onClick={timer.start}>
              Démarrer
            </Button>
          )}
          <Button size="lg" variant="default" leftSection={<IconPlayerSkipForward size={20} />} onClick={timer.skip}>
            Passer
          </Button>
          <Button size="lg" variant="subtle" color="gray" leftSection={<IconRotate size={20} />} onClick={timer.reset}>
            Réinitialiser
          </Button>
        </Group>

        <Text c="dimmed">
          Sessions de travail terminées : {timer.completedSessions}
        </Text>
      </Stack>
    </Box>
  );
}
