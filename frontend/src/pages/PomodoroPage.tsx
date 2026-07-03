// ============================================================================
// PomodoroPage — le futur minuteur Pomodoro. Placeholder pour l'instant :
// la page existe et est navigable, on la remplira à la prochaine étape.
// ============================================================================

import { Card, Text, Title } from '@mantine/core';

export default function PomodoroPage() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2}>Pomodoro</Title>
      <Text c="dimmed" mt="sm">
        Le minuteur arrive bientôt : sessions de travail, pauses, et
        historique pour alimenter la courbe de progression.
      </Text>
    </Card>
  );
}
