import { motion } from 'framer-motion';
import type { GameState, GameAction } from '../types/game';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function FeedbackOverlay({ state, dispatch }: Props) {
  const currentQ = state.questions[state.currentIndex];
  if (!currentQ) return null;

  const isCorrect = state.lastAnswerCorrect;
  const isTimeout = state.lastAnswerCorrect === false && state.selectedProvinceId === null;

  const bgColor = isCorrect ? 'bg-at-green' : isTimeout ? 'bg-orange-400' : 'bg-at-red';
  const emoji = isCorrect ? '✅' : isTimeout ? '⏰' : '❌';
  const title = isCorrect ? 'Benar!' : isTimeout ? 'Waktu Habis!' : 'Salah!';

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${bgColor} bg-opacity-95`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div
        className="bg-at-cream border-3 border-at-black shadow-[6px_6px_0_#1A1A1A] p-6 max-w-md w-full text-center flex flex-col gap-4"
        style={{ borderRadius: '16px 10px 16px 10px' }}
      >
        <div className="text-6xl">{emoji}</div>
        <h2 className="font-bubblegum text-3xl text-at-black">{title}</h2>

        {!isCorrect && (
          <p className="font-patrick text-at-black">
            Jawaban yang benar: <strong>{currentQ.correctProvinceName}</strong>
          </p>
        )}

        {isCorrect && state.lastPointsEarned > 0 && (
          <motion.div
            className="font-bubblegum text-2xl text-at-green"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            +{state.lastPointsEarned} pts 🎉
          </motion.div>
        )}

        <div className="bg-at-sky border-2 border-at-black rounded-lg p-3 text-left">
          <p className="font-bubblegum text-sm text-at-black mb-1">💡 Fun Fact</p>
          <p className="font-patrick text-sm text-at-black">{currentQ.funFact}</p>
        </div>

        <button
          className="bg-at-yellow border-3 border-at-black shadow-[3px_3px_0_#1A1A1A] font-bubblegum text-at-black px-6 py-3 rounded-lg hover:-translate-y-1 active:translate-y-0 transition-transform text-lg"
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
        >
          Lanjut →
        </button>
      </div>
    </motion.div>
  );
}
