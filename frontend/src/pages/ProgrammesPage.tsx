// ============================================================================
// ProgrammesPage — la liste des programmes (mode "avec mémoire").
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
import { IconPlus, IconTargetArrow, IconTrash } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteProgramme, fetchProgrammes } from '../api/programmes';
import EmptyState from '../components/EmptyState';

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
        <EmptyState
          icon={IconTargetArrow}
          title="Aucun programme pour l'instant"
          description="Crée ton premier programme pour organiser tes révisions autour d'un objectif."
          action={
            <Button component={Link} to="/programmes/nouveau" leftSection={<IconPlus size={16} />}>
              Créer un programme
            </Button>
          }
        />
      )}

      {programmes?.map((programme) => (
        <Card
          key={programme.id}
          className="sm-card-hover"
          shadow="sm"
          padding="md"
          radius="lg"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/programmes/${programme.id}`)}
        >
          <Group justify="space-between">
            <div>
              <Group gap="xs">
                <Text fw={600}>{programme.name}</Text>
                <Badge variant="light" color={programme.trackingType === 'GRADES' ? 'brand' : 'teal'}>
                  {programme.trackingType === 'GRADES' ? 'Notes /20' : 'Ressenti'}
                </Badge>
                <Badge variant="light" color="gray">{programme.targetHours} h</Badge>
              </Group>
              <Group gap={6} mt="xs">
                {programme.subjects.map((s) => (
                  <Badge key={s.id} variant="dot" color={s.color} styles={{ root: { textTransform: 'none' } }}>
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
