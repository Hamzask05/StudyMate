// ============================================================================
// EmptyState — l'affichage quand une liste est vide. Bonne pratique UX
// (skill ui-ux-pro-max) : ne jamais laisser un écran blanc, mais guider avec
// une icône, un message et — si possible — une action.
// ============================================================================

import type { ReactNode } from 'react';
import { Center, Stack, Text, ThemeIcon } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';

interface EmptyStateProps {
  icon: Icon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: IconCmp, title, description, action }: EmptyStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="xs" maw={360}>
        <ThemeIcon size={56} radius="xl" variant="light" color="gray">
          <IconCmp size={28} stroke={1.5} />
        </ThemeIcon>
        <Text fw={600} ta="center">{title}</Text>
        {description && (
          <Text size="sm" c="dimmed" ta="center">{description}</Text>
        )}
        {action && <div style={{ marginTop: 4 }}>{action}</div>}
      </Stack>
    </Center>
  );
}
