import { sortByProperty } from './utils';
import type { ApiUser } from './types';

const users: ApiUser[] = [
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

const usersByName = sortByProperty(users, 'name');
const usersById = sortByProperty(users, 'id');

console.log(usersByName.map(user => user.name));
console.log(usersById.map(user => user.id));
console.log(users[0].name);