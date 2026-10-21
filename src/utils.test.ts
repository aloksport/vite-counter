
import { describe, expect, it } from 'vitest';

import {
  getFirst,
  getProperty,
  sortByProperty
} from './utils';

describe('getFirst', () => {
  it('returns the first item', () => {
    expect(getFirst([10, 20, 30])).toBe(10);
  });

  it('returns undefined for an empty array', () => {
    expect(getFirst([])).toBeUndefined();
  });
});

describe('getProperty', () => {
  it('returns the requested property', () => {
    const product = {
      name: 'Keyboard',
      price: 2500,
      inStock: true
    };

    expect(getProperty(product, 'price')).toBe(2500);
  });
});

describe('sortByProperty', () => {
  const users = [
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];

  it('sorts names alphabetically', () => {
    const result = sortByProperty(users, 'name');

    expect(result.map(user => user.name)).toEqual([
      'Alice',
      'Bob',
      'Charlie'
    ]);
  });

  it('sorts numeric properties in ascending order', () => {
    const result = sortByProperty(users, 'id');

    expect(result.map(user => user.id)).toEqual([1, 2, 3]);
  });

  it('does not change the original array', () => {
    const originalOrder = [...users];

    sortByProperty(users, 'name');

    expect(users).toEqual(originalOrder);
  });
});
