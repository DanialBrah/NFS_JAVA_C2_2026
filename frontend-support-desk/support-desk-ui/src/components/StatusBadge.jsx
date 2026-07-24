const colours = {
  OPEN:        { background: '#dbeafe', color: '#1e40af' },
  IN_PROGRESS: { background: '#ede9fe', color: '#6d28d9' },
  CLOSED:      { background: '#f3f4f6', color: '#6b7280' },
};

export default function StatusBadge({ status }) {
  const style = colours[status] ?? { background: '#e5e7eb', color: '#374151' };
  return (
    <span style={{
      ...style,
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
    }}>
      {status.replace('_', ' ')}
    </span>
  );
}
