import { RotateCcw, Undo2, Flag, Trash2 } from 'lucide-react';

interface GlobalMenuProps {
  onRyukyoku: () => void;
  onUndo: () => void;
  onEndGame: () => void;
  onReset: () => void;
  canUndo: boolean;
  gameEnded: boolean;
}

export function GlobalMenu({
  onRyukyoku,
  onUndo,
  onEndGame,
  onReset,
  canUndo,
  gameEnded,
}: GlobalMenuProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={onRyukyoku}
        disabled={gameEnded}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        <RotateCcw className="w-4 h-4" />
        流局
      </button>
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo || gameEnded}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
      >
        <Undo2 className="w-4 h-4" />
        戻る
      </button>
      <button
        type="button"
        onClick={onEndGame}
        disabled={gameEnded}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:pointer-events-none"
      >
        <Flag className="w-4 h-4" />
        終了
      </button>
      <button
        type="button"
        onClick={() => window.confirm('全データを初期状態に戻します。よろしいですか？') && onReset()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-200 text-red-700 text-sm font-medium hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
        リセット
      </button>
    </div>
  );
}
