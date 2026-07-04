// ============================================================================
// PomodoroPage — le Pomodoro "de base" (révision spontanée).
// L'état vient du minuteur GLOBAL (context). La page reste volontairement
// simple : un titre + le composant minuteur réutilisable.
// ============================================================================

import { useEffect } from 'react';
import { Card, Group, Text, Title } from '@mantine/core';
import PomodoroTimer from '../components/timer/PomodoroTimer';
import { usePomodoroTimer } from '../context/PomodoroContext';

export default function PomodoroPage() {
  const timer = usePomodoroTimer();

  // Cette page est le mode LIBRE : si le minuteur est neuf (à l'arrêt, remis
  // à zéro), on le détache de tout programme. Si un minuteur tourne déjà pour
  // un programme, on n'y touche pas (il reste affiché tel quel).
  useEffect(() => {
    // Garde : on ne détache que si ce n'est pas déjà le cas (évite une boucle)
    if (timer.isIdle && timer.attached !== null) timer.attachToProgramme(null);
  }, [timer.isIdle, timer]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder maw={640}>
      <Group justify="space-between" mb="sm">
        <Title order={2}>Pomodoro</Title>
      </Group>
      <Text c="dimmed" size="sm" mb="md">
        {timer.attached
          ? `Programme : ${timer.attached.name} — les sessions terminées y sont comptées.`
          : 'Mode libre — les sessions ne sont rattachées à aucun programme.'}
      </Text>

      <PomodoroTimer />
    </Card>
  );
}
