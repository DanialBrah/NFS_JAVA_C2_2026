import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';
import { fetchTicketsPaged } from '../services/api';

const TicketDataContext = createContext(null);

const initialState = {
  tickets: [],
  selectedTicketId: null,
  loading: true,
  error: '',
  // What the server told us about the page we are showing.
  page: {
    number: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  },
  // What we ask the server for.
  query: {
    page: 0,
    size: 5,
    sortBy: 'createdAt',
    direction: 'desc',
  },
  filters: {
    searchText: '',
    status: 'ALL',
    priority: 'ALL',
  },
  // Pages we have already fetched, keyed by page|size|sortBy|direction.
  cache: {},
  // '' while loading, then 'backend' or 'cache'.
  source: '',
};

function makeCacheKey({ page, size, sortBy, direction }) {
  return `${page}|${size}|${sortBy}|${direction}`;
}

// Changing size or sort invalidates the current page number.
function withQuery(state, changes) {
  return { ...state, query: { ...state.query, page: 0, ...changes } };
}

// A selection only survives if that ticket is on the page being shown.
function keepSelection(state, tickets) {
  return tickets.some((t) => t.id === state.selectedTicketId) ? state.selectedTicketId : null;
}

function ticketDataReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: '', source: '' };

    case 'LOAD_SUCCESS': {
      const { key, response = {} } = action.payload;
      const tickets = response.content ?? [];
      const page = {
        number: response.number ?? 0,
        size: response.size ?? state.query.size,
        totalElements: response.totalElements ?? tickets.length,
        totalPages: response.totalPages ?? 0,
        first: response.first ?? true,
        last: response.last ?? true,
      };

      return {
        ...state,
        tickets,
        page,
        // Remember this page so returning to it needs no request.
        cache: { ...state.cache, [key]: { tickets, page } },
        source: 'backend',
        loading: false,
        error: '',
        selectedTicketId: keepSelection(state, tickets),
      };
    }

    case 'LOAD_FROM_CACHE': {
      const entry = state.cache[action.payload];

      if (!entry) {
        return state;
      }

      return {
        ...state,
        tickets: entry.tickets,
        page: entry.page,
        source: 'cache',
        loading: false,
        error: '',
        selectedTicketId: keepSelection(state, entry.tickets),
      };
    }

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload, source: '' };

    case 'SET_PAGE':
      return { ...state, query: { ...state.query, page: Math.max(0, action.payload) } };

    case 'SET_PAGE_SIZE':
      return withQuery(state, { size: action.payload });

    case 'SET_SORT_FIELD':
      return withQuery(state, { sortBy: action.payload });

    case 'SET_SORT_DIRECTION':
      return withQuery(state, { direction: action.payload });

    case 'SET_SEARCH_TEXT':
      return { ...state, filters: { ...state.filters, searchText: action.payload } };

    case 'SET_STATUS_FILTER':
      return { ...state, filters: { ...state.filters, status: action.payload } };

    case 'SET_PRIORITY_FILTER':
      return { ...state, filters: { ...state.filters, priority: action.payload } };

    case 'SELECT_TICKET':
      return { ...state, selectedTicketId: action.payload };

    default:
      return state;
  }
}

export function TicketDataProvider({ children }) {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(ticketDataReducer, initialState);

  // Depend on the primitives, not the query object, so typing in the search
  // box never triggers a refetch.
  const { page, size, sortBy, direction } = state.query;

  // The cache is read through a ref so that filling it does not change the
  // identity of loadTickets, which would re-run the effect in a loop.
  const cacheRef = useRef(state.cache);

  useEffect(() => {
    cacheRef.current = state.cache;
  }, [state.cache]);

  const loadTickets = useCallback(({ force = false } = {}) => {
    const key = makeCacheKey({ page, size, sortBy, direction });

    if (!force && cacheRef.current[key]) {
      dispatch({ type: 'LOAD_FROM_CACHE', payload: key });
      return Promise.resolve();
    }

    dispatch({ type: 'LOAD_START' });

    return fetchTicketsPaged(token, { page, size, sortBy, direction })
      .then((response) => dispatch({ type: 'LOAD_SUCCESS', payload: { key, response } }))
      .catch((err) => dispatch({ type: 'LOAD_ERROR', payload: err.message }));
  }, [token, page, size, sortBy, direction]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const value = useMemo(() => {
    const { searchText, status, priority } = state.filters;
    const query = searchText.toLowerCase();

    // Filters apply to the records on the current page.
    const filteredTickets = state.tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query);
      // Seeded tickets are not all stored in upper case.
      const matchesStatus = status === 'ALL' || ticket.status?.toUpperCase() === status;
      const matchesPriority = priority === 'ALL' || ticket.priority?.toUpperCase() === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return {
      ...state,
      filteredTickets,
      selectedTicket: state.tickets.find((t) => t.id === state.selectedTicketId) ?? null,
      // Refresh always skips the cache.
      refreshTickets: () => loadTickets({ force: true }),
      cachedPageCount: Object.keys(state.cache).length,
      goToNextPage: () => dispatch({ type: 'SET_PAGE', payload: state.query.page + 1 }),
      goToPreviousPage: () => dispatch({ type: 'SET_PAGE', payload: state.query.page - 1 }),
      setPageSize: (value) => dispatch({ type: 'SET_PAGE_SIZE', payload: Number(value) }),
      setSortField: (value) => dispatch({ type: 'SET_SORT_FIELD', payload: value }),
      setSortDirection: (value) => dispatch({ type: 'SET_SORT_DIRECTION', payload: value }),
      setSearchText: (text) => dispatch({ type: 'SET_SEARCH_TEXT', payload: text }),
      setStatusFilter: (value) => dispatch({ type: 'SET_STATUS_FILTER', payload: value }),
      setPriorityFilter: (value) => dispatch({ type: 'SET_PRIORITY_FILTER', payload: value }),
      selectTicket: (id) => dispatch({ type: 'SELECT_TICKET', payload: id }),
    };
  }, [state, loadTickets]);

  return (
    <TicketDataContext.Provider value={value}>
      {children}
    </TicketDataContext.Provider>
  );
}

export function useTicketData() {
  return useContext(TicketDataContext);
}
