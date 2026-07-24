import { useState } from 'react';
import Layout from './components/Layout';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import sampleTickets from './data/sampleTickets';

export default function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '16px' }}>
        <TicketList
          tickets={sampleTickets}
          selectedId={selectedTicket?.id}
          onSelect={setSelectedTicket}
        />
        <TicketDetail ticket={selectedTicket} />
      </div>
    </Layout>
  );
}
