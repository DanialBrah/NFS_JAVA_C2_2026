const CATEGORIES = ['Hardware', 'Software', 'Network', 'Email', 'Account'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export default function TicketFormWizard({ values, onChange, onSubmit }) {
  function handleChange(e) {
    onChange(e.target.name, e.target.value);
  }

  return (
    <form className="ticket-form" onSubmit={onSubmit}>
      <h2>New ticket</h2>

      <label className="ticket-form-field" htmlFor="title">
        Title
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          required
        />
      </label>

      <label className="ticket-form-field" htmlFor="description">
        Description
        <textarea
          id="description"
          name="description"
          rows="4"
          value={values.description}
          onChange={handleChange}
          required
        />
      </label>

      <label className="ticket-form-field" htmlFor="category">
        Category
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="ticket-form-field" htmlFor="priority">
        Priority
        <select
          id="priority"
          name="priority"
          value={values.priority}
          onChange={handleChange}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <label className="ticket-form-field" htmlFor="status">
        Status
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={handleChange}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Save ticket</button>
    </form>
  );
}
