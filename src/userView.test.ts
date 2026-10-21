
 // @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';

import type { ApiUser } from './types';
import { filterUsers, renderUsers } from './userView';

const users: ApiUser[] = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com'
  },
  {
    id: 2,
    name: 'Bob Jones',
    email: 'bob@example.com'
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com'
  }
];

describe('filterUsers', () => {
  it('matches a user by name', () => {
    const result = filterUsers(users, 'alice');

    expect(result.map(user => user.name)).toEqual([
      'Alice Smith'
    ]);
  });

  it('matches a user by email', () => {
    const result = filterUsers(users, 'BOB@EXAMPLE.COM');

    expect(result.map(user => user.name)).toEqual([
      'Bob Jones'
    ]);
  });

  it('returns all users for an empty query', () => {
    expect(filterUsers(users, '')).toHaveLength(3);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterUsers(users, 'nobody')).toEqual([]);
  });
});

describe('renderUsers', () => {
  let userList: HTMLElement;

  beforeEach(() => {
    userList = document.createElement('section');
  });

  it('renders each user and their details', () => {
    renderUsers(users, userList);

    expect(userList.querySelectorAll('.user-card'))
      .toHaveLength(3);

    expect(userList.textContent).toContain('Alice Smith');
    expect(userList.textContent).toContain('alice@example.com');
    expect(userList.textContent).toContain('User ID: 1');
  });

  it('clears previous results before rendering', () => {
    renderUsers(users, userList);

    renderUsers([users[1]], userList);

    expect(userList.querySelectorAll('.user-card'))
      .toHaveLength(1);

    expect(userList.textContent).toContain('Bob Jones');
    expect(userList.textContent).not.toContain('Alice Smith');
  });

  it('renders user text as text rather than HTML', () => {
    const unusualUser: ApiUser = {
      id: 4,
      name: '<img src=x onerror=alert(1)>',
      email: 'safe@example.com'
    };

    renderUsers([unusualUser], userList);

    expect(userList.querySelector('img')).toBeNull();
    expect(userList.textContent)
      .toContain('<img src=x onerror=alert(1)>');
  });
});
