import type { GameState } from './types';
import {
  INITIAL_POINTS,
  DEFAULT_NAMES,
  STORAGE_KEY,
  REACH_COST,
  KYOTAKU_POINTS,
  HONBA_PER_PAYER,
  HONBA_TO_WINNER,
  NOTEN_PENALTY_TOTAL,
} from './constants';
import type { AgariInput, RyukyokuInput } from './types';
import { getKoAgariRow, getOyaAgariRow } from './agariPoints';

export function createInitialState(): GameState {
  return {
    points: [INITIAL_POINTS, INITIAL_POINTS, INITIAL_POINTS, INITIAL_POINTS],
    names: [...DEFAULT_NAMES],
    roundIndex: 0,
    honba: 0,
    kyotaku: 0,
    reachThisRound: [false, false, false, false],
    gameEnded: false,
  };
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed.points?.length || parsed.points.length !== 4) return createInitialState();
    return {
      ...createInitialState(),
      ...parsed,
      points: [...parsed.points],
      names: Array.isArray(parsed.names) && parsed.names.length === 4 ? [...parsed.names] : [...DEFAULT_NAMES],
      reachThisRound: Array.isArray(parsed.reachThisRound) && parsed.reachThisRound.length === 4
        ? [...parsed.reachThisRound]
        : [false, false, false, false],
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_err) {
    void _err;
  }
}

/** 親の seat index (0=東, 1=南, 2=西, 3=北) */
export function getDealerIndex(state: GameState): number {
  return state.roundIndex % 4;
}

/**
 * あがり処理: 点数テーブルに基づく配分
 * ツモ: 上がった人以外はそれぞれ「あがり点 + 本場数×100」を和了者に払う。
 * ロン: 放銃者が「あがり点 + 本場数×300」を和了者に払う（他2人は本場分の支払いなし）。
 * 供託: すべて和了者が回収。
 */
export function applyAgari(state: GameState, input: AgariInput): GameState {
  const { type, winnerIndex, ronFromIndex, points: ronPoints } = input;
  const dealerIndex = getDealerIndex(state);
  const isDealerWin = winnerIndex === dealerIndex;
  const honba = state.honba;
  const kyotakuTotal = state.kyotaku * KYOTAKU_POINTS;
  const honbaPerPayer = honba * HONBA_PER_PAYER; // ツモ時: 各支払者が +100/本場
  const honbaRonPayer = honba * HONBA_TO_WINNER; // ロン時: 放銃者が +300/本場
  const nextPoints = [...state.points];

  if (type === 'tsumo') {
    // ツモ: 各支払者は あがり点 + 本場×100 ずつ和了者に払う（合計で本場×300が和了者へ）
    if (isDealerWin) {
      const row = getOyaAgariRow(ronPoints);
      if (!row) return state;
      const payEach = row.koPayEach + honbaPerPayer;
      nextPoints[winnerIndex] += payEach * 3 + kyotakuTotal;
      for (let i = 0; i < 4; i++) {
        if (i !== winnerIndex) nextPoints[i] -= payEach;
      }
    } else {
      const row = getKoAgariRow(ronPoints);
      if (!row) return state;
      const koPay = row.koPay + honbaPerPayer;
      const oyaPay = row.oyaPay + honbaPerPayer;
      const totalToWinner = (row.koPay * 2 + row.oyaPay) + honbaPerPayer * 3 + kyotakuTotal;
      nextPoints[winnerIndex] += totalToWinner;
      nextPoints[dealerIndex] -= oyaPay;
      for (let i = 0; i < 4; i++) {
        if (i !== winnerIndex && i !== dealerIndex) nextPoints[i] -= koPay;
      }
    }
  } else {
    // ロン: 放銃者のみ あがり点 + 本場×300 + 供託 を和了者に払う
    const fromIndex = ronFromIndex ?? 0;
    const ronPayerPay = ronPoints + honbaRonPayer + kyotakuTotal;
    nextPoints[winnerIndex] += ronPayerPay;
    nextPoints[fromIndex] -= ronPayerPay;
  }

  const nextHonba = isDealerWin ? state.honba + 1 : 0;

  return {
    ...state,
    points: nextPoints,
    roundIndex: isDealerWin ? state.roundIndex : state.roundIndex + 1,
    honba: nextHonba,
    kyotaku: 0,
    reachThisRound: [false, false, false, false],
  };
}

/** リーチ: 1000点減・供託+1・その局でリーチボタン無効 */
export function applyReach(state: GameState, playerIndex: number): GameState {
  const nextPoints = [...state.points];
  nextPoints[playerIndex] -= REACH_COST;
  const nextReach = [...state.reachThisRound];
  nextReach[playerIndex] = true;
  return {
    ...state,
    points: nextPoints,
    kyotaku: state.kyotaku + 1,
    reachThisRound: nextReach,
  };
}

/** 流局: テンパイ者にノーテンから分配。親テンパイなら連荘、親ノーテンなら親流れ */
export function applyRyukyoku(state: GameState, input: RyukyokuInput): GameState {
  const { tenpaiIndexes } = input;
  const dealerIndex = getDealerIndex(state);
  const nextPoints = [...state.points];
  const tenpaiCount = tenpaiIndexes.length;
  const notenCount = 4 - tenpaiCount;
  if (tenpaiCount === 0 || tenpaiCount === 4) {
    // 全員テンパイ or 全員ノーテン: 点移動なし、親流れ
    return {
      ...state,
      roundIndex: state.roundIndex + 1,
      honba: 0,
      reachThisRound: [false, false, false, false],
    };
  }
  // ノーテン罰符 計3000点をテンパイ者で山分け。ノーテン者がその分を支払う。
  const payPerNoten = Math.floor(NOTEN_PENALTY_TOTAL / notenCount);
  const receivePerTenpai = Math.floor(NOTEN_PENALTY_TOTAL / tenpaiCount);
  const tenpaiSet = new Set(tenpaiIndexes);
  for (let i = 0; i < 4; i++) {
    if (tenpaiSet.has(i)) {
      nextPoints[i] += receivePerTenpai;
    } else {
      nextPoints[i] -= payPerNoten;
    }
  }
  const dealerTenpai = tenpaiSet.has(dealerIndex);
  return {
    ...state,
    points: nextPoints,
    roundIndex: dealerTenpai ? state.roundIndex : state.roundIndex + 1,
    honba: dealerTenpai ? state.honba + 1 : 0,
    kyotaku: state.kyotaku, // 流局では供託はそのまま（次にあがりが出たときに回収）
    reachThisRound: [false, false, false, false],
  };
}
