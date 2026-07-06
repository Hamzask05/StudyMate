// ============================================================================
// Flashcards — les flashcards d'un programme (dans le hub) : formulaire de
// création + grille de cartes retournables.
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Group, SimpleGrid, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { createFlashcard, deleteFlashcard, fetchFlashcards } from '../api/flashcards';
import FlashcardCard from './FlashcardCard';

export default function Flashcards({ programmeId }: { programmeId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['flashcards', programmeId] });

  const { data: flashcards } = useQuery({
    queryKey: ['flashcards', programmeId],
    queryFn: () => fetchFlashcards(programmeId),
  });

  const createMutation = useMutation({
    mutationFn: () => createFlashcard({ question, answer, programmeId }),
    onSuccess: () => {
      refresh();
      setQuestion('');
      setAnswer('');
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFlashcard,
    onSuccess: refresh,
  });

  return (
    <Stack gap="sm">
      {flashcards && flashcards.length === 0 && !showForm && (
        <Text c="dimmed" size="sm">Aucune flashcard pour ce programme.</Text>
      )}

      {flashcards && flashcards.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {flashcards.map((fc) => (
            <FlashcardCard key={fc.id} flashcard={fc} onDelete={deleteMutation.mutate} />
          ))}
        </SimpleGrid>
      )}

      {showForm ? (
        <Stack gap="xs">
          <TextInput
            placeholder="Question (recto)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Textarea
            placeholder="Réponse (verso)"
            autosize
            minRows={2}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
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
      ) : (
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          onClick={() => setShowForm(true)}
          w="fit-content"
        >
          Nouvelle flashcard
        </Button>
      )}
    </Stack>
  );
}
