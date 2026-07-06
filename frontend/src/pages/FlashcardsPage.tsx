// ============================================================================
// FlashcardsPage — la vue GLOBALE des flashcards : toutes les flashcards, tous
// programmes confondus, avec un formulaire de création (rattachement à un
// programme optionnel).
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { IconCards, IconPlus } from '@tabler/icons-react';
import { createFlashcard, deleteFlashcard, fetchAllFlashcards } from '../api/flashcards';
import { fetchProgrammes } from '../api/programmes';
import EmptyState from '../components/EmptyState';
import FlashcardCard from '../components/FlashcardCard';

export default function FlashcardsPage() {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [programmeId, setProgrammeId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['flashcards'] });

  const { data: flashcards, isPending } = useQuery({
    queryKey: ['flashcards', 'all'],
    queryFn: fetchAllFlashcards,
  });

  const { data: programmes } = useQuery({
    queryKey: ['programmes'],
    queryFn: fetchProgrammes,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createFlashcard({
        question,
        answer,
        programmeId: programmeId ? Number(programmeId) : undefined,
      }),
    onSuccess: () => {
      refresh();
      setQuestion('');
      setAnswer('');
      setProgrammeId(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFlashcard,
    onSuccess: refresh,
  });

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Flashcards</Title>
        {!showForm && (
          <Button leftSection={<IconPlus size={18} />} onClick={() => setShowForm(true)}>
            Nouvelle flashcard
          </Button>
        )}
      </Group>

      {/* Formulaire de création */}
      {showForm && (
        <Card shadow="sm" padding="lg" radius="lg" withBorder>
          <Stack gap="sm">
            <TextInput
              label="Question (recto)"
              placeholder="Dérivée de x² ?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <Textarea
              label="Réponse (verso)"
              placeholder="2x"
              autosize
              minRows={2}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <Select
              label="Programme (optionnel)"
              placeholder="Aucun programme"
              clearable
              data={(programmes ?? []).map((p) => ({ value: String(p.id), label: p.name }))}
              value={programmeId}
              onChange={setProgrammeId}
            />
            <Group>
              <Button
                onClick={() => question.trim() && answer.trim() && createMutation.mutate()}
                loading={createMutation.isPending}
                disabled={!question.trim() || !answer.trim()}
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

      {flashcards && flashcards.length === 0 && !showForm && (
        <EmptyState
          icon={IconCards}
          title="Aucune flashcard"
          description="Crée des cartes recto/verso pour réviser en te testant. Clique une carte pour révéler la réponse."
          action={
            <Button leftSection={<IconPlus size={16} />} onClick={() => setShowForm(true)}>
              Nouvelle flashcard
            </Button>
          }
        />
      )}

      {flashcards && flashcards.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {flashcards.map((fc) => (
            <FlashcardCard
              key={fc.id}
              flashcard={fc}
              onDelete={deleteMutation.mutate}
              showProgramme
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
