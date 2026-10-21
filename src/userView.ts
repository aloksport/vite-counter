import type { ApiUser } from './types';

export function filterUsers(
  users: ApiUser[],
  query: string
): ApiUser[] {
  const normalizedQuery = query.trim().toLowerCase();

  return users.filter((user) => {
    return (
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function renderUsers(
  users: ApiUser[],
  userList: HTMLElement
): void {
  userList.replaceChildren();

  for (const user of users) {
    const card = document.createElement('article');
    card.className = 'user-card';

    const name = document.createElement('h2');
    name.textContent = user.name;

    const email = document.createElement('p');
    email.textContent = user.email;

    const id = document.createElement('p');
    id.className = 'user-id';
    id.textContent = `User ID: ${user.id}`;

    card.append(name, email, id);
    userList.append(card);
  }
}
