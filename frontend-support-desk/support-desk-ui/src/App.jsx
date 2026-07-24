import { useEffect, useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import TicketFilterPanel from './components/TicketFilterPanel';
import ApiInfoCard from './components/ApiInfoCard';
import sampleTickets from './data/sampleTickets';
import { fetchApiInfo } from './services/api';

export default function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [apiInfo, setApiInfo] = useState(null);
  const [loadingApi, setLoadingApi] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadApiInfo() {
      try {
        setLoadingApi(true);
        setApiError('');

        const info = await fetchApiInfo();

        if (!ignore) {
          setApiInfo(info);
        }
      } catch (error) {
        if (!ignore) {
          setApiError(
            'Could not connect to backend. Start Spring Boot on port 8080 and try again.'
          );
          console.error(error);
        }
      } finally {
        if (!ignore) {
          setLoadingApi(false);
        }
      }
    }

    loadApiInfo();

    return () => {
      ignore = true;
    };
  }, []);

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
        <ApiInfoCard
          loading={loadingApi}
          error={apiError}
          apiInfo={apiInfo}
        />

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
