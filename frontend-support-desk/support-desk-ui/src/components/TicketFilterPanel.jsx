const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'CLOSED'];
const PRIORITIES = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

export default function TicketFilterPanel({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
}) {
  return (
    <div className="filter-panel">
      <input
        type="text"
        placeholder="Search by title or category…"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}
          </option>
        ))}
      </select>

      <select value={priorityFilter} onChange={(e) => onPriorityChange(e.target.value)}>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p === 'ALL' ? 'All Priorities' : p}
          </option>
        ))}
      </select>
    </div>
  );
}
