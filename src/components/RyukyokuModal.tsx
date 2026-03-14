import { useState } from 'react';
import { X } from 'lucide-react';
import type { RyukyokuInput } from '../types';
import { WIND_NAMES } from '../types';
import type { GameState } from '../types';

interface RyukyokuModalProps {
  state: GameState;
  onConfirm: (input: RyukyokuInput) => void;
  onClose: () => void;
}

export function RyukyokuModal({ state, onConfirm, onClose }: RyukyokuModalProps) {
  const [tenpaiIndexes, setTenpaiIndexes] = useState<number[]>([]);

  const toggle = (idx: number) => {
    setTenpaiIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ tenpaiIndexes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">流局</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-3">テンパイしたプレイヤーを選択してください</p>

        <form onSubmit={handleSubmit} className="space-y-2">
          {[0, 1, 2, 3].map((idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50"
            >
              <input
                type="checkbox"
                checked={tenpaiIndexes.includes(idx)}
                onChange={() => toggle(idx)}
                className="w-4 h-4 rounded border-slate-300 text-amber-600"
              />
              <span className="font-medium text-slate-800">
                {state.names[idx] ?? `プレイヤー${idx + 1}`}
              </span>
              <span className="text-slate-500 text-sm">
                （{WIND_NAMES[idx]}）
              </span>
            </label>
          ))}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600"
            >
              確定
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
