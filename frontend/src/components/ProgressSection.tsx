// ============================================================================
// ProgressSection — saisie + courbe de progression d'un programme.
// S'adapte au mode de suivi :
//   - GRADES : saisie d'une note /20
//   - MOOD   : saisie d'un ressenti de 1 à 5
// La courbe (Recharts) montre l'évolution des points dans le temps.
// ============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Group, NumberInput, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { createEntry, fetchEntries } from '../api/progress';
import type { TrackingType } from '../types/programme';

interface ProgressSectionProps {
  programmeId: number;
  trackingType: TrackingType;
}

export default function ProgressSection({ programmeId, trackingType }: ProgressSectionProps) {
  const isGrades = trackingType === 'GRADES';
  const maxValue = isGrades ? 20 : 5;

  const [value, setValue] = useState<number>(isGrades ? 10 : 3);
  const [label, setLabel] = useState('');

  const queryClient = useQueryClient();
  const { data: entries } = useQuery({
    queryKey: ['progress', programmeId],
    queryFn: () => fetchEntries(programmeId),
  });

  const addEntry = useMutation({
    mutationFn: () => createEntry(programmeId, value, label || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', programmeId] });
      setLabel('');
    },
  });

  // Prépare les données pour Recharts : un point = { name, value }
  const chartData =
    entries?.map((e, i) => ({
      name: e.label || `#${i + 1}`,
      value: e.value,
    })) ?? [];

  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        {isGrades
          ? 'Saisis tes notes /20 au fil du temps.'
          : 'Note ton ressenti (1 = difficile, 5 = à l\'aise).'}
      </Text>

      {/* Saisie adaptée au mode */}
      <Group align="flex-end">
        {isGrades ? (
          <NumberInput
            label="Note /20"
            min={0}
            max={20}
            step={0.5}
            value={value}
            onChange={(v) => setValue(Number(v) || 0)}
            w={110}
          />
        ) : (
          <div>
            <Text size="sm" fw={500} mb={4}>Ressenti</Text>
            <SegmentedControl
              value={String(value)}
              onChange={(v) => setValue(Number(v))}
              data={['1', '2', '3', '4', '5']}
            />
          </div>
        )}
        <TextInput
          label="Étiquette (optionnel)"
          placeholder={isGrades ? 'Contrôle chapitre 3' : 'Après révision'}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button onClick={() => addEntry.mutate()} loading={addEntry.isPending}>
          Ajouter
        </Button>
      </Group>

      {/* Courbe : affichée dès qu'il y a au moins un point */}
      {chartData.length === 0 ? (
        <Text c="dimmed" size="sm">Aucun point encore. Ajoute ta première {isGrades ? 'note' : 'évaluation'}.</Text>
      ) : (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 8, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis domain={[0, maxValue]} fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={isGrades ? '#4c6ef5' : '#12b886'}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Stack>
  );
}
