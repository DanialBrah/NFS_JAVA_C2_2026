export default function PriorityBadge({ priority }) {
  const cls = `badge badge-priority-${priority?.toLowerCase()}`;
  return <span className={cls}>{priority}</span>;
}
