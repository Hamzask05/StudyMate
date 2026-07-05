// ============================================================================
// ProgrammeDetailPage — le HUB d'un programme (/programmes/:id).
// Rassemble autour d'un programme : ses matières, ses tâches (rattachées),
// un accès Pomodoro, et sa progression (selon le mode de suivi choisi).
// ============================================================================

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { Link, useParams } from 'react-router-dom';
import { fetchProgramme } from '../api/programmes';
import { fetchSessions } from '../api/pomodoroSessions';
import { createTask, deleteTask, fetchTasks, updateTask } from '../api/tasks';
import TaskItem from '../components/TaskItem';
import ProgressSection from '../components/ProgressSection';
import RevisionNotes from '../components/RevisionNotes';
import Deadlines from '../components/Deadlines';
import PomodoroTimer from '../components/timer/PomodoroTimer';
import { usePomodoroTimer } from '../context/PomodoroContext';

export default function ProgrammeDetailPage() {
  // useParams : récupère le :id de l'URL (toujours une chaîne) → number
  const { id } = useParams();
  const programmeId = Number(id);

  const queryClient = useQueryClient();
  const [taskTitle, setTaskTitle] = useState('');
  const timer = usePomodoroTimer();

  // Le programme lui-même
  const { data: programme, isPending: loadingProgramme } = useQuery({
    queryKey: ['programme', programmeId],
    queryFn: () => fetchProgramme(programmeId),
  });

  // Rattache le minuteur global à CE programme quand il est neuf (à l'arrêt,
  // remis à zéro). Ainsi, si on le lance ici, ses sessions comptent pour ce
  // programme. On ne perturbe pas un minuteur déjà en cours.
  useEffect(() => {
    // Garde : on ne (re)rattache que si le minuteur n'est pas déjà lié à CE
    // programme (sinon boucle infinie car on créerait un nouvel objet à chaque rendu).
    if (timer.isIdle && programme && timer.attached?.id !== programme.id) {
      timer.attachToProgramme({ id: programme.id, name: programme.name });
    }
  }, [timer.isIdle, programme, timer]);

  // Ses tâches (filtrées côté backend par ?programmeId=…)
  const { data: tasks } = useQuery({
    queryKey: ['tasks', programmeId],
    queryFn: () => fetchTasks(programmeId),
  });

  // Ses sessions Pomodoro (pour totaliser les heures travaillées)
  const { data: sessions } = useQuery({
    queryKey: ['sessions', programmeId],
    queryFn: () => fetchSessions(programmeId),
  });

  // Après chaque écriture, on rafraîchit la liste des tâches de CE programme
  const refreshTasks = () =>
    queryClient.invalidateQueries({ queryKey: ['tasks', programmeId] });

  const createMutation = useMutation({
    mutationFn: (title: string) => createTask(title, programmeId),
    onSuccess: () => {
      refreshTasks();
      setTaskTitle('');
    },
  });
  const toggleMutation = useMutation({
    mutationFn: (task: { id: number; done: boolean }) =>
      updateTask(task.id, { done: !task.done }),
    onSuccess: refreshTasks,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: refreshTasks,
  });

  if (loadingProgramme) return <Loader />;
  if (!programme) return <Text>Programme introuvable.</Text>;

  const doneCount = tasks?.filter((t) => t.done).length ?? 0;
  const totalCount = tasks?.length ?? 0;

  // Heures travaillées = somme des minutes de toutes les sessions / 60
  const minutesDone = sessions?.reduce((sum, s) => sum + s.workMinutes, 0) ?? 0;
  const hoursDone = minutesDone / 60;
  const hoursPercent = Math.min(100, (hoursDone / programme.targetHours) * 100);

  return (
    <Stack>
      {/* En-tête : retour + titre + méta */}
      <Group>
        <ActionIcon component={Link} to="/programmes" variant="subtle" aria-label="Retour">
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>{programme.name}</Title>
      </Group>
      <Group gap="xs">
        <Badge variant="light" color={programme.trackingType === 'GRADES' ? 'blue' : 'teal'}>
          {programme.trackingType === 'GRADES' ? 'Suivi par notes /20' : 'Suivi par ressenti'}
        </Badge>
        <Badge variant="light" color="gray">
          {programme.targetHours} h visées
        </Badge>
        {programme.subjects.map((s) => (
          <Badge key={s.id} variant="dot" color={s.color} styles={{ root: { textTransform: 'none' } }}>
            {s.name}
          </Badge>
        ))}
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {/* ---- Bloc Tâches du programme ---- */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Title order={4}>Tâches</Title>
            {totalCount > 0 && (
              <Text c="dimmed" size="sm">
                {doneCount}/{totalCount} faites
              </Text>
            )}
          </Group>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (taskTitle.trim() === '') return;
              createMutation.mutate(taskTitle);
            }}
          >
            <Group mt="sm">
              <TextInput
                placeholder="Nouvelle tâche pour ce programme…"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button type="submit" leftSection={<IconPlus size={16} />} loading={createMutation.isPending}>
                Ajouter
              </Button>
            </Group>
          </form>

          <Divider my="sm" />

          {tasks && tasks.length === 0 && (
            <Text c="dimmed" size="sm">Aucune tâche pour ce programme.</Text>
          )}
          <Stack gap={0}>
            {tasks?.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={(t) => toggleMutation.mutate(t)}
                onDelete={(taskId) => deleteMutation.mutate(taskId)}
              />
            ))}
          </Stack>
        </Card>

        {/* ---- Bloc Outils / Progression ---- */}
        <Stack>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4}>Temps de révision</Title>
            <Group justify="space-between" mt="sm">
              <Text size="sm" fw={500}>
                {hoursDone.toFixed(1)} h / {programme.targetHours} h
              </Text>
              <Text size="sm" c="dimmed">
                {Math.round(hoursPercent)} %
              </Text>
            </Group>
            <Progress value={hoursPercent} mt={4} mb="md" size="lg" radius="xl" />

            {/* Le minuteur tourne ICI, dans le programme. Les sessions
                terminées sont comptées automatiquement (barre ci-dessus). */}
            <PomodoroTimer showSettings={false} ringSize={180} />
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="sm">Progression</Title>
            <ProgressSection
              programmeId={programme.id}
              trackingType={programme.trackingType}
            />
          </Card>
        </Stack>
      </SimpleGrid>

      {/* Échéances (pleine largeur) */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="sm">Échéances</Title>
        <Deadlines programmeId={programme.id} />
      </Card>

      {/* Fiches de révision (pleine largeur, sous la grille) */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="sm">Fiches de révision</Title>
        <RevisionNotes programmeId={programme.id} />
      </Card>
    </Stack>
  );
}
