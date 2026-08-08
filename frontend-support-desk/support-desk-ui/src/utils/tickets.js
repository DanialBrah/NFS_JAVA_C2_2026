// Search matches title or category; status 'ALL' bypasses the status check.
// Ticket status is not always stored upper case, so it is normalised before comparing.
export function filterTickets(tickets, searchText, statusFilter) {
  const query = (searchText ?? '').toLowerCase();

  return tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'ALL' || ticket.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });
}
