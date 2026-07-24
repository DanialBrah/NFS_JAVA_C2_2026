import { useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import TicketFilterPanel from './components/TicketFilterPanel';
import sampleTickets from './data/sampleTickets';

export default function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredTickets = sampleTickets.filter((ticket) => {
    const query = searchText.toLowerCase();
    const matchesSearch =
      ticket.title.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === 'ALL' || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'ALL' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Layout>
      <div className="dashboard">
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
    </Layout>
  );
}
