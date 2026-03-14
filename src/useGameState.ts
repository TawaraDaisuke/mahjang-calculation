import { useCallback, useEffect, useReducer, useState } from 'react';
import type { GameState } from './types';
import type { AgariInput, RyukyokuInput } from './types';
import {
  loadState,
  saveState,
  createInitialState,
  applyAgari,
  applyReach,
  applyRyukyoku,
} from './store';

type Action =
  | { type: 'SET_STATE'; payload: GameState }
  | { type: 'SET_POINTS'; index: number; value: number }
  | { type: 'SET_NAME'; index: number; value: string }
  | { type: 'SET_ROUND'; value: number }
  | { type: 'SET_HONBA'; value: number }
  | { type: 'SET_KYOTAKU'; value: number }
  | { type: 'AGARI'; payload: AgariInput }
  | { type: 'REACH'; playerIndex: number }
  | { type: 'RYUKYOKU'; payload: RyukyokuInput }
  | { type: 'END_GAME' }
  | { type: 'RESET' }
  | { type: 'UNDO'; payload: GameState };

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'SET_POINTS': {
      const next = [...state.points];
      next[action.index] = action.value;
      return { ...state, points: next };
    }
    case 'SET_NAME': {
      const next = [...state.names];
      next[action.index] = action.value;
      return { ...state, names: next };
    }
    case 'SET_ROUND':
      return { ...state, roundIndex: Math.max(0, Math.min(7, action.value)) };
    case 'SET_HONBA':
      return { ...state, honba: Math.max(0, action.value) };
    case 'SET_KYOTAKU':
      return { ...state, kyotaku: Math.max(0, action.value) };
    case 'AGARI':
      return applyAgari(state, action.payload);
    case 'REACH':
      return applyReach(state, action.playerIndex);
    case 'RYUKYOKU':
      return applyRyukyoku(state, action.payload);
    case 'END_GAME':
      return { ...state, gameEnded: true };
    case 'RESET':
      return createInitialState();
    case 'UNDO':
      return action.payload;
    default:
      return state;
  }
}

const MAX_HISTORY = 50;

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, () => loadState());
  const [history, setHistory] = useState<GameState[]>([]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const pushHistory = useCallback((prev: GameState) => {
    setHistory((h) => {
      const next = [...h, prev].slice(-MAX_HISTORY);
      return next;
    });
  }, []);

  const setState = useCallback(
    (payload: GameState) => {
      dispatch({ type: 'SET_STATE', payload });
    },
    []
  );

  const setPoints = useCallback(
    (index: number, value: number) => {
      pushHistory(state);
      dispatch({ type: 'SET_POINTS', index, value });
    },
    [state, pushHistory]
  );

  const setName = useCallback((index: number, value: string) => {
    dispatch({ type: 'SET_NAME', index, value });
  }, []);

  const setRound = useCallback(
    (value: number) => {
      pushHistory(state);
      dispatch({ type: 'SET_ROUND', value });
    },
    [state, pushHistory]
  );

  const setHonba = useCallback(
    (value: number) => {
      pushHistory(state);
      dispatch({ type: 'SET_HONBA', value });
    },
    [state, pushHistory]
  );

  const setKyotaku = useCallback(
    (value: number) => {
      pushHistory(state);
      dispatch({ type: 'SET_KYOTAKU', value });
    },
    [state, pushHistory]
  );

  const doAgari = useCallback((input: AgariInput) => {
    pushHistory(state);
    dispatch({ type: 'AGARI', payload: input });
  }, [state, pushHistory]);

  const doReach = useCallback(
    (playerIndex: number) => {
      pushHistory(state);
      dispatch({ type: 'REACH', playerIndex });
    },
    [state, pushHistory]
  );

  const doRyukyoku = useCallback(
    (input: RyukyokuInput) => {
      pushHistory(state);
      dispatch({ type: 'RYUKYOKU', payload: input });
    },
    [state, pushHistory]
  );

  const endGame = useCallback(() => {
    pushHistory(state);
    dispatch({ type: 'END_GAME' });
  }, [state, pushHistory]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setHistory([]);
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    dispatch({ type: 'UNDO', payload: prev });
  }, [history]);

  /** 名前編集開始時など、現在状態をUndo用に1件保存する */
  const saveSnapshotForUndo = useCallback(() => {
    pushHistory(state);
  }, [state, pushHistory]);

  return {
    state,
    setState,
    setPoints,
    setName,
    setRound,
    setHonba,
    setKyotaku,
    doAgari,
    doReach,
    doRyukyoku,
    endGame,
    reset,
    undo,
    saveSnapshotForUndo,
    canUndo: history.length > 0,
  };
}
