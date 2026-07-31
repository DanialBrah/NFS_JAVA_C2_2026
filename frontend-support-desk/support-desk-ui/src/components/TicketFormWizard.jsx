const CATEGORIES = ['Hardware', 'Software', 'Network', 'Email', 'Account'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export default function TicketFormWizard({
  heading = 'New ticket',
  values,
  errors,
  saving = false,
  onChange,
  onSubmit,
}) {
  function handleChange(e) {
    onChange(e.target.name, e.target.value);
  }

  // An existing ticket may use a category outside the suggested list; keep it
  // so opening the edit form does not silently drop it.
  const categoryOptions = CATEGORIES.includes(values.category) || !values.category
    ? CATEGORIES
    : [values.category, ...CATEGORIES];

  function fieldProps(name) {
    return {
      id: name,
      name,
      value: values[name],
      onChange: handleChange,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <form className="ticket-form" onSubmit={onSubmit} noValidate>
      <h2>{heading}</h2>

      <label className="ticket-form-field" htmlFor="title">
        Title
        <input type="text" {...fieldProps('title')} />
        <FieldError name="title" errors={errors} />
      </label>

      <label className="ticket-form-field" htmlFor="description">
        Description
        <textarea rows="4" {...fieldProps('description')} />
        <FieldError name="description" errors={errors} />
      </label>

      <label className="ticket-form-field" htmlFor="category">
        Category
        <select {...fieldProps('category')}>
          <option value="">Select a category…</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <FieldError name="category" errors={errors} />
      </label>

      <label className="ticket-form-field" htmlFor="priority">
        Priority
        <select {...fieldProps('priority')}>
          <option value="">Select a priority…</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <FieldError name="priority" errors={errors} />
      </label>

      <label className="ticket-form-field" htmlFor="status">
        Status
        <select {...fieldProps('status')}>
          <option value="">Select a status…</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        <FieldError name="status" errors={errors} />
      </label>

      <button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save ticket'}
      </button>
    </form>
  );
}

function FieldError({ name, errors }) {
  if (!errors[name]) {
    return null;
  }

  return (
    <span className="field-error" id={`${name}-error`} role="alert">
      {errors[name]}
    </span>
  );
}
