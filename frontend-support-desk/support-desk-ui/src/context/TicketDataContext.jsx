import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { useAuth } from './AuthContext.jsx';
import { fetchTickets } from '../services/api';

const TicketDataContext = createContext(null);

const initialState = {
  tickets: [],
  selectedTicketId: null,
  loading: true,
  error: '',
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  filters: {
    searchText: '',
    status: 'ALL',
    priority: 'ALL',
  },
};

// The v1 list endpoint returns a plain array, so page info is derived from it.
// A paged endpoint can pass Spring's metadata straight through instead.
function toPageInfo(tickets, page) {
  if (page) {
    return page;
  }

  return {
    number: 0,
    size: tickets.length,
    totalElements: tickets.length,
    totalPages: tickets.length > 0 ? 1 : 0,
  };
}

function ticketDataReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: '' };

    case 'LOAD_SUCCESS': {
      const tickets = action.payload.tickets ?? [];

      return {
        ...state,
        tickets,
        page: toPageInfo(tickets, action.payload.page),
        loading: false,
        error: '',
        // Drop the selection if that ticket is no longer in the list.
        selectedTicketId: tickets.some((t) => t.id === state.selectedTicketId)
          ? state.selectedTicketId
          : null,
      };
    }

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };

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

  const loadTickets = useCallback(() => {
    dispatch({ type: 'LOAD_START' });

    return fetchTickets(token)
      .then((tickets) => dispatch({ type: 'LOAD_SUCCESS', payload: { tickets } }))
      .catch((err) => dispatch({ type: 'LOAD_ERROR', payload: err.message }));
  }, [token]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const value = useMemo(() => {
    const { searchText, status, priority } = state.filters;
    const query = searchText.toLowerCase();

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
      reloadTickets: loadTickets,
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
