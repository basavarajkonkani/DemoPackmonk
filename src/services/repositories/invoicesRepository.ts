import { readList } from '../storage';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';
export type InvoiceType = 'GST Invoice' | 'Delivery Challan' | 'Packing Slip';

export interface Invoice {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  invoiceType: InvoiceType;
}

const STORE_NAME = 'invoices';

const SEED_INVOICES: Invoice[] = [
  {
    id: '1',
    orderNumber: 'PM-87612',
    date: '2024-01-15',
    amount: 126.0,
    gstAmount: 11.34,
    totalAmount: 152.34,
    status: 'paid',
    invoiceType: 'GST Invoice',
  },
  {
    id: '2',
    orderNumber: 'PM-92041',
    date: '2024-01-20',
    amount: 537.5,
    gstAmount: 48.37,
    totalAmount: 630.87,
    status: 'pending',
    invoiceType: 'GST Invoice',
  },
];

/** Invoices are derived documents generated from orders; this repository is
 * read-only from the app's perspective (a real backend would generate them
 * server-side when an order is placed/paid). */
export async function listInvoices(): Promise<Invoice[]> {
  return readList(STORE_NAME, SEED_INVOICES);
}
