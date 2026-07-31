import { useState } from 'react';
import TicketFormWizard from '../components/TicketFormWizard';

const EMPTY_TICKET = {
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

function validateTicketForm(values) {
  const errors = {};

  for (const [field, message] of Object.entries(REQUIRED_MESSAGES)) {
    if (!values[field].trim()) {
      errors[field] = message;
    }
  }

  return errors;
}

export default function TicketFormPage() {
  const [values, setValues] = useState(EMPTY_TICKET);
  const [errors, setErrors] = useState({});

  function handleChange(name, value) {
    setValues((current) => ({ ...current, [name]: value }));

    // Clear the error as soon as the user starts fixing the field.
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = validateTicketForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    console.log('Ticket form values', values);
  }

  return (
    <div className="dashboard">
      <TicketFormWizard
        values={values}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
