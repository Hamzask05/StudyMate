// ============================================================================
// SpontaneousPage — le mode "révision spontanée" : accès direct aux outils,
// sans créer de programme et sans rien enregistrer.
// ============================================================================

import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function SpontaneousPage() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2}>Révision spontanée</Title>
      <Text c="dimmed" mt="sm">
        Mode libre : utilise les outils sans qu'aucune donnée soit conservée.
        Idéal pour une session rapide et sans engagement.
      </Text>

      <Stack mt="lg" gap="sm">
        <Group>
          <Button
            component={Link}
            to="/pomodoro"
            leftSection={<IconClock size={18} />}
            variant="light"
          >
            Lancer un Pomodoro
          </Button>
        </Group>
        <Text c="dimmed" size="sm">
          Les quiz et fiches de révision arriveront ici avec le module IA.
        </Text>
      </Stack>
    </Card>
  );
}
