const colours = {
  HIGH:   { background: '#fee2e2', color: '#b91c1c' },
  MEDIUM: { background: '#fef9c3', color: '#854d0e' },
  LOW:    { background: '#dcfce7', color: '#166534' },
};

export default function PriorityBadge({ priority }) {
  const style = colours[priority] ?? { background: '#e5e7eb', color: '#374151' };
  return (
    <span style={{
      ...style,
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
    }}>
      {priority}
    </span>
  );
}
