import { useState } from 'react';
import TicketFormWizard from '../components/TicketFormWizard';

const EMPTY_TICKET = {
  title: '',
  description: '',
  category: '',
  priority: 'MEDIUM',
  status: 'OPEN',
};

export default function TicketFormPage() {
  const [values, setValues] = useState(EMPTY_TICKET);

  function handleChange(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Ticket form values', values);
  }

  return (
    <div className="dashboard">
      <TicketFormWizard
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
