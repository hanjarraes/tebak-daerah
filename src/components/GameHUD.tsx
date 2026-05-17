import type { GameState } from '../types/game';
import { SCORING } from '../types/game';

interface Props {
  state: GameState;
}

export function GameHUD({ state }: Props) {
  const timerPercent = (state.timeLeft / SCORING.TIME_PER_QUESTION_MS) * 100;
  const timerColor = timerPercent > 60 ? '#5BAD4E' : timerPercent > 30 ? '#FFD966' : '#E05A4E';

  return (
    <div className="sticky top-0 z-40 bg-at-sky border-b-4 border-at-black px-4 py-2">
      <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
        <div className="flex gap-1">
          {Array.from({ length: SCORING.TOTAL_LIVES }).map((_, i) => (
            <span key={i} className="text-2xl">{i < state.lives ? '❤️' : '🖤'}</span>
          ))}
        </div>

        {state.streak > 1 && (
          <div className="flex items-center gap-1 bg-at-purple text-white border-2 border-at-black px-3 py-1 rounded-full font-bubblegum text-sm shadow-[2px_2px_0_#1A1A1A]">
            🔥 x{state.streak}
          </div>
        )}

        <div className="flex-1 max-w-xs">
          <div className="bg-white border-2 border-at-black rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
            />
          </div>
        </div>

        <div className="font-bubblegum text-at-black text-xl">
          {state.score.toLocaleString('id-ID')} pts
        </div>
      </div>
    </div>
  );
}
