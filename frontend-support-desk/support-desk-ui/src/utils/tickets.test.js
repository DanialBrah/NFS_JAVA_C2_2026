import { filterTickets } from './tickets';

const sampleTickets = [
  { id: 'T001', title: 'Cannot access email', category: 'Email', status: 'OPEN', priority: 'HIGH' },
  { id: 'T002', title: 'Laptop running slowly', category: 'Hardware', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: 'T003', title: 'Password reset request', category: 'Account', status: 'CLOSED', priority: 'LOW' },
];

describe('filterTickets', () => {
  it('filters by search text matching the title', () => {
    const result = filterTickets(sampleTickets, 'laptop', 'ALL');
    expect(result).toEqual([sampleTickets[1]]);
  });

  it('filters by search text matching the category', () => {
    const result = filterTickets(sampleTickets, 'account', 'ALL');
    expect(result).toEqual([sampleTickets[2]]);
  });

  it('filters by status', () => {
    const result = filterTickets(sampleTickets, '', 'CLOSED');
    expect(result).toEqual([sampleTickets[2]]);
  });

  it('filters by search text and status together', () => {
    const result = filterTickets(sampleTickets, 'password', 'CLOSED');
    expect(result).toEqual([sampleTickets[2]]);
  });

  it('returns no tickets when search text matches but status does not', () => {
    const result = filterTickets(sampleTickets, 'password', 'OPEN');
    expect(result).toEqual([]);
  });

  it('returns all tickets when search is empty and status is ALL', () => {
    const result = filterTickets(sampleTickets, '', 'ALL');
    expect(result).toEqual(sampleTickets);
  });
});
