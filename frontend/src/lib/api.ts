export const API_URL = 'http://localhost:3001';

export async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(error.error || error.message || 'API request failed');
    }

    return res.json();
}
