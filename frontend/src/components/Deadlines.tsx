// ============================================================================
// Deadlines — les échéances d'un programme : une date, une importance et des
// notes libres. Liste triée par date (au plus proche) + formulaire d'ajout.
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { createDeadline, deleteDeadline, fetchDeadlines } from '../api/deadlines';
import type { Importance } from '../types/deadline';

// Couleur + libellé de chaque niveau d'importance
const IMPORTANCE_META: Record<Importance, { label: string; color: string }> = {
  LOW: { label: 'Faible', color: 'gray' },
  MEDIUM: { label: 'Moyenne', color: 'yellow' },
  HIGH: { label: 'Haute', color: 'red' },
};

// "2026-07-20" → "20 juil. 2026"
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Deadlines({ programmeId }: { programmeId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [importance, setImportance] = useState<Importance>('MEDIUM');
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['deadlines', programmeId] });

  const { data: deadlines } = useQuery({
    queryKey: ['deadlines', programmeId],
    queryFn: () => fetchDeadlines(programmeId),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createDeadline({ title, dueDate, importance, notes: notes || undefined, programmeId }),
    onSuccess: () => {
      refresh();
      setTitle('');
      setDueDate('');
      setImportance('MEDIUM');
      setNotes('');
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDeadline,
    onSuccess: refresh,
  });

  return (
    <Stack gap="sm">
      {deadlines && deadlines.length === 0 && !showForm && (
        <Text c="dimmed" size="sm">Aucune échéance pour ce programme.</Text>
      )}

      {/* Liste des échéances (déjà triées par date côté backend) */}
      {deadlines?.map((deadline) => {
        const meta = IMPORTANCE_META[deadline.importance];
        return (
          <Group key={deadline.id} justify="space-between" wrap="nowrap" align="flex-start">
            <div style={{ flex: 1 }}>
              <Group gap="xs">
                <Text fw={500}>{deadline.title}</Text>
                <Badge size="sm" variant="light" color={meta.color}>
                  {meta.label}
                </Badge>
                <Badge size="sm" variant="outline" color="gray">
                  {formatDate(deadline.dueDate)}
                </Badge>
              </Group>
              {deadline.notes && (
                <Text size="sm" c="dimmed" mt={2} style={{ whiteSpace: 'pre-wrap' }}>
                  {deadline.notes}
                </Text>
              )}
            </div>
            <ActionIcon
              variant="subtle"
              color="red"
              aria-label="Supprimer l'échéance"
              onClick={() => deleteMutation.mutate(deadline.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        );
      })}

      {/* Formulaire d'ajout, dépliable */}
      {showForm ? (
        <Stack gap="xs">
          <TextInput
            placeholder="Titre de l'échéance (ex : Partiel de maths)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Group grow>
            <TextInput
              type="date"
              label="Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <div>
              <Text size="sm" fw={500} mb={4}>Importance</Text>
              <SegmentedControl
                fullWidth
                value={importance}
                onChange={(v) => setImportance(v as Importance)}
                data={[
                  { label: 'Faible', value: 'LOW' },
                  { label: 'Moyenne', value: 'MEDIUM' },
                  { label: 'Haute', value: 'HIGH' },
                ]}
              />
            </div>
          </Group>
          <Textarea
            placeholder="Notes (optionnel)…"
            autosize
            minRows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Group>
            <Button
              onClick={() => title.trim() && dueDate && createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!title.trim() || !dueDate}
            >
              Enregistrer
            </Button>
            <Button variant="subtle" color="gray" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
          </Group>
        </Stack>
      ) : (
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          onClick={() => setShowForm(true)}
          w="fit-content"
        >
          Nouvelle échéance
        </Button>
      )}
    </Stack>
  );
}
