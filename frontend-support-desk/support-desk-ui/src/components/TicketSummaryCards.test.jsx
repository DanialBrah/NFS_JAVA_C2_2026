import { render, screen } from '@testing-library/react';
import TicketSummaryCards from './TicketSummaryCards';

const sampleTickets = [
  { id: 'T001', status: 'OPEN' },
  { id: 'T002', status: 'OPEN' },
  { id: 'T003', status: 'IN_PROGRESS' },
  { id: 'T004', status: 'CLOSED' },
  { id: 'T005', status: 'CLOSED' },
];

function cardFor(label) {
  return screen.getByText(label).closest('.summary-card');
}

describe('TicketSummaryCards', () => {
  it('renders a card for each summary label', () => {
    render(<TicketSummaryCards tickets={sampleTickets} />);

    expect(screen.getByText('Total Tickets')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('displays the correct count for each status', () => {
    render(<TicketSummaryCards tickets={sampleTickets} />);

    expect(cardFor('Total Tickets')).toHaveTextContent('5');
    expect(cardFor('Open')).toHaveTextContent('2');
    expect(cardFor('In Progress')).toHaveTextContent('1');
    expect(cardFor('Closed')).toHaveTextContent('2');
  });

  it('recalculates counts when the ticket list changes', () => {
    const { rerender } = render(<TicketSummaryCards tickets={sampleTickets} />);
    expect(cardFor('Open')).toHaveTextContent('2');

    rerender(<TicketSummaryCards tickets={[{ id: 'T006', status: 'OPEN' }]} />);

    expect(cardFor('Total Tickets')).toHaveTextContent('1');
    expect(cardFor('Open')).toHaveTextContent('1');
    expect(cardFor('In Progress')).toHaveTextContent('0');
    expect(cardFor('Closed')).toHaveTextContent('0');
  });

  it('renders zero counts when there are no tickets', () => {
    render(<TicketSummaryCards tickets={[]} />);

    expect(cardFor('Total Tickets')).toHaveTextContent('0');
  });
});
