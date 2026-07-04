// ============================================================================
// HomePage — l'écran d'accueil : le choix entre les deux modes de l'app
// (voir STRUCTURE.md §0) + un accès rapide aux programmes existants.
// ============================================================================

import { useQuery } from '@tanstack/react-query';
import { Badge, Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconBolt, IconTargetArrow } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { fetchProgrammes } from '../api/programmes';

export default function HomePage() {
  // useNavigate : hook de React Router pour naviguer depuis du code
  // (ici, au clic sur une carte) plutôt que via un <Link>.
  const navigate = useNavigate();

  // Les programmes existants, pour l'accès rapide en bas de page
  const { data: programmes } = useQuery({
    queryKey: ['programmes'],
    queryFn: fetchProgrammes,
  });

  return (
    <Stack>
      <div>
        <Title order={2}>Bonjour</Title>
        <Text c="dimmed">Comment veux-tu réviser aujourd'hui ?</Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="sm">
        {/* Carte 1 : mode programme (avec mémoire) */}
        <Card
          shadow="sm"
          padding="xl"
          radius="md"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/programmes/nouveau')}
        >
          <Group>
            <ThemeIcon size={44} radius="md" variant="light" color="blue">
              <IconTargetArrow size={26} />
            </ThemeIcon>
            <Title order={3}>Créer un programme</Title>
          </Group>
          <Text c="dimmed" mt="md">
            Un objectif structuré : matière(s), suivi de progression, heures
            visées. Tes fiches, Pomodoro et notes s'y rattachent, et tout est
            enregistré.
          </Text>
        </Card>

        {/* Carte 2 : révision spontanée (sans mémoire) */}
        <Card
          shadow="sm"
          padding="xl"
          radius="md"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/revision')}
        >
          <Group>
            <ThemeIcon size={44} radius="md" variant="light" color="teal">
              <IconBolt size={26} />
            </ThemeIcon>
            <Title order={3}>Révision spontanée</Title>
          </Group>
          <Text c="dimmed" mt="md">
            Juste réviser, tout de suite, sans rien configurer. Accès direct
            aux outils — rien n'est enregistré.
          </Text>
        </Card>
      </SimpleGrid>

      {/* Accès rapide : reprendre un programme existant (masqué s'il n'y en a pas) */}
      {programmes && programmes.length > 0 && (
        <Stack gap="xs" mt="lg">
          <Text fw={600}>Reprendre un programme</Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {programmes.map((programme) => (
              <Card
                key={programme.id}
                shadow="xs"
                padding="md"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/programmes/${programme.id}`)}
              >
                <Text fw={600} truncate>
                  {programme.name}
                </Text>
                <Group gap={6} mt="xs">
                  <Badge
                    variant="light"
                    color={programme.trackingType === 'GRADES' ? 'blue' : 'teal'}
                  >
                    {programme.trackingType === 'GRADES' ? 'Notes /20' : 'Ressenti'}
                  </Badge>
                  <Badge variant="light" color="gray">
                    {programme.targetHours} h
                  </Badge>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}
