// ============================================================================
// NewProgrammePage — le formulaire de création d'un programme.
// Rassemble : nom, matière(s), type de suivi (notes /20 ou ressenti),
// objectif d'heures. Envoie un DTO (des subjectIds) au backend.
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDisclosure } from '@mantine/hooks';
import {
  Alert,
  Button,
  Card,
  Group,
  MultiSelect,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { fetchSubjects } from '../api/subjects';
import { createProgramme } from '../api/programmes';
import type { TrackingType } from '../types/programme';
import SubjectCreateModal from '../components/SubjectCreateModal';

export default function NewProgrammePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // État du formulaire
  const [name, setName] = useState('');
  const [subjectIds, setSubjectIds] = useState<string[]>([]); // MultiSelect = strings
  const [trackingType, setTrackingType] = useState<TrackingType>('GRADES');
  const [targetHours, setTargetHours] = useState<number>(10);

  // Ouverture/fermeture de la popup de création de matière
  const [subjectModalOpened, subjectModal] = useDisclosure(false);

  // On a besoin de la liste des matières pour les proposer au choix
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });

  const createMutation = useMutation({
    mutationFn: createProgramme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmes'] });
      navigate('/programmes'); // vers la liste des programmes
    },
  });

  const noSubjects = subjects && subjects.length === 0;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder maw={640}>
      <Title order={2}>Nouveau programme</Title>

      {noSubjects && (
        <Alert color="yellow" mt="md" title="Aucune matière">
          Aucune matière pour l'instant — crée-en une avec le bouton « Nouvelle
          matière » ci-dessous.
        </Alert>
      )}

      {/* La popup de création de matière ; la nouvelle est auto-sélectionnée */}
      <SubjectCreateModal
        opened={subjectModalOpened}
        onClose={subjectModal.close}
        onCreated={(subject) => setSubjectIds((ids) => [...ids, String(subject.id)])}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim() === '' || subjectIds.length === 0) return;
          createMutation.mutate({
            name,
            // MultiSelect renvoie des chaînes → on reconvertit en nombres
            subjectIds: subjectIds.map(Number),
            trackingType,
            targetHours,
          });
        }}
      >
        <Stack mt="md">
          <TextInput
            label="Nom du programme"
            placeholder="Révisions Bac Blanc"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <Group justify="space-between" align="flex-end" mb={4}>
              <Text size="sm" fw={500}>Matière(s) concernée(s)</Text>
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconPlus size={14} />}
                onClick={subjectModal.open}
              >
                Nouvelle matière
              </Button>
            </Group>
            <MultiSelect
              placeholder="Choisis une ou plusieurs matières"
              data={(subjects ?? []).map((s) => ({
                value: String(s.id),
                label: s.name,
              }))}
              value={subjectIds}
              onChange={setSubjectIds}
              searchable
            />
          </div>

          <div>
            <Text size="sm" fw={500} mb={4}>
              Suivi de la progression
            </Text>
            <SegmentedControl
              value={trackingType}
              onChange={(v) => setTrackingType(v as TrackingType)}
              data={[
                { label: 'Notes sur 20', value: 'GRADES' },
                { label: 'Ressenti', value: 'MOOD' },
              ]}
            />
            <Text size="xs" c="dimmed" mt={4}>
              {trackingType === 'GRADES'
                ? 'Tu saisiras de vraies notes /20 pour suivre ta progression.'
                : 'Tu noteras ton ressenti (auto-évaluation) après chaque session.'}
            </Text>
          </div>

          <NumberInput
            label="Objectif d'heures"
            description="Temps total que tu veux consacrer à ce programme"
            min={1}
            max={1000}
            value={targetHours}
            onChange={(v) => setTargetHours(Number(v) || 1)}
            w={220}
          />

          {createMutation.error && (
            <Alert color="red">Erreur : {createMutation.error.message}</Alert>
          )}

          <Group>
            <Button
              type="submit"
              loading={createMutation.isPending}
              disabled={noSubjects}
            >
              Créer le programme
            </Button>
            <Button variant="subtle" color="gray" onClick={() => navigate('/app')}>
              Annuler
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
