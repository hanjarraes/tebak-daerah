export type ClueType = 'landmark' | 'makanan' | 'budaya';
export type GamePhase = 'menu' | 'playing' | 'confirming' | 'feedback' | 'summary';

export interface Question {
  id: string;
  clueType: ClueType;
  question: string;
  imageUrl: string;
  imageAlt: string;
  correctProvinceId: string;
  correctProvinceName: string;
  funFact: string;
}

export interface GameState {
  phase: GamePhase;
  questions: Question[];
  currentIndex: number;
  selectedProvinceId: string | null;
  score: number;
  lives: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  wrongCount: number;
  timeLeft: number;
  lastAnswerCorrect: boolean | null;
  lastPointsEarned: number;
  categoryStats: Record<ClueType, { correct: number; total: number }>;
}

export type GameAction =
  | { type: 'START_GAME'; questions: Question[] }
  | { type: 'SELECT_PROVINCE'; provinceId: string }
  | { type: 'DESELECT_PROVINCE' }
  | { type: 'CONFIRM_ANSWER' }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESTART' }
  | { type: 'TICK'; timeLeft: number };

export const SCORING = {
  BASE_CORRECT: 100,
  TIME_BONUS_PER_SECOND: 5,
  STREAK_MULTIPLIER_STEP: 0.1,
  MAX_STREAK_MULTIPLIER: 2.0,
  TIME_PER_QUESTION_MS: 20_000,
  TOTAL_LIVES: 3,
  TOTAL_QUESTIONS: 10,
} as const;
