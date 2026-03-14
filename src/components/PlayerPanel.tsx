import { useState, useRef, useEffect } from 'react';
import { HandMetal, Trophy } from 'lucide-react';
import type { GameState } from '../types';
import { WIND_NAMES } from '../types';
import { getDealerIndex } from '../store';

interface PlayerPanelProps {
  seatIndex: number; // 0=東, 1=南, 2=西, 3=北
  state: GameState;
  /** 点数差表示の基準席（null=通常表示） */
  diffViewFromSeat: number | null;
  onToggleDiffView: (fromSeat: number | null) => void;
  onPointsChange: (value: number) => void;
  onNameChange: (value: string) => void;
  onNameFocus?: () => void;
  onReach: () => void;
  onAgari: () => void;
}

export function PlayerPanel({
  seatIndex,
  state,
  diffViewFromSeat,
  onToggleDiffView,
  onPointsChange,
  onNameChange,
  onNameFocus,
  onReach,
  onAgari,
}: PlayerPanelProps) {
  const dealerIndex = getDealerIndex(state);
  const isDealer = dealerIndex === seatIndex;
  const wind = WIND_NAMES[seatIndex];
  const points = state.points[seatIndex];
  const name = state.names[seatIndex] ?? `プレイヤー${seatIndex + 1}`;
  const hasReachedThisRound = state.reachThisRound[seatIndex];
  const isDiffView = diffViewFromSeat !== null;
  const diff =
    isDiffView && diffViewFromSeat !== null
      ? points - state.points[diffViewFromSeat]
      : 0;

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
        className="flex-1 flex flex-col items-center justify-center mt-8 mb-2"
        onClick={() => !isDiffView && !editingPoints && setEditingPoints(true)}
      >
        {isDiffView ? (
          <>
            <span
              className={`text-5xl md:text-7xl font-bold tabular-nums ${diff >= 0 ? 'text-slate-800' : 'text-red-600'}`}
            >
              {diff >= 0 ? '+' : ''}
              {diff.toLocaleString()}
            </span>
            <span className="text-base text-slate-500 mt-1">点</span>
          </>
        ) : editingPoints ? (
          <>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={pointsInput}
              onChange={(e) => setPointsInput(e.target.value)}
              onBlur={handlePointsBlur}
              onKeyDown={handlePointsKeyDown}
              className="w-full text-4xl md:text-5xl font-bold text-center text-slate-800 bg-slate-50 border-2 border-slate-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              autoFocus
            />
            <span className="text-base text-slate-500 mt-1">点</span>
          </>
        ) : (
          <>
            <span className="text-5xl md:text-7xl font-bold tabular-nums text-slate-800">
              {points.toLocaleString()}
            </span>
            <span className="text-base text-slate-500 mt-1">点</span>
          </>
        )}
      </div>

      <div className="flex gap-2 mt-auto items-end">
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
        <div className="flex-1 flex flex-col items-stretch gap-0.5">
          <button
            type="button"
            onClick={() =>
              onToggleDiffView(isDiffView ? null : seatIndex)
            }
            className="self-end w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 shrink-0"
          >
            {isDiffView ? '点数' : '点数差'}
          </button>
          <button
            type="button"
            onClick={onAgari}
            disabled={state.gameEnded}
            className="flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:pointer-events-none"
          >
            <Trophy className="w-4 h-4" />
            あがり
          </button>
        </div>
      </div>
    </div>
  );
}
