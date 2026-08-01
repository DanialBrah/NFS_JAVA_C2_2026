import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import TicketFilterPanel from '../components/TicketFilterPanel';
import TicketPaginationControls from '../components/TicketPaginationControls';
import ErrorMessage from '../components/ErrorMessage';
import LoadingMessage from '../components/LoadingMessage';
import { useTicketData } from '../context/TicketDataContext.jsx';

export default function TicketsPage() {
  const {
    tickets,
    filteredTickets,
    selectedTicket,
    selectedTicketId,
    loading,
    error,
    page,
    filters,
    setSearchText,
    setStatusFilter,
    setPriorityFilter,
    selectTicket,
  } = useTicketData();

  return (
    <div className="dashboard">
      {error && <ErrorMessage message={error} />}

      <TicketFilterPanel
        searchText={filters.searchText}
        onSearchChange={setSearchText}
        statusFilter={filters.status}
        onStatusChange={setStatusFilter}
        priorityFilter={filters.priority}
        onPriorityChange={setPriorityFilter}
      />

      <TicketPaginationControls />

      {loading ? (
        <LoadingMessage message="Loading tickets…" />
      ) : (
        <>
          <p className="ticket-count">
            Showing {filteredTickets.length} of {tickets.length} on this page
            {' · '}
            {page.totalElements} tickets in total
          </p>

          <div className="dashboard-grid">
            <TicketList
              tickets={filteredTickets}
              selectedId={selectedTicketId}
              onSelect={(ticket) => selectTicket(ticket.id)}
            />
            <TicketDetail ticket={selectedTicket} />
          </div>
        </>
      )}
    </div>
  );
}
