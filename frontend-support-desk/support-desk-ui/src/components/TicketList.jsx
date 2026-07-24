import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function TicketList({ tickets, selectedId, onSelect }) {
  return (
    <ul className="ticket-list">
      {tickets.map((ticket) => (
        <li
          key={ticket.id}
          className={`ticket-list-item${selectedId === ticket.id ? ' selected' : ''}`}
          onClick={() => onSelect(ticket)}
        >
          <div className="ticket-list-item-header">
            <strong>{ticket.title}</strong>
            <div className="ticket-list-item-badges">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
          <div className="ticket-list-item-meta">
            {ticket.category} · {ticket.createdBy}
          </div>
        </li>
      ))}
    </ul>
  );
}
