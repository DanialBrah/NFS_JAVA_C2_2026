import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketFormWizard from './TicketFormWizard';

const EMPTY_VALUES = {
  title: '',
  description: '',
  category: '',
  priority: '',
  status: '',
};

const REQUIRED_MESSAGES = {
  title: 'Title is required',
  description: 'Description is required',
  category: 'Category is required',
  priority: 'Priority is required',
  status: 'Status is required',
};

function validate(values) {
  const errors = {};

  for (const [field, message] of Object.entries(REQUIRED_MESSAGES)) {
    if (!values[field].trim()) {
      errors[field] = message;
    }
  }

  return errors;
}

// TicketFormWizard is a controlled, presentational component: it always
// forwards the native submit event to its onSubmit prop. Validation and the
// decision to actually save live in the owning page (see
// TicketFormPage.jsx). This harness reproduces that same wiring so the
// wizard can be exercised the way a real user would use it.
function TicketFormHarness({ onValidSubmit, saving = false }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});

  function handleChange(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onValidSubmit(values);
    }
  }

  return (
    <TicketFormWizard
      values={values}
      errors={errors}
      saving={saving}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

async function fillValidForm(user) {
  await user.type(screen.getByLabelText('Title'), 'Cannot access email');
  await user.type(screen.getByLabelText('Description'), 'Locked out since this morning.');
  await user.selectOptions(screen.getByLabelText('Category'), 'Email');
  await user.selectOptions(screen.getByLabelText('Priority'), 'HIGH');
  await user.selectOptions(screen.getByLabelText('Status'), 'OPEN');
}

describe('TicketFormWizard', () => {
  it('shows inline errors for every required field left empty', async () => {
    const user = userEvent.setup();
    const onValidSubmit = vi.fn();

    render(<TicketFormHarness onValidSubmit={onValidSubmit} />);
    await user.click(screen.getByRole('button', { name: /save ticket/i }));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Priority is required')).toBeInTheDocument();
    expect(screen.getByText('Status is required')).toBeInTheDocument();
    expect(onValidSubmit).not.toHaveBeenCalled();
  });

  it('calls the submit handler with clean payload data once every field is valid', async () => {
    const user = userEvent.setup();
    const onValidSubmit = vi.fn();

    render(<TicketFormHarness onValidSubmit={onValidSubmit} />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /save ticket/i }));

    expect(onValidSubmit).toHaveBeenCalledWith({
      title: 'Cannot access email',
      description: 'Locked out since this morning.',
      category: 'Email',
      priority: 'HIGH',
      status: 'OPEN',
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('disables the save button and shows a saving state while submitting', () => {
    render(<TicketFormHarness onValidSubmit={() => {}} saving />);

    const button = screen.getByRole('button', { name: /saving/i });
    expect(button).toBeDisabled();
  });
});
