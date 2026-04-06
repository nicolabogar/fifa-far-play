/**
 * Embaralha um array usando Fisher-Yates shuffle
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Sorteia dois times balanceados por força
 */
export function sortearBalanceado<T extends { forca?: number }>(
  items: T[],
  getForca: (item: T) => number = (item: T) => item.forca || 50
): [T[], T[]] {
  if (items.length < 2) {
    throw new Error('Mínimo 2 itens para sortear');
  }

  const shuffled = shuffle([...items]);
  const itemsWithForce = shuffled.map((item) => ({
    item,
    forca: getForca(item),
  }));

  itemsWithForce.sort((a, b) => b.forca - a.forca);

  const time1: T[] = [];
  const time2: T[] = [];
  let soma1 = 0;
  let soma2 = 0;

  for (const { item, forca } of itemsWithForce) {
    if (soma1 <= soma2) {
      time1.push(item);
      soma1 += forca;
    } else {
      time2.push(item);
      soma2 += forca;
    }
  }

  return [time1, time2];
}

/**
 * Calcula força média de um array de itens
 */
export function calcularForcaMedia<T extends { forca?: number }>(
  items: T[],
  getForca: (item: T) => number = (item: T) => item.forca || 50
): number {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + getForca(item), 0);
  return Math.round(total / items.length);
}

/**
 * Shuffles items into N groups
 */
export function distribuirEmGrupos<T>(items: T[], numGrupos: number): T[][] {
  const shuffled = shuffle([...items]);
  const grupos: T[][] = Array.from({ length: numGrupos }, () => []);

  shuffled.forEach((item, idx) => {
    grupos[idx % numGrupos].push(item);
  });

  return grupos;
}
