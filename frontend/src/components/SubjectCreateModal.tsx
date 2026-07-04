// ============================================================================
// SubjectCreateModal — une popup (modale) pour créer une matière à la volée,
// sans quitter la page en cours (ex : pendant la création d'un programme).
// Prévient le parent via onCreated(matière) une fois la matière enregistrée.
// ============================================================================

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, ColorInput, Group, Modal, NumberInput, Stack, TextInput } from '@mantine/core';
import { createSubject, type NewSubject } from '../api/subjects';
import type { Subject } from '../types/subject';

interface SubjectCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated: (subject: Subject) => void;
}

const EMPTY: NewSubject = { name: '', color: '#4c6ef5', coefficient: 1, targetGrade: null };

export default function SubjectCreateModal({ opened, onClose, onCreated }: SubjectCreateModalProps) {
  const [form, setForm] = useState<NewSubject>(EMPTY);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSubject,
    onSuccess: (subject) => {
      // Rafraîchit la liste des matières partout dans l'app
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      onCreated(subject);
      setForm(EMPTY);
      onClose();
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Nouvelle matière" centered>
      <Stack>
        <TextInput
          label="Nom"
          placeholder="Mathématiques"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          data-autofocus
        />
        <Group grow>
          <ColorInput
            label="Couleur"
            value={form.color}
            onChange={(color) => setForm({ ...form, color })}
          />
          <NumberInput
            label="Coefficient"
            min={0.5}
            step={0.5}
            value={form.coefficient}
            onChange={(v) => setForm({ ...form, coefficient: Number(v) || 1 })}
          />
        </Group>
        <NumberInput
          label="Objectif /20 (optionnel)"
          min={0}
          max={20}
          placeholder="—"
          value={form.targetGrade ?? ''}
          onChange={(v) => setForm({ ...form, targetGrade: v === '' ? null : Number(v) })}
          w={200}
        />

        <Group justify="flex-end" mt="sm">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={() => form.name.trim() && mutation.mutate(form)}
            loading={mutation.isPending}
          >
            Créer la matière
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
