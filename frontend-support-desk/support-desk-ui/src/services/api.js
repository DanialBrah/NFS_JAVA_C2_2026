import { apiRequest } from './httpClient.js';

export function fetchApiInfo() {
    return apiRequest('/api/v1/info', {
        errorMessage: 'Failed to load API info',
    });
}

export function login(email, password) {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        errorMessage: 'Login failed',
    });
}

export function fetchTickets(token) {
    return apiRequest('/api/v1/tickets', {
        token,
        errorMessage: 'Failed to load tickets',
    });
}

export function fetchTicketsPaged(token, { page = 0, size = 5, sortBy = 'createdAt', direction = 'desc' } = {}) {
    const query = new URLSearchParams({ page, size, sortBy, direction });

    return apiRequest(`/api/v1/tickets/paged?${query}`, {
        token,
        errorMessage: 'Failed to load tickets',
    });
}

export function fetchTicketById(token, id) {
    return apiRequest(`/api/v1/tickets/${id}`, {
        token,
        errorMessage: 'Failed to load ticket',
    });
}

export function createTicket(token, payload) {
    return apiRequest('/api/v1/tickets', {
        method: 'POST',
        token,
        body: payload,
        errorMessage: 'Failed to create ticket',
    });
}

export function updateTicket(id, token, payload) {
    return apiRequest(`/api/v1/tickets/${id}`, {
        method: 'PUT',
        token,
        body: payload,
        errorMessage: 'Failed to update ticket',
    });
}
