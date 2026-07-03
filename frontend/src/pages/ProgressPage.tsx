// ============================================================================
// ProgressPage — la future courbe de progression. Placeholder pour l'instant.
// ============================================================================

import { Card, Text, Title } from '@mantine/core';

export default function ProgressPage() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2}>Progression</Title>
      <Text c="dimmed" mt="sm">
        Ici viendra la courbe d'avancement, calculée à partir des notes,
        des quiz et des sessions de révision.
      </Text>
    </Card>
  );
}
