import { Link } from 'react-router';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import TicketStatusActions from './TicketStatusActions';

export default function TicketDetail({ ticket }) {
  if (!ticket) {
    return <div className="ticket-detail-empty">Select a ticket to see details.</div>;
  }

  return (
    <div className="ticket-detail">
      <h2>{ticket.title}</h2>
      <table>
        <tbody>
          {[
            ['ID',         ticket.id],
            ['Category',   ticket.category],
            ['Created By', ticket.createdBy],
            ['Created At', ticket.createdAt],
          ].map(([label, value]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{value}</td>
            </tr>
          ))}
          <tr>
            <td>Priority</td>
            <td><PriorityBadge priority={ticket.priority} /></td>
          </tr>
          <tr>
            <td>Status</td>
            <td><StatusBadge status={ticket.status} /></td>
          </tr>
        </tbody>
      </table>

      <TicketStatusActions ticket={ticket} />

      <Link className="ticket-detail-edit" to={`/app/tickets/${ticket.id}/edit`}>
        Edit ticket
      </Link>
    </div>
  );
}
