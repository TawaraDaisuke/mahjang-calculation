import { useState, useRef, useEffect } from 'react';
import { HandMetal, Trophy } from 'lucide-react';
import type { GameState } from '../types';
import { WIND_NAMES } from '../types';
import { getDealerIndex } from '../store';

interface PlayerPanelProps {
  seatIndex: number; // 0=東, 1=南, 2=西, 3=北
  state: GameState;
  onPointsChange: (value: number) => void;
  onNameChange: (value: string) => void;
  onNameFocus?: () => void;
  onReach: () => void;
  onAgari: () => void;
}

export function PlayerPanel({
  seatIndex,
  state,
  onPointsChange,
  onNameChange,
  onNameFocus,
  onReach,
  onAgari,
}: PlayerPanelProps) {
  const dealerIndex = getDealerIndex(state);
  const isDealer = dealerIndex === seatIndex;
  // 東南西北は席で固定（0=東, 1=南, 2=西, 3=北）。親の色だけ局ごとに変わる
  const wind = WIND_NAMES[seatIndex];
  const points = state.points[seatIndex];
  const name = state.names[seatIndex] ?? `プレイヤー${seatIndex + 1}`;
  const hasReachedThisRound = state.reachThisRound[seatIndex];

  const [editingPoints, setEditingPoints] = useState(false);
  const [pointsInput, setPointsInput] = useState(String(points));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPointsInput(String(points));
  }, [points]);

  useEffect(() => {
    if (editingPoints) inputRef.current?.select?.();
  }, [editingPoints]);

  const handlePointsBlur = () => {
    setEditingPoints(false);
    const n = parseInt(pointsInput.replace(/\D/g, ''), 10);
    if (!Number.isNaN(n)) onPointsChange(n);
    else setPointsInput(String(points));
  };

  const handlePointsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePointsBlur();
  };

  return (
    <div
      className={`
        flex flex-col rounded-xl border-2 p-3 min-h-0
        ${isDealer ? 'bg-dealer border-red-300' : 'bg-white border-slate-200'}
        shadow-sm
      `}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-semibold text-slate-600 text-sm shrink-0">{wind}</span>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onFocus={onNameFocus}
          className="flex-1 min-w-0 text-sm font-medium text-slate-800 bg-transparent border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
          placeholder={`プレイヤー${seatIndex + 1}`}
        />
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center my-2"
        onClick={() => !editingPoints && setEditingPoints(true)}
      >
        {editingPoints ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={pointsInput}
            onChange={(e) => setPointsInput(e.target.value)}
            onBlur={handlePointsBlur}
            onKeyDown={handlePointsKeyDown}
            className="w-full text-2xl md:text-3xl font-bold text-center text-slate-800 bg-slate-50 border-2 border-slate-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-slate-500"
            autoFocus
          />
        ) : (
          <span className="text-2xl md:text-4xl font-bold tabular-nums text-slate-800">
            {points.toLocaleString()}
          </span>
        )}
        <span className="text-xs text-slate-500 mt-0.5">点</span>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          type="button"
          onClick={onReach}
          disabled={hasReachedThisRound || state.gameEnded}
          className={`
            flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium
            ${hasReachedThisRound
              ? 'bg-amber-100 text-amber-800 cursor-default'
              : 'bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 disabled:pointer-events-none'
            }
          `}
        >
          <HandMetal className="w-4 h-4" />
          リーチ
        </button>
        <button
          type="button"
          onClick={onAgari}
          disabled={state.gameEnded}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:pointer-events-none"
        >
          <Trophy className="w-4 h-4" />
          あがり
        </button>
      </div>
    </div>
  );
}
