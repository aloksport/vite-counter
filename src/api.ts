
import type { ApiUser, Result } from './types';

function isApiUser(value: unknown): value is ApiUser {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (
    !('id' in value) ||
    !('name' in value) ||
    !('email' in value)
  ) {
    return false;
  }

  return (
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string'
  );
}

export async function fetchUsers(): Promise<Result<ApiUser[]>> {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users'
    );

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error: ${response.status}`
      };
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      return {
        success: false,
        error: 'The API did not return an array.'
      };
    }

    const users = data.filter(isApiUser);

    return {
      success: true,
      data: users
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'An unexpected error occurred.'
    };
  }
}
