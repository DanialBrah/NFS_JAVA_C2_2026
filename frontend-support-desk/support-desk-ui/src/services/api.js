export async function fetchApiInfo() {
    const response = await fetch('/api/v1/info');

    if (!response.ok) {
        throw new Error('Failed to load API info');
    }

    return response.json();
}
