import { useEffect, useState } from 'react';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import TicketFilterPanel from '../components/TicketFilterPanel';
import ErrorMessage from '../components/ErrorMessage';
import LoadingMessage from '../components/LoadingMessage';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchTickets } from '../services/api';

export default function TicketsPage() {
  const { token } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    let active = true;

    fetchTickets(token)
      .then((loaded) => {
        if (active) {
          setTickets(loaded ?? []);
        }
      })
      .catch((err) => {
        if (active) {
          setLoadError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchText.toLowerCase();
    const matchesSearch =
      ticket.title.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query);
    // Seeded tickets are not all stored in upper case, so compare case-insensitively.
    const matchesStatus =
      statusFilter === 'ALL' || ticket.status?.toUpperCase() === statusFilter;
    const matchesPriority =
      priorityFilter === 'ALL' || ticket.priority?.toUpperCase() === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="dashboard">
        <LoadingMessage message="Loading tickets…" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      {loadError && <ErrorMessage message={loadError} />}

      <TicketFilterPanel
        searchText={searchText}
        onSearchChange={setSearchText}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />
      <div className="dashboard-grid">
        <TicketList
          tickets={filteredTickets}
          selectedId={selectedTicket?.id}
          onSelect={setSelectedTicket}
        />
        <TicketDetail ticket={selectedTicket} />
      </div>
    </div>
  );
}
