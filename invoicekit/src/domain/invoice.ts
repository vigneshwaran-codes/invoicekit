export type TemplateId = "minimal" | "elegant" | "analog" | "weaver" | "studio" | "elevant";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceDraft {
  id: string;
  clientId: string;
  clientName: string;
  currency: string;
  items: LineItem[];
  discount: { type: "fixed" | "percentage"; value: number };
  taxConfig: { applyGST: boolean; isInterState: boolean; rate: number };
  paymentTerms: { type: "net"; days: number };
  templateId: TemplateId;
  status: "DRAFT" | "READY_FOR_CONFIRMATION" | "ISSUED";
  dueDate: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export function calculateTotals(draft: InvoiceDraft): InvoiceTotals {
  const subtotal = draft.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  
  let discountAmount = 0;
  if (draft.discount.type === "fixed") {
    discountAmount = draft.discount.value;
  } else if (draft.discount.type === "percentage") {
    discountAmount = subtotal * (draft.discount.value / 100);
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (draft.taxConfig.applyGST) {
    if (draft.taxConfig.isInterState) {
      igst = taxableAmount * (draft.taxConfig.rate / 100);
    } else {
      const halfRate = draft.taxConfig.rate / 2;
      cgst = taxableAmount * (halfRate / 100);
      sgst = taxableAmount * (halfRate / 100);
    }
  }

  const total = taxableAmount + cgst + sgst + igst;

  return { subtotal, discountAmount, taxableAmount, cgst, sgst, igst, total };
}

export function validateInvoice(draft: InvoiceDraft): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!draft.clientName) errors.push("Client name is required.");
  if (draft.items.length === 0) errors.push("At least one line item is required.");
  for (const item of draft.items) {
    if (item.quantity <= 0) errors.push(`Item '${item.description}' quantity must be > 0.`);
    if (item.unitPrice < 0) errors.push(`Item '${item.description}' price must be >= 0.`);
  }

  return { isValid: errors.length === 0, errors };
}
