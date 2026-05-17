import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';
import { MenuScreen } from './components/MenuScreen';
import { GameHUD } from './components/GameHUD';
import { ClueCard } from './components/ClueCard';
import { IndonesiaMap } from './components/IndonesiaMap';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { SummaryScreen } from './components/SummaryScreen';
import { SCORING } from './types/game';

export default function App() {
  const [state, dispatch] = useGameState();
  useTimer(state, dispatch);

  const currentQ = state.questions[state.currentIndex];

  if (state.phase === 'menu') {
    return <MenuScreen dispatch={dispatch} />;
  }

  if (state.phase === 'summary') {
    return <SummaryScreen state={state} dispatch={dispatch} />;
  }

  return (
    <div className="min-h-screen bg-at-sky">
      <GameHUD state={state} />

      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4">
        <div className="lg:w-80 flex-shrink-0">
          {currentQ && <ClueCard question={currentQ} />}

          {state.phase === 'confirming' && state.selectedProvinceId && (
            <div className="mt-4 bg-at-cream border-3 border-at-black shadow-[4px_4px_0_#1A1A1A] p-4 rounded-xl text-center">
              <p className="font-patrick text-at-black mb-2">
                Kamu memilih provinsi ini. Yakin?
              </p>
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-at-green text-white border-2 border-at-black shadow-[2px_2px_0_#1A1A1A] font-bubblegum py-2 rounded-lg hover:-translate-y-1 transition-transform"
                  onClick={() => dispatch({ type: 'CONFIRM_ANSWER' })}
                >
                  Yakin! ✓
                </button>
                <button
                  className="flex-1 bg-at-red text-white border-2 border-at-black shadow-[2px_2px_0_#1A1A1A] font-bubblegum py-2 rounded-lg hover:-translate-y-1 transition-transform"
                  onClick={() => dispatch({ type: 'DESELECT_PROVINCE' })}
                >
                  Batal ✗
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 font-patrick text-at-black text-sm text-center">
            Soal {state.currentIndex + 1} dari {SCORING.TOTAL_QUESTIONS}
          </div>
        </div>

        <div className="flex-1 bg-at-cream border-3 border-at-black shadow-[4px_4px_0_#1A1A1A] rounded-2xl overflow-hidden p-2">
          <IndonesiaMap state={state} dispatch={dispatch} />
        </div>
      </div>

      {state.phase === 'feedback' && (
        <FeedbackOverlay state={state} dispatch={dispatch} />
      )}
    </div>
  );
}
