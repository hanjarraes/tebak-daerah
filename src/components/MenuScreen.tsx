import { motion } from 'framer-motion';
import type { GameAction } from '../types/game';
import { getShuffledQuestions } from '../data/questions';

interface Props {
  dispatch: React.Dispatch<GameAction>;
}

export function MenuScreen({ dispatch }: Props) {
  const handleStart = () => {
    const questions = getShuffledQuestions(10);
    dispatch({ type: 'START_GAME', questions });
  };

  return (
    <div className="min-h-screen bg-at-sky flex flex-col items-center justify-center p-6">
      <motion.div
        className="text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="text-8xl mb-4">🗺️</div>
        <h1
          className="font-bubblegum text-6xl text-at-black mb-2"
          style={{ textShadow: '4px 4px 0 #FFD966' }}
        >
          Tebak Daerah!
        </h1>
        <p className="font-patrick text-xl text-at-black mb-8">
          Seberapa kenal kamu sama Indonesia? 🇮🇩
        </p>

        <div className="bg-at-cream border-3 border-at-black shadow-[4px_4px_0_#1A1A1A] rounded-2xl p-6 mb-8 max-w-sm mx-auto">
          <p className="font-bubblegum text-at-black mb-2">Cara Main:</p>
          <ul className="font-patrick text-at-black text-left space-y-1 text-sm">
            <li>🏛️ Lihat clue (landmark, makanan, atau budaya)</li>
            <li>🗺️ Klik provinsi yang benar di peta</li>
            <li>⏱️ Jawab sebelum waktu habis (20 detik)</li>
            <li>🔥 Jawaban beruntun = bonus skor!</li>
            <li>❤️ Kamu punya 3 nyawa — jangan buang-buang!</li>
          </ul>
        </div>

        <motion.button
          className="bg-at-yellow border-3 border-at-black shadow-[4px_4px_0_#1A1A1A] font-bubblegum text-at-black text-2xl px-10 py-4 rounded-2xl"
          whileHover={{ y: -4, boxShadow: '6px 6px 0 #1A1A1A' }}
          whileTap={{ y: 2, boxShadow: '2px 2px 0 #1A1A1A' }}
          onClick={handleStart}
        >
          Mulai Petualangan! 🚀
        </motion.button>

        <p className="font-patrick text-xs text-at-black mt-6 opacity-60">
          React + TypeScript + Tailwind
        </p>
      </motion.div>
    </div>
  );
}
