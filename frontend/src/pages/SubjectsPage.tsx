// ============================================================================
// SubjectsPage — gestion des matières (créer, lister, supprimer).
// Même architecture que TasksPage : useQuery pour lire, useMutation pour
// écrire, useState pour le formulaire.
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  ColorInput,
  Divider,
  Group,
  Loader,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import {
  createSubject,
  deleteSubject,
  fetchSubjects,
  type NewSubject,
} from '../api/subjects';

// Valeurs de départ du formulaire (réutilisées pour le réinitialiser)
const EMPTY_FORM: NewSubject = {
  name: '',
  color: '#4c6ef5',
  coefficient: 1,
  targetGrade: null,
};

export default function SubjectsPage() {
  // Un seul état "form" qui regroupe les 4 champs de saisie
  const [form, setForm] = useState<NewSubject>(EMPTY_FORM);

  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['subjects'] });

  const { data: subjects, isPending, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });

  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      refresh();
      setForm(EMPTY_FORM); // vide le formulaire après création
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: refresh,
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2}>Matières</Title>
      <Text c="dimmed" size="sm" mt={4}>
        Définis tes matières : tâches, sessions et notes viendront s'y rattacher.
      </Text>

      {/* --- Formulaire de création --- */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (form.name.trim() === '') return;
          createMutation.mutate(form);
        }}
      >
        <Group mt="md" align="flex-end">
          <TextInput
            label="Nom"
            placeholder="Mathématiques"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ flex: 1 }}
          />
          <ColorInput
            label="Couleur"
            value={form.color}
            onChange={(color) => setForm({ ...form, color })}
            w={140}
          />
          <NumberInput
            label="Coefficient"
            min={0.5}
            step={0.5}
            value={form.coefficient}
            onChange={(v) => setForm({ ...form, coefficient: Number(v) || 1 })}
            w={110}
          />
          <NumberInput
            label="Objectif /20"
            min={0}
            max={20}
            placeholder="—"
            value={form.targetGrade ?? ''}
            onChange={(v) =>
              setForm({ ...form, targetGrade: v === '' ? null : Number(v) })
            }
            w={110}
          />
          <Button type="submit" loading={createMutation.isPending}>
            Ajouter
          </Button>
        </Group>
      </form>

      <Divider my="md" />

      {/* --- Liste des matières --- */}
      {isPending && <Loader />}
      {error && (
        <Alert color="red" title="Impossible de charger les matières">
          {error.message}
        </Alert>
      )}
      {subjects && subjects.length === 0 && (
        <Text c="dimmed">Aucune matière — crée la première.</Text>
      )}

      {subjects && (
        <Stack gap="xs">
          {subjects.map((subject) => (
            <Group key={subject.id} justify="space-between">
              <Group gap="sm">
                {/* Pastille de couleur de la matière */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    backgroundColor: subject.color,
                  }}
                />
                <Text fw={500}>{subject.name}</Text>
                <Badge variant="light" color="gray">
                  coef {subject.coefficient}
                </Badge>
                {subject.targetGrade !== null && (
                  <Badge variant="light" color="blue">
                    objectif {subject.targetGrade}/20
                  </Badge>
                )}
              </Group>
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label="Supprimer la matière"
                onClick={() => deleteMutation.mutate(subject.id)}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}
    </Card>
  );
}
