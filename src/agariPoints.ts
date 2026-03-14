/**
 * あがり点数テーブル（ロン和了点をキーに選択）
 * 本場: 各支払者 +100/人、和了者 +300
 * 供託: すべて和了者が回収
 */

/** 子のあがり: ロン和了点 → ツモ時の子の支払・親の支払 */
export const KO_AGARI_TABLE: ReadonlyArray<{
  ron: number;
  tsumoLabel: string;
  koPay: number;
  oyaPay: number;
  yakuLabel: string; // 主な役・符翻
}> = [
  { ron: 1000, tsumoLabel: '300 / 500', koPay: 300, oyaPay: 500, yakuLabel: '1翻30符' },
  { ron: 1300, tsumoLabel: '400 / 700', koPay: 400, oyaPay: 700, yakuLabel: '1翻40符' },
  { ron: 1500, tsumoLabel: '400 / 800', koPay: 400, oyaPay: 800, yakuLabel: '1翻50符' },
  { ron: 1600, tsumoLabel: '400 / 800', koPay: 400, oyaPay: 800, yakuLabel: '2翻25符/2翻30符' },
  { ron: 2000, tsumoLabel: '500 / 1000', koPay: 500, oyaPay: 1000, yakuLabel: '2翻30符/1翻70符' },
  { ron: 2600, tsumoLabel: '700 / 1300', koPay: 700, oyaPay: 1300, yakuLabel: '2翻40符/1翻90符' },
  { ron: 2900, tsumoLabel: '800 / 1500', koPay: 800, oyaPay: 1500, yakuLabel: '2翻50符' },
  { ron: 3200, tsumoLabel: '800 / 1600', koPay: 800, oyaPay: 1600, yakuLabel: '2翻25符/3翻30符' },
  { ron: 3900, tsumoLabel: '1000 / 2000', koPay: 1000, oyaPay: 2000, yakuLabel: '3翻30符/2翻60符' },
  { ron: 4500, tsumoLabel: '1200 / 2300', koPay: 1200, oyaPay: 2300, yakuLabel: '2翻80符' },
  { ron: 4800, tsumoLabel: '1200 / 2400', koPay: 1200, oyaPay: 2400, yakuLabel: '3翻25符' },
  { ron: 5200, tsumoLabel: '1300 / 2600', koPay: 1300, oyaPay: 2600, yakuLabel: '3翻40符/2翻80符' },
  { ron: 6400, tsumoLabel: '1600 / 3200', koPay: 1600, oyaPay: 3200, yakuLabel: '4翻25符/3翻50符' },
  { ron: 7700, tsumoLabel: '2000 / 3900', koPay: 2000, oyaPay: 3900, yakuLabel: '3翻60符' },
  { ron: 8000, tsumoLabel: '2000 / 4000', koPay: 2000, oyaPay: 4000, yakuLabel: '満貫(4翻30符以上)' },
  { ron: 12000, tsumoLabel: '3000 / 6000', koPay: 3000, oyaPay: 6000, yakuLabel: '跳満(6-7翻)' },
  { ron: 16000, tsumoLabel: '4000 / 8000', koPay: 4000, oyaPay: 8000, yakuLabel: '倍満(8-10翻)' },
  { ron: 24000, tsumoLabel: '6000 / 12000', koPay: 6000, oyaPay: 12000, yakuLabel: '三倍満(11-12翻)' },
  { ron: 32000, tsumoLabel: '8000 / 16000', koPay: 8000, oyaPay: 16000, yakuLabel: '役満' },
  { ron: 64000, tsumoLabel: '16000 / 32000', koPay: 16000, oyaPay: 32000, yakuLabel: '二倍役満' },
];

/** 親のあがり: ロン和了点 → ツモ時の子の一人当たり支払 */
export const OYA_AGARI_TABLE: ReadonlyArray<{
  ron: number;
  tsumoLabel: string;
  koPayEach: number;
  yakuLabel: string; // 主な役・符翻
}> = [
  { ron: 1500, tsumoLabel: '500 ALL', koPayEach: 500, yakuLabel: '1翻30符' },
  { ron: 2000, tsumoLabel: '700 ALL', koPayEach: 700, yakuLabel: '1翻40符' },
  { ron: 2400, tsumoLabel: '800 ALL', koPayEach: 800, yakuLabel: '2翻25符/2翻30符' },
  { ron: 2900, tsumoLabel: '1000 ALL', koPayEach: 1000, yakuLabel: '2翻30符' },
  { ron: 3900, tsumoLabel: '1300 ALL', koPayEach: 1300, yakuLabel: '2翻40符' },
  { ron: 4400, tsumoLabel: '1500 ALL', koPayEach: 1500, yakuLabel: '2翻45符' },
  { ron: 4500, tsumoLabel: '1500 ALL', koPayEach: 1500, yakuLabel: '1翻100符' },
  { ron: 4800, tsumoLabel: '1600 ALL', koPayEach: 1600, yakuLabel: '3翻25符/3翻30符' },
  { ron: 5800, tsumoLabel: '2000 ALL', koPayEach: 2000, yakuLabel: '3翻30符/2翻60符' },
  { ron: 7700, tsumoLabel: '2600 ALL', koPayEach: 2600, yakuLabel: '3翻40符' },
  { ron: 9600, tsumoLabel: '3200 ALL', koPayEach: 3200, yakuLabel: '4翻25符/3翻50符' },
  { ron: 11600, tsumoLabel: '3900 ALL', koPayEach: 3900, yakuLabel: '3翻60符' },
  { ron: 12000, tsumoLabel: '4000 ALL', koPayEach: 4000, yakuLabel: '満貫' },
  { ron: 18000, tsumoLabel: '6000 ALL', koPayEach: 6000, yakuLabel: '跳満' },
  { ron: 24000, tsumoLabel: '8000 ALL', koPayEach: 8000, yakuLabel: '倍満' },
  { ron: 36000, tsumoLabel: '12000 ALL', koPayEach: 12000, yakuLabel: '三倍満' },
  { ron: 48000, tsumoLabel: '16000 ALL', koPayEach: 16000, yakuLabel: '役満' },
  { ron: 96000, tsumoLabel: '32000 ALL', koPayEach: 32000, yakuLabel: '二倍役満' },
];

/** 子のあがりでロン和了点のリスト（選択用） */
export const KO_RON_POINTS = KO_AGARI_TABLE.map((r) => r.ron);

/** 親のあがりでロン和了点のリスト（選択用） */
export const OYA_RON_POINTS = OYA_AGARI_TABLE.map((r) => r.ron);

export function getKoAgariRow(ronPoints: number) {
  return KO_AGARI_TABLE.find((r) => r.ron === ronPoints);
}

export function getOyaAgariRow(ronPoints: number) {
  return OYA_AGARI_TABLE.find((r) => r.ron === ronPoints);
}
