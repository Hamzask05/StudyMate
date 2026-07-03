// ============================================================================
// TaskItem — UNE ligne de la liste : case à cocher + titre + bouton supprimer.
//
// Illustre le motif central de React : "les données descendent, les
// événements remontent". Ce composant REÇOIT sa tâche en props (descente),
// et quand l'utilisateur agit, il APPELLE les fonctions onToggle/onDelete
// fournies par le parent (remontée) — il ne modifie rien lui-même.
// ============================================================================

import { Checkbox, CloseButton, Group, Text } from '@mantine/core';
import type { Task } from '../types/task';

// Le "contrat" des props : ce que le parent DOIT fournir (vérifié à la compilation)
interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    // Group : aligne ses enfants horizontalement.
    // justify="space-between" pousse le bouton supprimer à droite.
    <Group justify="space-between" py="xs">
      <Checkbox
        checked={task.done}
        onChange={() => onToggle(task)}
        label={
          // JSX conditionnel (fiche React §5) : barré + grisé si la tâche est faite
          <Text td={task.done ? 'line-through' : undefined} c={task.done ? 'dimmed' : undefined}>
            {task.title}
          </Text>
        }
      />
      <CloseButton
        aria-label="Supprimer la tâche"
        onClick={() => onDelete(task.id)}
      />
    </Group>
  );
}
