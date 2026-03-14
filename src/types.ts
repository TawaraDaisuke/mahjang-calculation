export const WIND_NAMES = ['東家', '南家', '西家', '北家'] as const;
export type Wind = (typeof WIND_NAMES)[number];

export const ROUND_LABELS = [
  '東1局', '東2局', '東3局', '東4局',
  '南1局', '南2局', '南3局', '南4局',
] as const;

export interface GameState {
  /** 各プレイヤーの持ち点 (25000起点) */
  points: number[];
  /** プレイヤー名 */
  names: string[];
  /** 現在の局 0-7 (東1～南4) */
  roundIndex: number;
  /** 本場 (連荘回数) */
  honba: number;
  /** 供託 (リーチ棒) */
  kyotaku: number;
  /** この局でリーチ宣言したプレイヤー index */
  reachThisRound: boolean[];
  /** ゲーム終了フラグ */
  gameEnded: boolean;
}

export type AgariType = 'tsumo' | 'ron';

export interface AgariInput {
  type: AgariType;
  /** あがり者 (winner) の seat index */
  winnerIndex: number;
  /** ロンの場合の放銃者 */
  ronFromIndex?: number;
  /** 打点 (符・飜はモーダルで選んだ結果の合計) */
  points: number;
}

export interface RyukyokuInput {
  /** テンパイしたプレイヤーの index 一覧 (1～4人) */
  tenpaiIndexes: number[];
}
