
import './style.css';
import type {  UserDirectoryState } from './types';
import { fetchUsers } from './api';
import { filterUsers, renderUsers } from './userView';
import { sortByProperty , getFirst } from './utils';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App container was not found.');
}

function getRequiredElement<T extends HTMLElement>(
  selector: string
): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }

  return element;
}

app.innerHTML = `
  <main class="container">
    <h1>TypeScript User Directory</h1>
    <p class="description">
      Load users from an API, then search by name or email.
    </p>

    <button id="load-users">Load Users</button>

    <label for="user-search">Search users</label>
    <input
      id="user-search"
      type="search"
      placeholder="Enter a name or email..."
      disabled
    />

    <p id="message" role="status">Ready to load users.</p>
    <section id="user-list" class="user-list"></section>
  </main>
`;

const loadButton =
  getRequiredElement<HTMLButtonElement>('#load-users');

const searchInput =
  getRequiredElement<HTMLInputElement>('#user-search');

const message =
  getRequiredElement<HTMLParagraphElement>('#message');

const userList =
  getRequiredElement<HTMLElement>('#user-list');

let state: UserDirectoryState = { status: 'idle' };

function showState(): void {
  switch (state.status) {
    case 'idle':
      message.textContent = 'Ready to load users.';
      userList.replaceChildren();
      searchInput.disabled = true;
      break;

    case 'loading':
      message.textContent = 'Loading users...';
      userList.replaceChildren();
      searchInput.disabled = true;
      break;

    case 'success': {
      searchInput.disabled = false;

      const filteredUsers = filterUsers(
        state.users,
        searchInput.value
      );

      const sortedUsers = sortByProperty(
        filteredUsers,
        'name'
      );

      renderUsers(sortedUsers, userList);

      const firstUser = getFirst(filteredUsers);

      if (state.users.length === 0) {
        message.textContent = 'No valid users were found.';
      } else if (!firstUser) {
        message.textContent = 'No users match your search.';
      } else {
        message.textContent =
          `Showing ${filteredUsers.length} of ${state.users.length} users. ` +
          `First result: ${firstUser.name}.`;
      }

      break;
    }

    case 'error':
      message.textContent = `Failed to load users: ${state.message}`;
      userList.replaceChildren();
      searchInput.disabled = true;
      break;
  }
}


async function loadUsers(): Promise<void> {
  loadButton.disabled = true;
  state = { status: 'loading' };
  showState();

  try {
    const result = await fetchUsers();

    if (result.success) {
      state = {
        status: 'success',
        users: result.data
      };
    } else {
      state = {
        status: 'error',
        message: result.error
      };
    }
  } catch (error: unknown) {
    state = {
      status: 'error',
      message: error instanceof Error
        ? error.message
        : 'An unexpected error occurred.'
    };
  } finally {
    loadButton.disabled = false;
  }

  showState();
}


loadButton.addEventListener('click', () => {
  void loadUsers();
});

searchInput.addEventListener('input', () => {
  showState();
});
