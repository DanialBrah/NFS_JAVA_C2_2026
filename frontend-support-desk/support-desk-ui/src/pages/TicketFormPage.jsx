import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import TicketFormWizard from '../components/TicketFormWizard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingMessage from '../components/LoadingMessage';
import { useAuth } from '../context/AuthContext.jsx';
import { createTicket, fetchTicketById, updateTicket } from '../services/api';
import { normalizeTicketFormPayload, validateTicketForm } from '../utils/ticketFormValidation';

const EMPTY_TICKET = {
  title: '',
  description: '',
  category: '',
  priority: '',
  status: '',
};

export default function TicketFormPage() {
  const { ticketId } = useParams();
  const { token, user } = useAuth();
  const isEditing = Boolean(ticketId);

  const [values, setValues] = useState(EMPTY_TICKET);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!ticketId) {
      return;
    }

    let active = true;

    fetchTicketById(token, ticketId)
      .then((ticket) => {
        if (!active) {
          return;
        }

        setValues({
          title: ticket.title ?? '',
          description: ticket.description ?? '',
          category: ticket.category ?? '',
          // Older tickets were stored in lower case; the selects and the
          // backend both expect upper case.
          priority: ticket.priority?.toUpperCase() ?? '',
          status: ticket.status?.toUpperCase() ?? '',
        });
      })
      .catch((err) => {
        if (active) {
          setSubmitError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [ticketId, token]);

  function handleChange(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setSuccessMessage('');

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

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = validateTicketForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    setSubmitError('');
    setSuccessMessage('');

    const normalized = normalizeTicketFormPayload(values);

    try {
      if (isEditing) {
        await updateTicket(ticketId, token, {
          title: normalized.title,
          description: normalized.description,
          category: normalized.category,
          priority: normalized.priority,
          status: normalized.status,
        });
        setSuccessMessage('Ticket updated.');
      } else {
        // The create endpoint sets the status itself and requires createdBy.
        const created = await createTicket(token, {
          title: normalized.title,
          description: normalized.description,
          category: normalized.category,
          priority: normalized.priority,
          createdBy: user?.email ?? '',
        });
        setSuccessMessage(`Ticket created with id ${created.id}.`);
        setValues(EMPTY_TICKET);
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <LoadingMessage message="Loading ticket…" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      {submitError && <ErrorMessage message={submitError} />}
      {successMessage && <p className="message success-message">{successMessage}</p>}

      <TicketFormWizard
        heading={isEditing ? 'Edit ticket' : 'New ticket'}
        values={values}
        errors={errors}
        saving={saving}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
