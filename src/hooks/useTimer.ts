import { useEffect, useRef } from 'react';
import type { GameState, GameAction } from '../types/game';
import { SCORING } from '../types/game';

export function useTimer(state: GameState, dispatch: React.Dispatch<GameAction>) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.phase !== 'playing') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    let timeLeft = SCORING.TIME_PER_QUESTION_MS;

    intervalRef.current = setInterval(() => {
      timeLeft -= 100;
      if (timeLeft <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        dispatch({ type: 'TIMEOUT' });
      } else {
        dispatch({ type: 'TICK', timeLeft });
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.currentIndex, state.phase]);
}
