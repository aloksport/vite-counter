import {
  afterEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { fetchUsers } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchUsers', () => {
  it('returns users when the request succeeds', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com'
      },
      {
        id: 2,
        name: 'Bob',
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

    const result = await fetchUsers();

    expect(result).toEqual({
      success: true,
      data: mockUsers
    });

    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('returns an error for an HTTP failure', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response('Server error', {
        status: 500
      })
    );

    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchUsers();

    expect(result).toEqual({
      success: false,
      error: 'HTTP error: 500'
    });
  });

  it('returns an error when the response is not an array', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ message: 'Unexpected response' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    );

    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchUsers();

    expect(result).toEqual({
      success: false,
      error: 'The API did not return an array.'
    });
  });

  it('returns an error when the network request fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(
      new Error('Network unavailable')
    );

    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchUsers();

    expect(result).toEqual({
      success: false,
      error: 'Network unavailable'
    });
  });

  it('filters out invalid users from an array', async () => {
    const responseData = [
      {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com'
      },
      {
        id: 'invalid',
        name: 'Broken user',
        email: 'broken@example.com'
      }
    ];

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );

    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchUsers();

    expect(result).toEqual({
      success: true,
      data: [
        {
          id: 1,
          name: 'Alice',
          email: 'alice@example.com'
        }
      ]
    });
  });
});
