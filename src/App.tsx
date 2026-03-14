import { useState } from 'react';
import { PlayerPanel } from './components/PlayerPanel';
import { CenterStatus } from './components/CenterStatus';
import { GlobalMenu } from './components/GlobalMenu';
import { AgariModal } from './components/AgariModal';
import { RyukyokuModal } from './components/RyukyokuModal';
import { EndGameModal } from './components/EndGameModal';
import { useGameState } from './useGameState';
import { useWakeLock } from './useWakeLock';

function App() {
  const {
    state,
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
    canUndo,
  } = useGameState();

  const [agariSeat, setAgariSeat] = useState<number | null>(null);
  const [showRyukyoku, setShowRyukyoku] = useState(false);
  const [showEndModal, setShowEndModal] = useState(state.gameEnded);

  useWakeLock(!state.gameEnded);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-800 text-white py-2 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">麻雀 点棒計算</h1>
          {state.gameEnded && !showEndModal && (
            <button
              type="button"
              onClick={() => setShowEndModal(true)}
              className="text-sm px-2 py-1 rounded bg-amber-500 hover:bg-amber-600"
            >
              結果
            </button>
          )}
        </div>
        <GlobalMenu
          onRyukyoku={() => setShowRyukyoku(true)}
          onUndo={undo}
          onEndGame={() => {
            endGame();
            setShowEndModal(true);
          }}
          onReset={reset}
          canUndo={canUndo}
          gameEnded={state.gameEnded}
        />
      </header>

      {/* 左上から時計回り: 東家 → 南家 → 西家 → 北家 */}
      <div className="flex-1 grid grid-cols-2 gap-2 p-2 min-h-0">
        {/* 左上: 東家 */}
        <PlayerPanel
          seatIndex={0}
          state={state}
          onPointsChange={(v) => setPoints(0, v)}
          onNameChange={(v) => setName(0, v)}
          onNameFocus={saveSnapshotForUndo}
          onReach={() => doReach(0)}
          onAgari={() => setAgariSeat(0)}
        />
        {/* 右上: 南家 */}
        <PlayerPanel
          seatIndex={1}
          state={state}
          onPointsChange={(v) => setPoints(1, v)}
          onNameChange={(v) => setName(1, v)}
          onNameFocus={saveSnapshotForUndo}
          onReach={() => doReach(1)}
          onAgari={() => setAgariSeat(1)}
        />
        {/* 左下: 北家 */}
        <PlayerPanel
          seatIndex={3}
          state={state}
          onPointsChange={(v) => setPoints(3, v)}
          onNameChange={(v) => setName(3, v)}
          onNameFocus={saveSnapshotForUndo}
          onReach={() => doReach(3)}
          onAgari={() => setAgariSeat(3)}
        />
        {/* 右下: 西家 */}
        <PlayerPanel
          seatIndex={2}
          state={state}
          onPointsChange={(v) => setPoints(2, v)}
          onNameChange={(v) => setName(2, v)}
          onNameFocus={saveSnapshotForUndo}
          onReach={() => doReach(2)}
          onAgari={() => setAgariSeat(2)}
        />
      </div>

      <div className="shrink-0 p-2 border-t border-slate-200 bg-white">
        <CenterStatus
          state={state}
          onRoundChange={setRound}
          onHonbaChange={setHonba}
          onKyotakuChange={setKyotaku}
        />
      </div>

      {agariSeat !== null && (
        <AgariModal
          state={state}
          winnerSeatIndex={agariSeat}
          onConfirm={(input) => {
            doAgari(input);
            setAgariSeat(null);
          }}
          onClose={() => setAgariSeat(null)}
        />
      )}

      {showRyukyoku && (
        <RyukyokuModal
          state={state}
          onConfirm={(input) => {
            doRyukyoku(input);
            setShowRyukyoku(false);
          }}
          onClose={() => setShowRyukyoku(false)}
        />
      )}

      {state.gameEnded && showEndModal && (
        <EndGameModal
          state={state}
          onClose={() => setShowEndModal(false)}
          onReset={() => {
            reset();
            setShowEndModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
