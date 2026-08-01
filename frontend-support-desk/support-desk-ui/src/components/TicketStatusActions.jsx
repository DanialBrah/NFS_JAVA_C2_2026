import { useTicketData } from '../context/TicketDataContext.jsx';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export default function TicketStatusActions({ ticket }) {
  const { changeTicketStatus, updatingTicketId, updateError } = useTicketData();

  const saving = updatingTicketId === ticket.id;
  const current = ticket.status?.toUpperCase();

  return (
    <div className="status-actions">
      <span className="status-actions-label">Change status</span>

      <div className="status-actions-buttons">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={status === current ? 'active' : undefined}
            disabled={saving || status === current}
            onClick={() => changeTicketStatus(ticket, status)}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {saving && <span className="status-actions-note">Saving…</span>}
      {updateError && !saving && (
        <span className="status-actions-error" role="alert">
          {updateError} — change was rolled back.
        </span>
      )}
    </div>
  );
}
