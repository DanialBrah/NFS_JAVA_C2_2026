const FIELD_LABELS = {
  title: 'Title',
  description: 'Description',
  category: 'Category',
  priority: 'Priority',
  status: 'Status',
};

const REQUIRED_FIELDS = Object.keys(FIELD_LABELS);

// Mirrors the backend's @Pattern constraints (UpdateTicketRequest) so the
// same invalid value is rejected in the same words on both sides.
const ALLOWED_VALUES = {
  priority: ['LOW', 'MEDIUM', 'HIGH'],
  status: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
};

const INVALID_VALUE_MESSAGES = {
  priority: 'Priority must be LOW, MEDIUM or HIGH',
  status: 'Status must be OPEN, IN_PROGRESS or CLOSED',
};

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

  for (const [field, allowed] of Object.entries(ALLOWED_VALUES)) {
    if (!errors[field] && !allowed.includes(formValues[field]?.trim())) {
      errors[field] = INVALID_VALUE_MESSAGES[field];
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
