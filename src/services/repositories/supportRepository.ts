import { readList, writeList, generateId } from '../storage';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

const STORE_NAME = 'support_tickets';

const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Issue with order delivery',
    message: 'My order ORD-1001 has not arrived yet. Expected delivery was 3 days ago.',
    status: 'open',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
  },
  {
    id: 'TKT-002',
    subject: 'Question about artwork approval',
    message: 'How long does it take for artwork to be reviewed and approved?',
    status: 'in_progress',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-21',
  },
  {
    id: 'TKT-003',
    subject: 'Invoice not received',
    message: 'I completed payment but have not received the invoice yet.',
    status: 'resolved',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
  },
];

export async function listTickets(): Promise<SupportTicket[]> {
  return readList(STORE_NAME, SEED_TICKETS);
}

export async function createTicket(input: { subject: string; message: string }): Promise<SupportTicket> {
  const all = await listTickets();
  const now = new Date().toISOString().split('T')[0];
  const ticket: SupportTicket = {
    id: generateId('TKT').replace('prod_', 'TKT-').slice(0, 10).toUpperCase(),
    subject: input.subject,
    message: input.message,
    status: 'open',
    createdAt: now,
    updatedAt: now,
  };
  await writeList(STORE_NAME, [ticket, ...all]);
  return ticket;
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<void> {
  const all = await listTickets();
  const updated = all.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString().split('T')[0] } : t));
  await writeList(STORE_NAME, updated);
}
