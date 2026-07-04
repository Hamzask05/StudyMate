// ============================================================================
// RevisionNotes — les fiches de révision d'un programme (saisie manuelle).
// Liste dépliable (Accordion) + formulaire d'ajout + suppression.
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Accordion,
  ActionIcon,
  Button,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { createNote, deleteNote, fetchNotes } from '../api/notes';

export default function RevisionNotes({ programmeId }: { programmeId: number }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['notes', programmeId] });

  const { data: notes } = useQuery({
    queryKey: ['notes', programmeId],
    queryFn: () => fetchNotes(programmeId),
  });

  const createMutation = useMutation({
    mutationFn: () => createNote(programmeId, title, content),
    onSuccess: () => {
      refresh();
      setTitle('');
      setContent('');
      setShowForm(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: refresh,
  });

  return (
    <Stack gap="sm">
      {notes && notes.length === 0 && !showForm && (
        <Text c="dimmed" size="sm">Aucune fiche pour ce programme.</Text>
      )}

      {notes && notes.length > 0 && (
        <Accordion variant="separated">
          {notes.map((note) => (
            <Accordion.Item key={note.id} value={String(note.id)}>
              <Group justify="space-between" wrap="nowrap">
                <Accordion.Control>{note.title}</Accordion.Control>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  mr="sm"
                  aria-label="Supprimer la fiche"
                  onClick={() => deleteMutation.mutate(note.id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
              <Accordion.Panel>
                {/* white-space: pre-wrap → conserve les retours à la ligne saisis */}
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {note.content || <Text span c="dimmed">(vide)</Text>}
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      {showForm ? (
        <Stack gap="xs">
          <TextInput
            placeholder="Titre de la fiche"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Contenu de la fiche…"
            autosize
            minRows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Group>
            <Button
              onClick={() => title.trim() && createMutation.mutate()}
              loading={createMutation.isPending}
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
          Nouvelle fiche
        </Button>
      )}
    </Stack>
  );
}
