// ============================================================================
// FlashcardCard — une carte de révision. Affiche la question ; au clic, elle
// se retourne pour révéler la réponse. Composant réutilisé dans le hub d'un
// programme ET dans la page globale des flashcards.
// ============================================================================

import { useState } from 'react';
import { ActionIcon, Badge, Card, Group, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import type { Flashcard } from '../types/flashcard';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onDelete: (id: number) => void;
  showProgramme?: boolean; // afficher le badge du programme (vue globale)
}

export default function FlashcardCard({ flashcard, onDelete, showProgramme }: FlashcardCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card
      className="sm-card-hover"
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      style={{ cursor: 'pointer', minHeight: 140, display: 'flex', flexDirection: 'column' }}
      onClick={() => setRevealed((r) => !r)}
    >
      <Group justify="space-between" mb="xs">
        <Badge variant="light" color={revealed ? 'success' : 'brand'} size="sm">
          {revealed ? 'Réponse' : 'Question'}
        </Badge>
        <ActionIcon
          variant="subtle"
          color="red"
          aria-label="Supprimer la flashcard"
          onClick={(e) => {
            e.stopPropagation(); // ne pas retourner la carte en supprimant
            onDelete(flashcard.id);
          }}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>

      {/* Contenu : question ou réponse selon l'état */}
      <Text
        fw={revealed ? 400 : 600}
        style={{ flex: 1, whiteSpace: 'pre-wrap' }}
      >
        {revealed ? flashcard.answer : flashcard.question}
      </Text>

      <Group justify="space-between" mt="sm">
        <Text size="xs" c="dimmed">
          {revealed ? 'Clique pour cacher' : 'Clique pour révéler'}
        </Text>
        {showProgramme && flashcard.programmeName && (
          <Badge size="sm" variant="dot" color="brand">
            {flashcard.programmeName}
          </Badge>
        )}
      </Group>
    </Card>
  );
}
