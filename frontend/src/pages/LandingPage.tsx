// ============================================================================
// LandingPage — la page d'accueil MARKETING (le visage public du SaaS).
// Elle vit à l'URL "/" (hors de l'AppShell) : barre de navigation, hero,
// fonctionnalités, fonctionnement, et appel à l'action vers l'application.
// ============================================================================

import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBook,
  IconCalendarEvent,
  IconChartLine,
  IconChecklist,
  IconClock,
  IconNotes,
  IconTargetArrow,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

const FEATURES = [
  {
    icon: IconTargetArrow,
    title: 'Programmes structurés',
    text: "Regroupe matières, objectif d'heures et suivi de progression dans un seul plan de révision.",
  },
  {
    icon: IconClock,
    title: 'Minuteur Pomodoro',
    text: 'Des sessions de concentration qui continuent quand tu changes de fenêtre, avec un mode plein écran.',
  },
  {
    icon: IconChartLine,
    title: 'Suivi de progression',
    text: 'Visualise ton évolution par notes /20 ou par ressenti, au fil du temps.',
  },
  {
    icon: IconCalendarEvent,
    title: 'Échéances',
    text: 'Garde un œil sur tes examens et rendus, classés par date et par importance.',
  },
  {
    icon: IconNotes,
    title: 'Fiches de révision',
    text: 'Rédige et retrouve tes notes de cours directement dans chaque programme.',
  },
  {
    icon: IconChecklist,
    title: 'Tâches',
    text: 'Découpe tes révisions en tâches concrètes et coche-les au fur et à mesure.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Crée un programme',
    text: "Choisis tes matières, ton mode de suivi et le nombre d'heures visé.",
  },
  {
    n: '02',
    title: 'Révise avec les outils',
    text: 'Lance le Pomodoro, avance tes tâches, rédige tes fiches — tout est réuni.',
  },
  {
    n: '03',
    title: 'Suis ta progression',
    text: 'Saisis tes notes ou ton ressenti et regarde ta courbe monter.',
  },
];

function Logo() {
  return (
    <Group gap={8}>
      <ThemeIcon size={30} radius="md" variant="gradient" gradient={{ from: 'brand.6', to: 'success.6', deg: 135 }}>
        <IconBook size={18} />
      </ThemeIcon>
      <Text fw={800} fz="lg">StudyMate</Text>
    </Group>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const openApp = () => navigate('/app');

  return (
    <Box>
      {/* ---- Barre de navigation ---- */}
      <Box className="landing-nav">
        <Container size="lg" py="sm">
          <Group justify="space-between">
            <Logo />
            <Group gap="sm" visibleFrom="xs">
              <Anchor href="#features" c="dimmed" fw={500} underline="never">Fonctionnalités</Anchor>
              <Anchor href="#how" c="dimmed" fw={500} underline="never">Fonctionnement</Anchor>
              <Button onClick={openApp} rightSection={<IconArrowRight size={16} />}>
                Ouvrir l'app
              </Button>
            </Group>
            <Button hiddenFrom="xs" size="sm" onClick={openApp}>Ouvrir</Button>
          </Group>
        </Container>
      </Box>

      {/* ---- Hero ---- */}
      <Box className="landing-hero">
        <Container size="lg" py={{ base: 48, sm: 80 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={48} verticalSpacing={48}>
            <Stack justify="center" gap="lg">
              <Badge size="lg" variant="light" radius="sm" w="fit-content">
                Ton compagnon de révisions
              </Badge>
              <Title fz={{ base: 34, sm: 48 }} lh={1.1}>
                Révise mieux,{' '}
                <Text span inherit variant="gradient" gradient={{ from: 'brand.7', to: 'success.6', deg: 90 }}>
                  pas plus.
                </Text>
              </Title>
              <Text size="lg" c="dimmed" maw={520}>
                StudyMate réunit tes programmes, ton minuteur, tes tâches, tes fiches et
                ta progression au même endroit. Fini les dix applications éparpillées.
              </Text>
              <Group>
                <Button size="md" onClick={openApp} rightSection={<IconArrowRight size={18} />}>
                  Commencer gratuitement
                </Button>
                <Button size="md" variant="default" component="a" href="#features">
                  Découvrir les fonctionnalités
                </Button>
              </Group>
              <Group gap="xl" mt="sm">
                <div>
                  <Text fw={800} fz="xl">2</Text>
                  <Text size="sm" c="dimmed">modes de révision</Text>
                </div>
                <div>
                  <Text fw={800} fz="xl">6+</Text>
                  <Text size="sm" c="dimmed">outils intégrés</Text>
                </div>
                <div>
                  <Text fw={800} fz="xl">0</Text>
                  <Text size="sm" c="dimmed">distraction</Text>
                </div>
              </Group>
            </Stack>

            {/* Aperçu produit stylisé */}
            <Card shadow="xl" radius="lg" withBorder p="lg" visibleFrom="md">
              <Group justify="space-between" mb="md">
                <Text fw={700}>Préparation partiel maths</Text>
                <Badge variant="light">Notes /20</Badge>
              </Group>
              <Group align="center" gap="xl">
                <RingProgress
                  size={130}
                  thickness={10}
                  roundCaps
                  sections={[{ value: 68, color: 'brand.6' }]}
                  label={<Text ta="center" fw={700}>17:30</Text>}
                />
                <Stack gap={6} style={{ flex: 1 }}>
                  <Text size="sm" c="dimmed">Cette semaine</Text>
                  <Group justify="space-between"><Text size="sm">Heures</Text><Text size="sm" fw={600}>6,5 / 10 h</Text></Group>
                  <Box h={6} bg="gray.2" style={{ borderRadius: 4 }}>
                    <Box h={6} w="65%" bg="brand.6" style={{ borderRadius: 4 }} />
                  </Box>
                  <Group justify="space-between" mt="xs"><Text size="sm">Tâches</Text><Text size="sm" fw={600}>4 / 6</Text></Group>
                  <Group gap={6} mt="xs">
                    <Badge size="sm" color="success" variant="light">14</Badge>
                    <Badge size="sm" color="success" variant="light">15,5</Badge>
                    <Badge size="sm" color="brand" variant="light">objectif 16</Badge>
                  </Group>
                </Stack>
              </Group>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      {/* ---- Fonctionnalités ---- */}
      <Container size="lg" py={{ base: 48, sm: 72 }} id="features">
        <Stack align="center" gap="xs" mb="xl">
          <Title order={2} ta="center">Tout ce qu'il faut pour réviser sereinement</Title>
          <Text c="dimmed" ta="center" maw={560}>
            Chaque outil est pensé pour un seul objectif : t'aider à travailler efficacement.
          </Text>
        </Stack>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {FEATURES.map((f) => (
            <Card key={f.title} className="feature-card" radius="lg" withBorder padding="lg">
              <ThemeIcon size={44} radius="md" variant="light">
                <f.icon size={24} />
              </ThemeIcon>
              <Text fw={700} mt="md">{f.title}</Text>
              <Text c="dimmed" size="sm" mt={4}>{f.text}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* ---- Fonctionnement ---- */}
      <Box bg="gray.0" py={{ base: 48, sm: 72 }} id="how">
        <Container size="lg">
          <Stack align="center" gap="xs" mb="xl">
            <Title order={2} ta="center">Comment ça marche</Title>
            <Text c="dimmed" ta="center">Trois étapes, et c'est parti.</Text>
          </Stack>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            {STEPS.map((s) => (
              <Stack key={s.n} gap="xs">
                <Text fw={800} fz={40} c="brand.3">{s.n}</Text>
                <Text fw={700} fz="lg">{s.title}</Text>
                <Text c="dimmed">{s.text}</Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ---- Appel à l'action final ---- */}
      <Container size="lg" py={{ base: 48, sm: 72 }}>
        <Card className="cta-band" radius="lg" p={{ base: 'xl', sm: 48 }}>
          <Stack align="center" gap="md">
            <Title order={2} ta="center" c="white">Prêt à t'y mettre ?</Title>
            <Text ta="center" c="white" opacity={0.9} maw={520}>
              Crée ton premier programme en moins d'une minute. Aucune inscription requise.
            </Text>
            <Button size="md" color="white" c="brand.7" onClick={openApp} rightSection={<IconArrowRight size={18} />}>
              Ouvrir StudyMate
            </Button>
          </Stack>
        </Card>
      </Container>

      {/* ---- Pied de page ---- */}
      <Box component="footer" py="xl" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
        <Container size="lg">
          <Group justify="space-between">
            <Logo />
            <Text size="sm" c="dimmed">Projet étudiant — conçu pour mieux réviser.</Text>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
