// ============================================================================
// PomodoroTimer — l'AFFICHAGE du minuteur (anneau + boutons + réglages).
// Tout l'état vient du minuteur GLOBAL (usePomodoroTimer). Ce composant est
// réutilisé tel quel sur la page Pomodoro ET dans le hub d'un programme.
// ============================================================================

import {
  Badge,
  Button,
  Center,
  Divider,
  Group,
  NumberInput,
  RingProgress,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconRotate,
} from '@tabler/icons-react';
import { usePomodoroTimer, type Phase } from '../../context/PomodoroContext';

// 154 -> "02:34"
export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const PHASE_META: Record<Phase, { label: string; color: string }> = {
  work: { label: 'Travail', color: 'blue' },
  shortBreak: { label: 'Pause courte', color: 'teal' },
  longBreak: { label: 'Pause longue', color: 'indigo' },
};

interface PomodoroTimerProps {
  showSettings?: boolean; // affiche les champs de durées (défaut : oui)
  ringSize?: number;
}

export default function PomodoroTimer({ showSettings = true, ringSize = 230 }: PomodoroTimerProps) {
  const timer = usePomodoroTimer();
  const meta = PHASE_META[timer.phase];
  const { settings, setSettings } = timer;

  return (
    <Stack>
      <Center>
        <Badge color={meta.color} variant="light" size="lg">
          {meta.label}
        </Badge>
      </Center>

      <Center>
        <Stack align="center" gap="md">
          <RingProgress
            size={ringSize}
            thickness={10}
            roundCaps
            sections={[
              {
                value: (1 - timer.secondsLeft / timer.totalSeconds) * 100,
                color: meta.color,
              },
            ]}
            label={
              <Text ta="center" size={`${Math.round(ringSize / 5.5)}px`} fw={700} ff="monospace">
                {formatTime(timer.secondsLeft)}
              </Text>
            }
          />

          <Group>
            {timer.isRunning ? (
              <Button
                leftSection={<IconPlayerPause size={18} />}
                color={meta.color}
                onClick={timer.pause}
              >
                Pause
              </Button>
            ) : (
              <Button
                leftSection={<IconPlayerPlay size={18} />}
                color={meta.color}
                onClick={timer.start}
              >
                Démarrer
              </Button>
            )}
            <Button
              variant="default"
              leftSection={<IconPlayerSkipForward size={18} />}
              onClick={timer.skip}
            >
              Passer
            </Button>
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconRotate size={18} />}
              onClick={timer.reset}
            >
              Réinitialiser
            </Button>
          </Group>

          <Text c="dimmed" size="sm">
            Sessions de travail terminées : {timer.completedSessions} (pause longue toutes les 4)
          </Text>
        </Stack>
      </Center>

      {showSettings && (
        <>
          <Divider my="sm" label="Réglages" labelPosition="center" />
          <Group grow>
            <NumberInput
              label="Travail (min)"
              min={1}
              max={120}
              value={settings.workMin}
              onChange={(v) => setSettings({ ...settings, workMin: Number(v) || 1 })}
              disabled={timer.isRunning}
            />
            <NumberInput
              label="Pause courte (min)"
              min={1}
              max={60}
              value={settings.shortBreakMin}
              onChange={(v) => setSettings({ ...settings, shortBreakMin: Number(v) || 1 })}
              disabled={timer.isRunning}
            />
            <NumberInput
              label="Pause longue (min)"
              min={1}
              max={60}
              value={settings.longBreakMin}
              onChange={(v) => setSettings({ ...settings, longBreakMin: Number(v) || 1 })}
              disabled={timer.isRunning}
            />
          </Group>
        </>
      )}
    </Stack>
  );
}
