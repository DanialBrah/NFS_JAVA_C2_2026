export default function StatusBadge({ status }) {
  const cls = `badge badge-status-${status?.toLowerCase()}`;
  return <span className={cls}>{status?.replace('_', ' ')}</span>;
}
