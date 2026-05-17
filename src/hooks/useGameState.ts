import { useReducer } from 'react';
import type { GameState, GameAction, ClueType } from '../types/game';
import { SCORING } from '../types/game';

const initialCategoryStats: Record<ClueType, { correct: number; total: number }> = {
  landmark: { correct: 0, total: 0 },
  makanan: { correct: 0, total: 0 },
  budaya: { correct: 0, total: 0 },
};

const initialState: GameState = {
  phase: 'menu',
  questions: [],
  currentIndex: 0,
  selectedProvinceId: null,
  score: 0,
  lives: SCORING.TOTAL_LIVES,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  wrongCount: 0,
  timeLeft: SCORING.TIME_PER_QUESTION_MS,
  lastAnswerCorrect: null,
  lastPointsEarned: 0,
  categoryStats: initialCategoryStats,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        phase: 'playing',
        questions: action.questions,
        timeLeft: SCORING.TIME_PER_QUESTION_MS,
      };

    case 'SELECT_PROVINCE':
      if (state.phase !== 'playing') return state;
      return {
        ...state,
        selectedProvinceId: action.provinceId,
        phase: 'confirming',
      };

    case 'DESELECT_PROVINCE':
      if (state.phase !== 'confirming') return state;
      return {
        ...state,
        selectedProvinceId: null,
        phase: 'playing',
      };

    case 'CONFIRM_ANSWER': {
      if (state.phase !== 'confirming' || !state.selectedProvinceId) return state;
      const currentQ = state.questions[state.currentIndex];
      const isCorrect = state.selectedProvinceId === currentQ.correctProvinceId;
      const newStreak = isCorrect ? state.streak + 1 : 0;
      const multiplier = 1 + Math.min(state.streak * SCORING.STREAK_MULTIPLIER_STEP, SCORING.MAX_STREAK_MULTIPLIER - 1);
      const timeBonus = isCorrect ? Math.floor(state.timeLeft / 1000) * SCORING.TIME_BONUS_PER_SECOND : 0;
      const points = isCorrect ? Math.round(SCORING.BASE_CORRECT * multiplier + timeBonus) : 0;
      const clueType = currentQ.clueType;

      return {
        ...state,
        phase: 'feedback',
        score: state.score + points,
        lastPointsEarned: points,
        lives: isCorrect ? state.lives : state.lives - 1,
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
        correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
        wrongCount: isCorrect ? state.wrongCount : state.wrongCount + 1,
        lastAnswerCorrect: isCorrect,
        categoryStats: {
          ...state.categoryStats,
          [clueType]: {
            correct: state.categoryStats[clueType].correct + (isCorrect ? 1 : 0),
            total: state.categoryStats[clueType].total + 1,
          },
        },
      };
    }

    case 'TIMEOUT': {
      if (state.phase !== 'playing') return state;
      const currentQ = state.questions[state.currentIndex];
      const clueType = currentQ.clueType;
      return {
        ...state,
        phase: 'feedback',
        lives: state.lives - 1,
        streak: 0,
        wrongCount: state.wrongCount + 1,
        lastAnswerCorrect: false,
        lastPointsEarned: 0,
        categoryStats: {
          ...state.categoryStats,
          [clueType]: {
            ...state.categoryStats[clueType],
            total: state.categoryStats[clueType].total + 1,
          },
        },
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;
      if (state.lives <= 0) {
        return { ...state, phase: 'summary' };
      }
      if (nextIndex >= state.questions.length) {
        return { ...state, phase: 'summary' };
      }
      return {
        ...state,
        phase: 'playing',
        currentIndex: nextIndex,
        selectedProvinceId: null,
        timeLeft: SCORING.TIME_PER_QUESTION_MS,
        lastAnswerCorrect: null,
        lastPointsEarned: 0,
      };
    }

    case 'RESTART':
      return { ...initialState };

    case 'TICK':
      if (state.phase !== 'playing') return state;
      return { ...state, timeLeft: action.timeLeft };

    default:
      return state;
  }
}

export function useGameState() {
  return useReducer(gameReducer, initialState);
}
