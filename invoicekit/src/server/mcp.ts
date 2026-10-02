import { InvoiceDraft } from "../domain/invoice";

// Minimal local memory store for the MCP server
const db = {
  invoices: new Map<string, InvoiceDraft>(),
  quotes: new Map<string, any>(),
  payments: new Map<string, any>()
};

export async function create_invoice_draft(input: any) {
  const id = `INV-${Math.floor(Math.random() * 10000)}`;
  const draft: InvoiceDraft = {
    id,
    clientId: input.clientId || "unknown",
    clientName: input.clientName || "Unnamed Client",
    currency: input.currency || "INR",
    items: input.items || [],
    discount: input.discount || { type: "fixed", value: 0 },
    taxConfig: input.taxConfig || { applyGST: false, isInterState: false, rate: 0 },
    paymentTerms: input.paymentTerms || { type: "net", days: 15 },
    templateId: input.templateId || "minimal",
    status: "DRAFT",
    dueDate: input.dueDate || new Date(Date.now() + 15 * 86400000).toLocaleDateString()
  };
  
  db.invoices.set(id, draft);
  return { success: true, draft };
}

export async function validate_invoice_draft(draftId: string, draft: any) {
  const errors = [];
  if (!draft.clientName) errors.push("Missing clientName");
  if (!draft.items || draft.items.length === 0) errors.push("Missing items");
  return { valid: errors.length === 0, errors };
}

export async function finalize_invoice(id: string, confirmationToken: string) {
  const draft = db.invoices.get(id);
  if (!draft) throw new Error("Invoice not found");
  draft.status = "ISSUED";
  db.invoices.set(id, draft);
  return { success: true, message: `Invoice ${id} finalized.`, invoice: draft };
}

export async function generate_invoice_pdf(invoiceId: string, templateId: string) {
  return { success: true, message: `PDF generated for ${invoiceId} using ${templateId} template.`, url: `/invoices/${invoiceId}.pdf` };
}

export async function send_invoice(invoiceId: string, recipient: string) {
  return { success: true, message: `Invoice ${invoiceId} sent to ${recipient}` };
}

export async function create_quote(input: any) {
  const id = `QT-${Math.floor(Math.random() * 10000)}`;
  db.quotes.set(id, { id, ...input });
  return { success: true, quoteId: id };
}

export async function convert_quote_to_invoice(quoteId: string) {
  const quote = db.quotes.get(quoteId);
  if (!quote) throw new Error("Quote not found");
  const invoice = await create_invoice_draft(quote);
  return { success: true, message: "Quote converted to invoice", invoiceId: invoice.draft.id };
}

export async function send_payment_reminder(invoiceId: string) {
  return { success: true, message: `Reminder sent for invoice ${invoiceId}` };
}

export async function mark_paid(invoiceId: string, amount: number) {
  return { success: true, message: `Invoice ${invoiceId} marked as paid for amount ${amount}` };
}

export async function reconcile_payment(paymentId: string, invoiceId: string) {
  return { success: true, message: `Payment ${paymentId} reconciled with invoice ${invoiceId}` };
}
