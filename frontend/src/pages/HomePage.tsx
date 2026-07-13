// ============================================================================
// HomePage — l'accueil de l'application (/app) : le choix entre les deux
// modes + un accès rapide aux programmes existants.
// ============================================================================

import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconArrowRight, IconBolt, IconTargetArrow } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { fetchProgrammes } from '../api/programmes';
import DashboardStats from '../components/DashboardStats';

export default function HomePage() {
  const navigate = useNavigate();

  const { data: programmes } = useQuery({
    queryKey: ['programmes'],
    queryFn: fetchProgrammes,
  });

  return (
    <Stack gap="xl">
      <div>
        <Title order={2}>Bonjour</Title>
        <Text c="dimmed">Comment veux-tu réviser aujourd'hui ?</Text>
      </div>

      {/* ---- Tableau de bord : stats de révision ---- */}
      <DashboardStats />

      {/* ---- Les deux modes ---- */}
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Card
          className="sm-card-hover"
          shadow="sm"
          padding="xl"
          radius="lg"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/programmes/nouveau')}
        >
          <Group justify="space-between">
            <Group>
              <ThemeIcon size={44} radius="md" variant="light" color="brand">
                <IconTargetArrow size={26} />
              </ThemeIcon>
              <Title order={3}>Créer un programme</Title>
            </Group>
            <IconArrowRight size={20} color="var(--mantine-color-dimmed)" />
          </Group>
          <Text c="dimmed" mt="md">
            Un objectif structuré : matière(s), suivi de progression, heures
            visées. Tes fiches, Pomodoro et notes s'y rattachent, et tout est
            enregistré.
          </Text>
        </Card>

        <Card
          className="sm-card-hover"
          shadow="sm"
          padding="xl"
          radius="lg"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/revision')}
        >
          <Group justify="space-between">
            <Group>
              <ThemeIcon size={44} radius="md" variant="light" color="teal">
                <IconBolt size={26} />
              </ThemeIcon>
              <Title order={3}>Révision spontanée</Title>
            </Group>
            <IconArrowRight size={20} color="var(--mantine-color-dimmed)" />
          </Group>
          <Text c="dimmed" mt="md">
            Juste réviser, tout de suite, sans rien configurer. Accès direct
            aux outils — rien n'est enregistré.
          </Text>
        </Card>
      </SimpleGrid>

      {/* ---- Accès rapide aux programmes existants ---- */}
      {programmes && programmes.length > 0 && (
        <Stack gap="sm">
          <Text fw={600}>Reprendre un programme</Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {programmes.map((programme) => (
              <Card
                key={programme.id}
                className="sm-card-hover"
                shadow="xs"
                padding="md"
                radius="lg"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/programmes/${programme.id}`)}
              >
                <Text fw={600} truncate>{programme.name}</Text>
                <Group gap={6} mt="xs">
                  <Badge variant="light" color={programme.trackingType === 'GRADES' ? 'brand' : 'teal'}>
                    {programme.trackingType === 'GRADES' ? 'Notes /20' : 'Ressenti'}
                  </Badge>
                  <Badge variant="light" color="gray">{programme.targetHours} h</Badge>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}
