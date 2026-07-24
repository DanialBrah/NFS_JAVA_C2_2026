import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function TicketList({ tickets, selectedId, onSelect }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {tickets.map((ticket) => (
        <li
          key={ticket.id}
          onClick={() => onSelect(ticket)}
          style={{
            padding: '12px 16px',
            marginBottom: '8px',
            border: `2px solid ${selectedId === ticket.id ? '#6d28d9' : '#e5e7eb'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            background: selectedId === ticket.id ? '#f5f3ff' : '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{ticket.title}</strong>
            <div style={{ display: 'flex', gap: '6px' }}>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
            {ticket.category} · {ticket.createdBy}
          </div>
        </li>
      ))}
    </ul>
  );
}
