import { useTicketData } from '../context/TicketDataContext.jsx';

const PAGE_SIZES = [5, 10, 20];
const SORT_FIELDS = ['createdAt', 'title', 'category', 'priority', 'status', 'createdBy'];

export default function TicketPaginationControls() {
  const {
    page,
    query,
    loading,
    goToNextPage,
    goToPreviousPage,
    setPageSize,
    setSortField,
    setSortDirection,
    refreshTickets,
  } = useTicketData();

  return (
    <div className="pagination-panel">
      <label className="pagination-field" htmlFor="page-size">
        Page size
        <select
          id="page-size"
          value={query.size}
          onChange={(e) => setPageSize(e.target.value)}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <label className="pagination-field" htmlFor="sort-by">
        Sort by
        <select
          id="sort-by"
          value={query.sortBy}
          onChange={(e) => setSortField(e.target.value)}
        >
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </label>

      <label className="pagination-field" htmlFor="sort-direction">
        Direction
        <select
          id="sort-direction"
          value={query.direction}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>

      <button type="button" onClick={refreshTickets} disabled={loading}>
        ⟳ Refresh
      </button>

      <span className="pagination-spacer" />

      <button
        type="button"
        onClick={goToPreviousPage}
        disabled={loading || page.first}
      >
        ← Previous
      </button>

      <span className="pagination-status">
        Page {page.totalPages === 0 ? 0 : page.number + 1} of {page.totalPages}
      </span>

      <button
        type="button"
        onClick={goToNextPage}
        disabled={loading || page.last}
      >
        Next →
      </button>
    </div>
  );
}
