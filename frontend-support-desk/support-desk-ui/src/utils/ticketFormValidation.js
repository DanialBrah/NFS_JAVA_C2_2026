const FIELD_LABELS = {
  title: 'Title',
  description: 'Description',
  category: 'Category',
  priority: 'Priority',
  status: 'Status',
};

const REQUIRED_FIELDS = Object.keys(FIELD_LABELS);

export function formatTicketFormLabel(key) {
  return FIELD_LABELS[key] ?? key;
}

export function validateTicketForm(formValues) {
  const errors = {};

  for (const field of REQUIRED_FIELDS) {
    if (!formValues[field]?.trim()) {
      errors[field] = `${formatTicketFormLabel(field)} is required`;
    }
  }

  return errors;
}

export function normalizeTicketFormPayload(formValues) {
  return {
    title: formValues.title.trim(),
    description: formValues.description.trim(),
    category: formValues.category.trim(),
    priority: formValues.priority.trim(),
    status: formValues.status.trim(),
  };
}
