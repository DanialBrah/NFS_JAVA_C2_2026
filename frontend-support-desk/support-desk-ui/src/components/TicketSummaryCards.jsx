const CARDS = [
  { label: 'Total Tickets', match: () => true },
  { label: 'Open', match: (status) => status === 'OPEN' },
  { label: 'In Progress', match: (status) => status === 'IN_PROGRESS' },
  { label: 'Closed', match: (status) => status === 'CLOSED' },
];

export default function TicketSummaryCards({ tickets = [] }) {
  const statuses = tickets.map((ticket) => ticket.status?.toUpperCase());

  return (
    <div className="summary-cards">
      {CARDS.map(({ label, match }) => (
        <div className="summary-card" key={label}>
          <span className="summary-card-label">{label}</span>
          <strong className="summary-card-value">{statuses.filter(match).length}</strong>
        </div>
      ))}
    </div>
  );
}
