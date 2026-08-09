import { formatTicketFormLabel, normalizeTicketFormPayload, validateTicketForm } from './ticketFormValidation';

const VALID_VALUES = {
  title: 'Cannot access email',
  description: 'Locked out since this morning.',
  category: 'Email',
  priority: 'HIGH',
  status: 'OPEN',
};

describe('validateTicketForm', () => {
  it('flags every required field left empty, with a field-specific message', () => {
    const errors = validateTicketForm({
      title: '',
      description: '',
      category: '',
      priority: '',
      status: '',
    });

    expect(errors).toEqual({
      title: 'Title is required',
      description: 'Description is required',
      category: 'Category is required',
      priority: 'Priority is required',
      status: 'Status is required',
    });
  });

  it('treats whitespace-only input as empty', () => {
    const errors = validateTicketForm({ ...VALID_VALUES, title: '   ' });

    expect(errors).toEqual({ title: 'Title is required' });
  });

  it('rejects a priority that is not LOW, MEDIUM or HIGH', () => {
    const errors = validateTicketForm({ ...VALID_VALUES, priority: 'URGENT' });

    expect(errors).toEqual({ priority: 'Priority must be LOW, MEDIUM or HIGH' });
  });

  it('rejects a status that is not OPEN, IN_PROGRESS or CLOSED', () => {
    const errors = validateTicketForm({ ...VALID_VALUES, status: 'ARCHIVED' });

    expect(errors).toEqual({ status: 'Status must be OPEN, IN_PROGRESS or CLOSED' });
  });

  it('is case-sensitive, matching the backend rule exactly', () => {
    const errors = validateTicketForm({ ...VALID_VALUES, priority: 'high' });

    expect(errors).toEqual({ priority: 'Priority must be LOW, MEDIUM or HIGH' });
  });

  it('reports "required" rather than "invalid" for a blank priority', () => {
    const errors = validateTicketForm({ ...VALID_VALUES, priority: '' });

    expect(errors).toEqual({ priority: 'Priority is required' });
  });

  it('returns no errors when every field is valid', () => {
    expect(validateTicketForm(VALID_VALUES)).toEqual({});
  });
});

describe('normalizeTicketFormPayload', () => {
  it('trims leading and trailing whitespace from every field', () => {
    const payload = normalizeTicketFormPayload({
      title: '  Cannot access email  ',
      description: '  Locked out since this morning.  ',
      category: '  Email  ',
      priority: '  HIGH  ',
      status: '  OPEN  ',
    });

    expect(payload).toEqual(VALID_VALUES);
  });

  it('leaves already-clean values unchanged', () => {
    expect(normalizeTicketFormPayload(VALID_VALUES)).toEqual(VALID_VALUES);
  });
});

describe('formatTicketFormLabel', () => {
  it('returns the human-readable label for a known field', () => {
    expect(formatTicketFormLabel('title')).toBe('Title');
    expect(formatTicketFormLabel('priority')).toBe('Priority');
  });

  it('falls back to the raw key for an unknown field', () => {
    expect(formatTicketFormLabel('unknownField')).toBe('unknownField');
  });
});
