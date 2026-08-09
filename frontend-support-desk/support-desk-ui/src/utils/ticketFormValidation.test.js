import { formatTicketFormLabel, normalizeTicketFormPayload, validateTicketForm } from './ticketFormValidation';

const VALID_VALUES = {
  title: 'Cannot access email',
  description: 'Locked out since this morning.',
  category: 'Email',
  priority: 'HIGH',
  status: 'OPEN',
};

describe('validateTicketForm', () => {
  it('returns an error for every required field left empty', () => {
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

  it('returns no errors when every field has a value', () => {
    const errors = validateTicketForm(VALID_VALUES);

    expect(errors).toEqual({});
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
