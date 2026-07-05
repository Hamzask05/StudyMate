// ============================================================================
// DeadlinesPage — la vue GLOBALE des échéances : toutes les échéances, tous
// programmes confondus, triées par date, avec un formulaire de création
// (où l'on choisit à quel programme rattacher l'échéance, ou aucun).
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { createDeadline, deleteDeadline, fetchAllDeadlines } from '../api/deadlines';
import { fetchProgrammes } from '../api/programmes';
import type { Importance } from '../types/deadline';

const IMPORTANCE_META: Record<Importance, { label: string; color: string }> = {
  LOW: { label: 'Faible', color: 'gray' },
  MEDIUM: { label: 'Moyenne', color: 'yellow' },
  HIGH: { label: 'Haute', color: 'red' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Nombre de jours entre aujourd'hui et la date (négatif = passé)
function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DeadlinesPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [importance, setImportance] = useState<Importance>('MEDIUM');
  const [notes, setNotes] = useState('');
  const [programmeId, setProgrammeId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['deadlines'] });

  const { data: deadlines, isPending } = useQuery({
    queryKey: ['deadlines', 'all'],
    queryFn: fetchAllDeadlines,
  });

  // Les programmes, pour le sélecteur du formulaire
  const { data: programmes } = useQuery({
    queryKey: ['programmes'],
    queryFn: fetchProgrammes,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createDeadline({
        title,
        dueDate,
        importance,
        notes: notes || undefined,
        programmeId: programmeId ? Number(programmeId) : undefined,
      }),
    onSuccess: () => {
      refresh();
      setTitle('');
      setDueDate('');
      setImportance('MEDIUM');
      setNotes('');
      setProgrammeId(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDeadline,
    onSuccess: refresh,
  });

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Échéances</Title>
        {!showForm && (
          <Button leftSection={<IconPlus size={18} />} onClick={() => setShowForm(true)}>
            Nouvelle échéance
          </Button>
        )}
      </Group>

      {/* Formulaire de création */}
      {showForm && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <TextInput
              label="Titre"
              placeholder="Partiel de maths"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Group grow>
              <TextInput
                type="date"
                label="Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
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
            <Select
              label="Programme (optionnel)"
              placeholder="Aucun programme"
              clearable
              data={(programmes ?? []).map((p) => ({ value: String(p.id), label: p.name }))}
              value={programmeId}
              onChange={setProgrammeId}
            />
            <Textarea
              label="Notes (optionnel)"
              placeholder="Détails…"
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
        </Card>
      )}

      {isPending && <Loader />}

      {deadlines && deadlines.length === 0 && (
        <Text c="dimmed">Aucune échéance pour l'instant.</Text>
      )}

      {/* Liste de toutes les échéances (triées par date côté backend) */}
      {deadlines && deadlines.length > 0 && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            {deadlines.map((deadline, index) => {
              const meta = IMPORTANCE_META[deadline.importance];
              const days = daysUntil(deadline.dueDate);
              // Repère temporel : en retard / aujourd'hui / dans X jours
              const timeLabel =
                days < 0 ? `En retard` : days === 0 ? "Aujourd'hui" : `Dans ${days} j`;
              const timeColor = days < 0 ? 'red' : days <= 3 ? 'orange' : 'gray';
              return (
                <div key={deadline.id}>
                  {index > 0 && <Divider mb="sm" />}
                  <Group justify="space-between" wrap="nowrap" align="flex-start">
                    <div style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Text fw={500}>{deadline.title}</Text>
                        <Badge size="sm" variant="light" color={meta.color}>
                          {meta.label}
                        </Badge>
                        <Badge size="sm" variant="outline" color="gray">
                          {formatDate(deadline.dueDate)}
                        </Badge>
                        <Badge size="sm" variant="light" color={timeColor}>
                          {timeLabel}
                        </Badge>
                        {deadline.programmeName && (
                          <Badge size="sm" variant="dot" color="blue">
                            {deadline.programmeName}
                          </Badge>
                        )}
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
                </div>
              );
            })}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
