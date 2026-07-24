import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function TicketDetail({ ticket }) {
  if (!ticket) {
    return (
      <div style={{ padding: '16px', color: '#9ca3af', fontStyle: 'italic' }}>
        Select a ticket to see details.
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      background: '#fff',
    }}>
      <h2 style={{ marginTop: 0 }}>{ticket.title}</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {[
            ['ID',         ticket.id],
            ['Category',   ticket.category],
            ['Created By', ticket.createdBy],
            ['Created At', ticket.createdAt],
          ].map(([label, value]) => (
            <tr key={label}>
              <td style={{ padding: '6px 12px 6px 0', color: '#6b7280', fontWeight: '600', whiteSpace: 'nowrap' }}>
                {label}
              </td>
              <td style={{ padding: '6px 0' }}>{value}</td>
            </tr>
          ))}
          <tr>
            <td style={{ padding: '6px 12px 6px 0', color: '#6b7280', fontWeight: '600' }}>Priority</td>
            <td style={{ padding: '6px 0' }}><PriorityBadge priority={ticket.priority} /></td>
          </tr>
          <tr>
            <td style={{ padding: '6px 12px 6px 0', color: '#6b7280', fontWeight: '600' }}>Status</td>
            <td style={{ padding: '6px 0' }}><StatusBadge status={ticket.status} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
