import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import type { AgariInput, AgariType } from '../types';
import { WIND_NAMES } from '../types';
import { getDealerIndex } from '../store';
import type { GameState } from '../types';
import {
  KO_RON_POINTS,
  OYA_RON_POINTS,
  KO_AGARI_TABLE,
  OYA_AGARI_TABLE,
} from '../agariPoints';

interface AgariModalProps {
  state: GameState;
  winnerSeatIndex: number;
  onConfirm: (input: AgariInput) => void;
  onClose: () => void;
}

export function AgariModal({
  state,
  winnerSeatIndex,
  onConfirm,
  onClose,
}: AgariModalProps) {
  const dealerIndex = getDealerIndex(state);
  const isDealerWin = winnerSeatIndex === dealerIndex;

  const ronPointsList = useMemo(
    () => (isDealerWin ? OYA_RON_POINTS : KO_RON_POINTS),
    [isDealerWin]
  );
  const [type, setType] = useState<AgariType>('ron');
  const [ronFromIndex, setRonFromIndex] = useState<number>(
    winnerSeatIndex === 0 ? 1 : 0
  );
  const [selectedRonPoints, setSelectedRonPoints] = useState(
    () => ronPointsList[0]
  );

  const table = isDealerWin ? OYA_AGARI_TABLE : KO_AGARI_TABLE;

  /** 選択肢の表示ラベル: 点数表記 + 主な役・符翻 */
  const getOptionLabel = (row: (typeof table)[number], agariType: AgariType) => {
    const yaku = row.yakuLabel ? `（${row.yakuLabel}）` : '';
    if (agariType === 'tsumo') {
      const pointStr = isDealerWin ? row.tsumoLabel : `${(row as { koPay: number; oyaPay: number }).koPay}-${(row as { koPay: number; oyaPay: number }).oyaPay}`;
      return `${pointStr}${yaku}`;
    }
    return `${row.ron.toLocaleString()}点${yaku}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      type,
      winnerIndex: winnerSeatIndex,
      ronFromIndex: type === 'ron' ? ronFromIndex : undefined,
      points: selectedRonPoints,
    });
    onClose();
  };

  const others = [0, 1, 2, 3].filter((i) => i !== winnerSeatIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">あがり</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">タイプ</label>
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                <input
                  type="radio"
                  name="agariType"
                  value="ron"
                  checked={type === 'ron'}
                  onChange={() => setType('ron')}
                  className="sr-only"
                />
                <span>ロン</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                <input
                  type="radio"
                  name="agariType"
                  value="tsumo"
                  checked={type === 'tsumo'}
                  onChange={() => setType('tsumo')}
                  className="sr-only"
                />
                <span>ツモ</span>
              </label>
            </div>
          </div>

          {type === 'ron' && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">放銃者</label>
              <select
                value={ronFromIndex}
                onChange={(e) => setRonFromIndex(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
              >
                {others.map((i) => (
                  <option key={i} value={i}>
                    {state.names[i] ?? `プレイヤー${i + 1}`}（{WIND_NAMES[i]}）
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {type === 'tsumo' ? 'あがり点（ツモ・実際の点数移動）' : 'あがり点（ロン・和了点）'}
            </label>
            <select
              value={selectedRonPoints}
              onChange={(e) => setSelectedRonPoints(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
            >
              {table.map((row) => (
                <option key={row.ron} value={row.ron}>
                  {getOptionLabel(row, type)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
            >
              確定
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
