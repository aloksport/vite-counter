
 // @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

beforeEach(() => {
  vi.resetModules();
  document.body.innerHTML = '<div id="app"></div>';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('User Directory application', () => {
  it('loads users and filters them through the search field', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Alice Smith',
        email: 'alice@example.com'
      },
      {
        id: 2,
        name: 'Bob Jones',
        email: 'bob@example.com'
      }
    ];

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockUsers), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );

    vi.stubGlobal('fetch', mockFetch);

    // Import after preparing the DOM and mocked fetch.
    await import('./main');

    const loadButton =
      document.querySelector<HTMLButtonElement>('#load-users');

    const searchInput =
      document.querySelector<HTMLInputElement>('#user-search');

    expect(loadButton).not.toBeNull();
    expect(searchInput).not.toBeNull();

    loadButton!.click();

    expect(
      document.querySelector('#message')?.textContent
    ).toBe('Loading users...');

    await vi.waitFor(() => {
      expect(
        document.querySelector('#message')?.textContent
      ).toContain('Showing 2 of 2 users.');
    });

    expect(
      document.querySelectorAll('.user-card')
    ).toHaveLength(2);

    // Search for Alice.
    searchInput!.value = 'alice';
    searchInput!.dispatchEvent(new Event('input'));

    expect(
      document.querySelectorAll('.user-card')
    ).toHaveLength(1);

    expect(
      document.querySelector('#user-list')?.textContent
    ).toContain('Alice Smith');

    expect(
      document.querySelector('#user-list')?.textContent
    ).not.toContain('Bob Jones');

    // Search for a user who does not exist.
    searchInput!.value = 'nobody';
    searchInput!.dispatchEvent(new Event('input'));

    expect(
      document.querySelectorAll('.user-card')
    ).toHaveLength(0);

    expect(
      document.querySelector('#message')?.textContent
    ).toBe('No users match your search.');

    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('displays an error when the network request fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(
      new Error('Network unavailable')
    );

    vi.stubGlobal('fetch', mockFetch);

    await import('./main');

    const loadButton =
      document.querySelector<HTMLButtonElement>('#load-users');

    expect(loadButton).not.toBeNull();

    loadButton!.click();

    await vi.waitFor(() => {
      expect(
        document.querySelector('#message')?.textContent
      ).toBe('Failed to load users: Network unavailable');
    });

    expect(
      document.querySelectorAll('.user-card')
    ).toHaveLength(0);
  });
});
