export function getFirst<T>(items: readonly T[]): T | undefined {
  return items[0];
}

export function getProperty<T extends object, K extends keyof T>(object: T, key: K): T[K] {
    return object[key];
}


export function sortByProperty<T, K extends keyof T>(
  items: readonly T[],
  key: K
): T[] {
  return [...items].sort((a, b) => {
    const left = a[key];
    const right = b[key];

    if (
      typeof left === 'number' &&
      typeof right === 'number'
    ) {
      return left - right;
    }

    return String(left).localeCompare(String(right));
  });
}


