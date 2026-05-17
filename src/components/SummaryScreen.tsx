import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { GameState, GameAction, ClueType } from '../types/game';
import { getShuffledQuestions } from '../data/questions';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const CATEGORY_LABEL: Record<ClueType, string> = {
  landmark: '🏛️ Landmark',
  makanan: '🍜 Makanan',
  budaya: '🎭 Budaya',
};

export function SummaryScreen({ state, dispatch }: Props) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const target = state.score;
    const step = Math.ceil(target / 60);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [state.score]);

  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
    setTimeout(() => {
      const questions = getShuffledQuestions(10);
      dispatch({ type: 'START_GAME', questions });
    }, 50);
  };

  const accuracy =
    state.correctCount + state.wrongCount > 0
      ? Math.round((state.correctCount / (state.correctCount + state.wrongCount)) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-at-sky flex flex-col items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="bg-at-cream border-3 border-at-black shadow-[6px_6px_0_#1A1A1A] rounded-2xl p-6 text-center">
          <div className="text-5xl mb-2">🏆</div>
          <h2 className="font-bubblegum text-4xl text-at-black mb-1">Selesai!</h2>

          <motion.div
            className="font-bubblegum text-5xl text-at-blue my-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {displayScore.toLocaleString('id-ID')}
            <span className="text-xl text-at-black"> pts</span>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-at-green text-white border-2 border-at-black rounded-lg p-2">
              <div className="font-bubblegum text-2xl">{state.correctCount}</div>
              <div className="font-patrick text-xs">Benar</div>
            </div>
            <div className="bg-at-red text-white border-2 border-at-black rounded-lg p-2">
              <div className="font-bubblegum text-2xl">{state.wrongCount}</div>
              <div className="font-patrick text-xs">Salah</div>
            </div>
            <div className="bg-at-purple text-white border-2 border-at-black rounded-lg p-2">
              <div className="font-bubblegum text-2xl">{state.bestStreak}🔥</div>
              <div className="font-patrick text-xs">Streak</div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {(Object.keys(state.categoryStats) as ClueType[]).map((cat) => {
              const { correct, total } = state.categoryStats[cat];
              const pct = total > 0 ? (correct / total) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between font-patrick text-sm text-at-black mb-1">
                    <span>{CATEGORY_LABEL[cat]}</span>
                    <span>
                      {correct}/{total}
                    </span>
                  </div>
                  <div className="bg-white border-2 border-at-black rounded-full h-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-at-green rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="font-bubblegum text-at-black mb-4">Akurasi: {accuracy}%</div>

          <button
            className="bg-at-yellow border-3 border-at-black shadow-[3px_3px_0_#1A1A1A] font-bubblegum text-at-black px-8 py-3 rounded-xl hover:-translate-y-1 active:translate-y-0 transition-transform text-lg w-full"
            onClick={handleRestart}
          >
            Main Lagi! 🔄
          </button>
        </div>
      </motion.div>
    </div>
  );
}
