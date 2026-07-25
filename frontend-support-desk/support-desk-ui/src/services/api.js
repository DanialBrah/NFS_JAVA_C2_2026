export async function fetchApiInfo() {
    const response = await fetch('/api/v1/info');

    if (!response.ok) {
        throw new Error('Failed to load API info');
    }

    return response.json();
}

export async function login(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.message || 'Login failed');
    }

    return body;
}
