// Spring returns an empty body for 401 and 403, so response.json() cannot be
// trusted on error responses.
async function readJson(response) {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

/**
 * One place for every call to the Support Desk API.
 *
 * @param {string} path        e.g. '/api/v1/tickets'
 * @param {object} options
 * @param {string} [options.method]        defaults to 'GET'
 * @param {string} [options.token]         JWT; sent as an Authorization header
 * @param {object} [options.body]          serialised to JSON
 * @param {string} [options.errorMessage]  fallback text when the backend sends no message
 * @returns {Promise<object|null>} the parsed JSON body
 */
export async function apiRequest(path, options = {}) {
    const {
        method = 'GET',
        token,
        body,
        errorMessage = 'Request failed',
    } = options;

    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    const data = await readJson(response);

    if (!response.ok) {
        // Prefer the backend's own message, e.g. a validation failure.
        throw new Error(data?.message || `${errorMessage} (${response.status})`);
    }

    return data;
}
