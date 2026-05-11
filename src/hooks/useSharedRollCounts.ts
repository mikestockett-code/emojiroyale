import { useCallback, useState } from 'react';
import type { Player } from '../types';

export function useSharedRollCounts(initialPerPlayer = 3) {
  const [rollCounts, setRollCounts] = useState<Record<Player, number>>(
    { player1: initialPerPlayer, player2: initialPerPlayer },
  );
  const consumeRoll = useCallback((player: Player) =>
    setRollCounts(c => ({ ...c, [player]: Math.max(0, c[player] - 1) })), []);
  const resetRolls = useCallback(() =>
    setRollCounts({ player1: initialPerPlayer, player2: initialPerPlayer }), [initialPerPlayer]);
  return { rollCounts, consumeRoll, resetRolls };
}
