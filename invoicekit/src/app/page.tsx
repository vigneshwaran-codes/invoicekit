import { InvoiceCard } from "@/components/InvoiceCard";
import { InvoiceDraft } from "@/domain/invoice";

const mockDraft: InvoiceDraft = {
  id: "INV-1043",
  clientId: "client_ecoX",
  clientName: "ecommerce X company (x@mail.com)",
  currency: "INR",
  items: [
    {
      id: "i1",
      description: "Website Development",
      quantity: 12,
      unitPrice: 2500, // Dummy hourly rate
    }
  ],
  discount: { type: "fixed", value: 0 },
  taxConfig: { applyGST: true, isInterState: false, rate: 18 },
  paymentTerms: { type: "net", days: 15 },
  templateId: "elegant",
  status: "DRAFT",
  dueDate: "17 Oct 2026",
};

export default function Home() {
  return (
    <main className="min-h-screen p-8 sm:p-24 flex items-center justify-center bg-background text-foreground print:p-0 print:bg-white print:text-black print:block print:min-h-0">
      <div className="w-full max-w-4xl space-y-12 print:space-y-0 print:max-w-none">
        <div className="text-center space-y-4 print:hidden">
          <h1 className="text-4xl font-semibold tracking-tight">InvoiceKit AI Agent</h1>
          <p className="text-muted-foreground">Embedded MCP conversational invoice workflow.</p>
        </div>
        
        <InvoiceCard initialDraft={mockDraft} />
      </div>
    </main>
  );
}
