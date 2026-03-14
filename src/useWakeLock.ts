import { useEffect, useRef } from 'react';

interface WakeLockSentinel {
  release(): Promise<void>;
}

export function useWakeLock(enabled: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const nav = navigator as Navigator & { wakeLock?: { request(type: string): Promise<WakeLockSentinel> } };
    if (!nav.wakeLock) return;

    const requestLock = async () => {
      try {
        lockRef.current = await nav.wakeLock!.request('screen');
      } catch (_) {}
    };

    requestLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !lockRef.current) {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      lockRef.current?.release().catch(() => {});
      lockRef.current = null;
    };
  }, [enabled]);
}
