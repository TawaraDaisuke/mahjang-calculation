import { X, Award } from 'lucide-react';
import type { GameState } from '../types';

interface EndGameModalProps {
  state: GameState;
  onClose: () => void;
  onReset: () => void;
}

export function EndGameModal({ state, onClose, onReset }: EndGameModalProps) {
  const order = state.points
    .map((p, i) => ({ index: i, points: p, name: state.names[i] ?? `プレイヤー${i + 1}` }))
    .sort((a, b) => b.points - a.points);

  const rankLabel = (i: number) => {
    switch (i) {
      case 0:
        return '1位';
      case 1:
        return '2位';
      case 2:
        return '3位';
      case 3:
        return '4位';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            最終結果
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="space-y-3 mb-6">
          {order.map((p, i) => (
            <li
              key={p.index}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-100"
            >
              <span className="font-medium text-slate-700">
                {rankLabel(i)} {p.name}
              </span>
              <span className="font-bold tabular-nums text-slate-800">
                {p.points.toLocaleString()}点
              </span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            閉じる
          </button>
          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800"
          >
            新規対局
          </button>
        </div>
      </div>
    </div>
  );
}
