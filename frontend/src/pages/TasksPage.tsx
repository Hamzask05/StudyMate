// ============================================================================
// TasksPage — la page du module Tâches. C'est ici que tout se rejoint :
//   - useQuery     : LIT la liste des tâches depuis le backend (GET)
//   - useMutation  : MODIFIE les données (POST / PATCH / DELETE)
//   - useState     : l'état local du champ de saisie
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { createTask, deleteTask, fetchTasks, updateTask } from '../api/tasks';
import type { Task } from '../types/task';
import TaskItem from '../components/TaskItem';

export default function TasksPage() {
  // État local : le contenu du champ "nouvelle tâche" (fiche React §8-9)
  const [title, setTitle] = useState('');

  // Le client TanStack Query (fourni par le Provider de main.tsx) —
  // on en a besoin pour invalider le cache après une modification.
  const queryClient = useQueryClient();

  // ---- LECTURE ----------------------------------------------------------
  // useQuery appelle fetchTasks et nous tient au courant :
  //   isPending = requête en cours | error = échec | data = les tâches
  // À chaque changement de ces valeurs → re-render automatique.
  const { data: tasks, isPending, error } = useQuery({
    queryKey: ['tasks'],   // l'étiquette de cette donnée dans le cache
    queryFn: fetchTasks,
  });

  // ---- ÉCRITURES --------------------------------------------------------
  // Après chaque modification réussie, on "invalide" l'étiquette ['tasks'] :
  // TanStack Query sait alors que sa copie est périmée et relance fetchTasks
  // → la liste affichée se met à jour toute seule.
  const refreshTasks = () =>
    queryClient.invalidateQueries({ queryKey: ['tasks'] });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: refreshTasks,
  });

  const toggleMutation = useMutation({
    // Cocher = envoyer l'inverse du done actuel via PATCH
    mutationFn: (task: Task) => updateTask(task.id, { done: !task.done }),
    onSuccess: refreshTasks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: refreshTasks,
  });

  // ---- AFFICHAGE --------------------------------------------------------
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2}>Mes tâches</Title>

      {/* Le formulaire d'ajout : champ contrôlé (fiche React §9) */}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // ne pas recharger la page (réflexe SPA !)
          if (title.trim() === '') return;
          createMutation.mutate(title); // déclenche le POST
          setTitle(''); // vide le champ
        }}
      >
        <Group mt="md">
          <TextInput
            placeholder="Nouvelle tâche…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1 }} // prend toute la largeur disponible
          />
          <Button type="submit" loading={createMutation.isPending}>
            Ajouter
          </Button>
        </Group>
      </form>

      <Divider my="md" />

      {/* Les 3 états possibles de la donnée serveur : chargement / erreur / prête */}
      {isPending && <Loader />}

      {error && (
        <Alert color="red" title="Impossible de charger les tâches">
          {error.message}
        </Alert>
      )}

      {tasks && tasks.length === 0 && (
        <Text c="dimmed">Aucune tâche — ajoute la première !</Text>
      )}

      {tasks && (
        <Stack gap={0}>
          {/* .map : une <TaskItem> par tâche ; key = l'id BDD (fiche React §10) */}
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={(t) => toggleMutation.mutate(t)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </Stack>
      )}
    </Card>
  );
}
