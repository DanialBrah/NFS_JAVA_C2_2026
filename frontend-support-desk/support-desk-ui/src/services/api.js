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

// Spring returns an empty body for 401 and 403, so response.json() cannot be
// trusted on error responses.
async function readBody(response) {
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

async function sendTicketRequest(url, method, token, payload, fallbackMessage) {
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const body = await readBody(response);

    if (!response.ok) {
        throw new Error(body?.message || `${fallbackMessage} (${response.status})`);
    }

    return body;
}

export async function createTicket(token, payload) {
    return sendTicketRequest('/api/v1/tickets', 'POST', token, payload, 'Failed to create ticket');
}

export async function updateTicket(id, token, payload) {
    return sendTicketRequest(`/api/v1/tickets/${id}`, 'PUT', token, payload, 'Failed to update ticket');
}

async function getTickets(url, token, fallbackMessage) {
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const body = await readBody(response);

    if (!response.ok) {
        throw new Error(body?.message || `${fallbackMessage} (${response.status})`);
    }

    return body;
}

export async function fetchTickets(token) {
    return getTickets('/api/v1/tickets', token, 'Failed to load tickets');
}

export async function fetchTicketById(token, id) {
    return getTickets(`/api/v1/tickets/${id}`, token, 'Failed to load ticket');
}
