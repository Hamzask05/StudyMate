// ============================================================================
// ProgrammesPage — la liste des programmes créés (mode "avec mémoire").
// ============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteProgramme, fetchProgrammes } from '../api/programmes';

export default function ProgrammesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: programmes, isPending } = useQuery({
    queryKey: ['programmes'],
    queryFn: fetchProgrammes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProgramme,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programmes'] }),
  });

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Mes programmes</Title>
        <Button component={Link} to="/programmes/nouveau" leftSection={<IconPlus size={18} />}>
          Nouveau programme
        </Button>
      </Group>

      {isPending && <Loader />}

      {programmes && programmes.length === 0 && (
        <Text c="dimmed">Aucun programme pour l'instant.</Text>
      )}

      {programmes?.map((programme) => (
        <Card
          key={programme.id}
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/programmes/${programme.id}`)}
        >
          <Group justify="space-between">
            <div>
              <Group gap="xs">
                <Text fw={600}>{programme.name}</Text>
                <Badge variant="light" color={programme.trackingType === 'GRADES' ? 'blue' : 'teal'}>
                  {programme.trackingType === 'GRADES' ? 'Notes /20' : 'Ressenti'}
                </Badge>
                <Badge variant="light" color="gray">
                  {programme.targetHours} h visées
                </Badge>
              </Group>
              <Group gap={6} mt="xs">
                {programme.subjects.map((s) => (
                  <Badge
                    key={s.id}
                    variant="dot"
                    color={s.color}
                    styles={{ root: { textTransform: 'none' } }}
                  >
                    {s.name}
                  </Badge>
                ))}
              </Group>
            </div>
            <ActionIcon
              variant="subtle"
              color="red"
              aria-label="Supprimer le programme"
              onClick={(e) => {
                e.stopPropagation(); // ne pas déclencher la navigation de la carte
                deleteMutation.mutate(programme.id);
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
