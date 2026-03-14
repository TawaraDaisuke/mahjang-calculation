import { useState } from 'react';
import type { GameState } from '../types';
import { ROUND_LABELS } from '../types';

interface CenterStatusProps {
  state: GameState;
  onRoundChange: (value: number) => void;
  onHonbaChange: (value: number) => void;
  onKyotakuChange: (value: number) => void;
}

export function CenterStatus({
  state,
  onRoundChange,
  onHonbaChange,
  onKyotakuChange,
}: CenterStatusProps) {
  const [editRound, setEditRound] = useState(false);
  const [editHonba, setEditHonba] = useState(false);
  const [editKyotaku, setEditKyotaku] = useState(false);

  const roundNum = Math.min(state.roundIndex, 7);
  const roundLabel = ROUND_LABELS[roundNum] ?? '東1局';
  const honba = state.honba;
  const kyotaku = state.kyotaku;

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 py-2 px-3 bg-slate-100 rounded-lg border border-slate-200">
      <div className="flex items-center gap-1">
        <span className="text-slate-500 text-sm">現在の局</span>
        {editRound ? (
          <input
            type="number"
            min={0}
            max={8}
            defaultValue={state.roundIndex}
            onBlur={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!Number.isNaN(v)) onRoundChange(v);
              setEditRound(false);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="w-12 text-center font-semibold border rounded px-1 py-0.5"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditRound(true)}
            className="font-semibold text-slate-800 underline decoration-dotted"
          >
            {roundLabel}
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-slate-500 text-sm">本場</span>
        {editHonba ? (
          <input
            type="number"
            min={0}
            defaultValue={honba}
            onBlur={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!Number.isNaN(v) && (v >= 0)) onHonbaChange(v);
              setEditHonba(false);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="w-12 text-center font-semibold border rounded px-1 py-0.5"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditHonba(true)}
            className="font-semibold text-slate-800 underline decoration-dotted"
          >
            {honba}
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-slate-500 text-sm">供託</span>
        {editKyotaku ? (
          <input
            type="number"
            min={0}
            defaultValue={kyotaku}
            onBlur={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!Number.isNaN(v) && (v >= 0)) onKyotakuChange(v);
              setEditKyotaku(false);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="w-12 text-center font-semibold border rounded px-1 py-0.5"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditKyotaku(true)}
            className="font-semibold text-slate-800 underline decoration-dotted"
          >
            {kyotaku}
          </button>
        )}
      </div>
    </div>
  );
}
