// ============================================================================
// DashboardStats — la rangée de statistiques du tableau de bord d'accueil.
// Donne une vue d'ensemble motivante : heures de la semaine, série de jours
// consécutifs (streak), total révisé, tâches faites.
// ============================================================================

import { useQuery } from '@tanstack/react-query';
import { Card, Group, SimpleGrid, Skeleton, Text, ThemeIcon } from '@mantine/core';
import { IconChecklist, IconClock, IconFlame, IconHourglass } from '@tabler/icons-react';
import { fetchStats } from '../api/stats';

export default function DashboardStats() {
  const { data, isPending } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  if (isPending) {
    return (
      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={78} radius="lg" />
        ))}
      </SimpleGrid>
    );
  }
  if (!data) return null;

  const items = [
    { icon: IconClock, color: 'brand', value: `${data.weekHours} h`, label: 'Cette semaine' },
    { icon: IconFlame, color: 'orange', value: `${data.streakDays} j`, label: 'Série en cours' },
    { icon: IconHourglass, color: 'grape', value: `${data.totalHours} h`, label: 'Total révisé' },
    { icon: IconChecklist, color: 'success', value: `${data.tasksDone}/${data.tasksTotal}`, label: 'Tâches faites' },
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }}>
      {items.map((it) => (
        <Card key={it.label} padding="md" radius="lg" withBorder>
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size={40} radius="md" variant="light" color={it.color}>
              <it.icon size={22} />
            </ThemeIcon>
            <div>
              <Text fw={700} fz="xl" lh={1.1}>{it.value}</Text>
              <Text size="xs" c="dimmed">{it.label}</Text>
            </div>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
