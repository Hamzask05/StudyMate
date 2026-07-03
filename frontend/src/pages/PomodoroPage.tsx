// ============================================================================
// PomodoroPage — l'interface du minuteur. Remarque la répartition des rôles :
// toute la mécanique (tic-tac, phases, bip) vit dans le hook usePomodoro ;
// cette page ne fait QUE de l'affichage et du branchement de boutons.
// ============================================================================

import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Group,
  NumberInput,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconRotate,
} from '@tabler/icons-react';
import { usePomodoro, type Phase, type PomodoroSettings } from '../hooks/usePomodoro';

// 154 secondes -> "02:34" (padStart complète avec des zéros à gauche)
function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Libellé et couleur de chaque phase (couleurs sobres du thème Mantine)
const PHASE_META: Record<Phase, { label: string; color: string }> = {
  work: { label: 'Travail', color: 'blue' },
  shortBreak: { label: 'Pause courte', color: 'teal' },
  longBreak: { label: 'Pause longue', color: 'indigo' },
};

export default function PomodoroPage() {
  // Les réglages sont un état de la PAGE (pas du hook) : c'est l'utilisateur
  // qui les modifie via les champs ci-dessous.
  const [settings, setSettings] = useState<PomodoroSettings>({
    workMin: 25,
    shortBreakMin: 5,
    longBreakMin: 15,
  });

  // On branche notre hook : il nous rend les valeurs et les actions.
  const timer = usePomodoro(settings);
  const meta = PHASE_META[timer.phase];

  // Effet de bord côté page : afficher le temps restant dans le titre de
  // l'onglet du navigateur (visible même quand on est sur un autre onglet).
  // Le nettoyage remet le titre d'origine quand on quitte la page.
  useEffect(() => {
    if (timer.isRunning) {
      document.title = `${formatTime(timer.secondsLeft)} — ${meta.label}`;
    }
    return () => {
      document.title = 'StudyMate';
    };
  }, [timer.secondsLeft, timer.isRunning, meta.label]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between">
        <Title order={2}>Pomodoro</Title>
        <Badge color={meta.color} variant="light" size="lg">
          {meta.label}
        </Badge>
      </Group>

      <Center mt="md">
        <Stack align="center" gap="md">
          {/* L'anneau de progression : la part écoulée de la phase courante */}
          <RingProgress
            size={230}
            thickness={10}
            roundCaps
            sections={[
              {
                value: (1 - timer.secondsLeft / timer.totalSeconds) * 100,
                color: meta.color,
              },
            ]}
            label={
              <Text ta="center" size="42px" fw={700} ff="monospace">
                {formatTime(timer.secondsLeft)}
              </Text>
            }
          />

          <Group>
            {/* Un seul bouton Démarrer/Pause : son rôle dépend de isRunning */}
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
            Sessions de travail terminées : {timer.completedSessions}
            {' '}(pause longue toutes les 4)
          </Text>
        </Stack>
      </Center>

      <Divider my="lg" label="Réglages" labelPosition="center" />

      {/* Réglages désactivés pendant que le minuteur tourne, pour éviter
          de changer les règles en cours de session */}
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
    </Card>
  );
}
