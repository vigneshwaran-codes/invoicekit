import * as React from "react";
import { Input } from "./ui/input";
import { InvoiceDraft, InvoiceTotals, TemplateId } from "@/domain/invoice";
import { cn } from "@/lib/utils";

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

interface InvoiceTemplateProps {
  draft: InvoiceDraft;
  totals: InvoiceTotals;
  isEditing: boolean;
  setDraft: React.Dispatch<React.SetStateAction<InvoiceDraft>>;
  handleItemChange: (id: string, field: string, value: string | number) => void;
}

export function InvoiceRenderer(props: InvoiceTemplateProps) {
  switch (props.draft.templateId) {
    case "minimal": return <MinimalTemplate {...props} />;
    case "elegant": return <ElegantTemplate {...props} />;
    case "studio": return <StudioTemplate {...props} />;
    case "weaver": return <WeaverTemplate {...props} />;
    case "analog": return <AnalogTemplate {...props} />;
    case "elevant": return <ElevantTemplate {...props} />;
    default: return <MinimalTemplate {...props} />;
  }
}

// Editable Fields Helper
const EditableText = ({ 
  isEditing, 
  value, 
  onChange, 
  className 
}: { 
  isEditing: boolean; 
  value: string; 
  onChange: (v: string) => void; 
  className?: string; 
}) => {
  if (isEditing) {
    return (
      <Input 
        className={cn("h-7 px-2 text-sm", className)} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    );
  }
  return <span className={className}>{value}</span>;
};

// 1. Minimal Template
function MinimalTemplate({ draft, totals, isEditing, setDraft, handleItemChange }: InvoiceTemplateProps) {
  return (
    <div className="font-sans bg-white text-black p-8 shadow-sm">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">Billed To</p>
          <EditableText isEditing={isEditing} value={draft.clientName} onChange={(v) => setDraft({...draft, clientName: v})} className="text-xl font-medium block" />
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-serif tracking-widest mb-4">INVOICE</h1>
          <div className="text-sm text-gray-600">
            <p>Invoice No: {draft.id}</p>
            <div className="flex justify-end gap-2 items-center mt-1">
              <span>Date:</span>
              <EditableText isEditing={isEditing} value={draft.dueDate} onChange={(v) => setDraft({...draft, dueDate: v})} className="w-24 text-right" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-black text-white flex justify-between p-3 text-sm font-medium tracking-wide">
          <div className="flex-1">Item</div>
          <div className="w-24 text-center">Quantity</div>
          <div className="w-32 text-right">Price</div>
          <div className="w-32 text-right">Amount</div>
        </div>
        {draft.items.map((item) => (
          <div key={item.id} className="flex justify-between p-3 border-b border-gray-100 text-sm">
            <div className="flex-1">
              <EditableText isEditing={isEditing} value={item.description} onChange={(v) => handleItemChange(item.id, "description", v)} />
            </div>
            <div className="w-24 text-center">
              {isEditing ? (
                <Input type="number" className="h-7 px-1 text-center w-16 mx-auto" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))} />
              ) : item.quantity}
            </div>
            <div className="w-32 text-right">
              {isEditing ? (
                <Input type="number" className="h-7 px-1 text-right w-24 ml-auto" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))} />
              ) : INR.format(item.unitPrice)}
            </div>
            <div className="w-32 text-right font-medium">{INR.format(item.quantity * item.unitPrice)}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{INR.format(totals.subtotal)}</span></div>
          {totals.taxableAmount !== totals.subtotal && (
            <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-{INR.format(totals.discountAmount)}</span></div>
          )}
          {totals.cgst > 0 && <div className="flex justify-between"><span className="text-gray-500">CGST (9%)</span><span>{INR.format(totals.cgst)}</span></div>}
          {totals.sgst > 0 && <div className="flex justify-between"><span className="text-gray-500">SGST (9%)</span><span>{INR.format(totals.sgst)}</span></div>}
          {totals.igst > 0 && <div className="flex justify-between"><span className="text-gray-500">IGST (18%)</span><span>{INR.format(totals.igst)}</span></div>}
          <div className="flex justify-between text-xl font-semibold border-t border-black pt-2 mt-2">
            <span>Total</span><span>{INR.format(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Elegant Template
function ElegantTemplate({ draft, totals, isEditing, setDraft, handleItemChange }: InvoiceTemplateProps) {
  return (
    <div className="font-sans bg-white text-black p-8 border shadow-sm">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase">ELEGANT<br/><span className="text-gray-400 font-normal">SOLUTIONS</span></h2>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold tracking-widest uppercase mb-4">INVOICE</h1>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Invoice No</div>
          <div className="text-sm font-medium mb-3">{draft.id}</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Date</div>
          <div className="text-sm font-medium">
             <EditableText isEditing={isEditing} value={draft.dueDate} onChange={(v) => setDraft({...draft, dueDate: v})} />
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 border-b border-black pb-2">Billed To</div>
        <EditableText isEditing={isEditing} value={draft.clientName} onChange={(v) => setDraft({...draft, clientName: v})} className="text-lg font-bold block" />
      </div>

      <div className="mb-8">
        <div className="flex justify-between pb-2 border-b-2 border-black text-xs font-bold uppercase tracking-widest">
          <div className="flex-1">Description</div>
          <div className="w-20 text-center">Qty</div>
          <div className="w-28 text-right">Price</div>
          <div className="w-32 text-right">Amount</div>
        </div>
        {draft.items.map((item) => (
          <div key={item.id} className="flex justify-between py-4 border-b border-gray-200 text-sm">
            <div className="flex-1 font-medium">
              <EditableText isEditing={isEditing} value={item.description} onChange={(v) => handleItemChange(item.id, "description", v)} />
            </div>
            <div className="w-20 text-center text-gray-600">
              {isEditing ? (
                <Input type="number" className="h-7 px-1 text-center w-16 mx-auto" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))} />
              ) : item.quantity}
            </div>
            <div className="w-28 text-right text-gray-600">
              {isEditing ? (
                <Input type="number" className="h-7 px-1 text-right w-24 ml-auto" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))} />
              ) : INR.format(item.unitPrice)}
            </div>
            <div className="w-32 text-right font-bold">{INR.format(item.quantity * item.unitPrice)}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500 font-bold uppercase text-xs">Subtotal</span><span className="font-medium">{INR.format(totals.subtotal)}</span></div>
          <div className="flex justify-between pt-2"><span className="font-bold uppercase text-xs">Total Due</span><span className="text-xl font-bold">{INR.format(totals.total)}</span></div>
        </div>
      </div>
    </div>
  );
}

// 3. Studio Template
function StudioTemplate({ draft, totals, isEditing, setDraft, handleItemChange }: InvoiceTemplateProps) {
  return (
    <div className="font-serif bg-[#f9f9f9] text-[#222] p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold tracking-widest uppercase">STUDIO & GALLERY</h1>
        <div className="text-2xl font-light tracking-widest uppercase">INVOICE</div>
      </div>

      <div className="bg-[#111] text-white p-6 flex justify-between items-center mb-8">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Invoice To</div>
          <EditableText isEditing={isEditing} value={draft.clientName} onChange={(v) => setDraft({...draft, clientName: v})} className="text-lg font-medium block" />
        </div>
        <div className="text-right">
           <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Date</div>
           <EditableText isEditing={isEditing} value={draft.dueDate} onChange={(v) => setDraft({...draft, dueDate: v})} className="text-lg font-medium block" />
        </div>
      </div>

      <div className="mb-8 bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
          <div className="flex-1">Description</div>
          <div className="w-24 text-center">Quantity</div>
          <div className="w-32 text-right">Price</div>
          <div className="w-32 text-right">Total</div>
        </div>
        {draft.items.map((item) => (
          <div key={item.id} className="flex justify-between py-3 border-b border-gray-50 text-sm">
            <div className="flex-1">
              <EditableText isEditing={isEditing} value={item.description} onChange={(v) => handleItemChange(item.id, "description", v)} />
            </div>
            <div className="w-24 text-center text-gray-500">
              {isEditing ? (
                <Input type="number" className="h-7 px-1 text-center w-16 mx-auto" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))} />
              ) : item.quantity}
            </div>
            <div className="w-32 text-right text-gray-500">
              {isEditing ? (
                <Input type="number" className="h-7 px-1 text-right w-24 ml-auto" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))} />
              ) : INR.format(item.unitPrice)}
            </div>
            <div className="w-32 text-right font-medium">{INR.format(item.quantity * item.unitPrice)}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end">
        <div className="text-sm text-gray-500">Thank you for your business.</div>
        <div className="w-72 bg-white p-6 shadow-sm border border-gray-100 space-y-3 text-sm">
           <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{INR.format(totals.subtotal)}</span></div>
           <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-100">
              <span>Total</span><span>{INR.format(totals.total)}</span>
           </div>
        </div>
      </div>
    </div>
  );
}

// 4. Weaver Template
function WeaverTemplate({ draft, totals, isEditing, setDraft, handleItemChange }: InvoiceTemplateProps) {
  return (
    <div className="font-sans bg-white text-[#333] shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5a36] opacity-10 rounded-bl-full"></div>
      
      <div className="p-10 pb-0">
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff5a36] rounded-sm transform rotate-45 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <h1 className="text-2xl font-bold tracking-wider uppercase text-gray-800">WEAVER</h1>
          </div>
          <div className="text-right">
             <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-1">Invoice</h2>
             <div className="text-xl font-medium">{draft.id}</div>
          </div>
        </div>

        <div className="mb-12">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Billed To</div>
          <EditableText isEditing={isEditing} value={draft.clientName} onChange={(v) => setDraft({...draft, clientName: v})} className="text-2xl font-light block mb-2" />
          <div className="flex gap-2 items-center text-sm text-gray-500">
            <span>Due Date:</span>
            <EditableText isEditing={isEditing} value={draft.dueDate} onChange={(v) => setDraft({...draft, dueDate: v})} className="font-medium text-[#ff5a36]" />
          </div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between pb-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-widest">
            <div className="flex-1">Description</div>
            <div className="w-20 text-center">Qty</div>
            <div className="w-28 text-right">Price</div>
            <div className="w-32 text-right">Amount</div>
          </div>
          {draft.items.map((item) => (
            <div key={item.id} className="flex justify-between py-4 border-b border-gray-100 text-sm">
              <div className="flex-1 font-medium">
                <EditableText isEditing={isEditing} value={item.description} onChange={(v) => handleItemChange(item.id, "description", v)} />
              </div>
              <div className="w-20 text-center text-gray-500">
                 {isEditing ? <Input type="number" className="h-7 px-1 text-center w-16 mx-auto" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))} /> : item.quantity}
              </div>
              <div className="w-28 text-right text-gray-500">
                 {isEditing ? <Input type="number" className="h-7 px-1 text-right w-24 ml-auto" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))} /> : INR.format(item.unitPrice)}
              </div>
              <div className="w-32 text-right font-semibold">{INR.format(item.quantity * item.unitPrice)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f8f9fa] p-10 flex justify-between items-center border-t border-gray-100">
         <div className="text-sm text-gray-500">
            Please pay within 15 days of receiving this invoice.
         </div>
         <div className="flex items-center gap-6">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Total Due</div>
            <div className="text-3xl font-bold text-[#ff5a36]">{INR.format(totals.total)}</div>
         </div>
      </div>
    </div>
  );
}

// 5. Analog Template
function AnalogTemplate({ draft, totals, isEditing, setDraft, handleItemChange }: InvoiceTemplateProps) {
  return (
    <div className="font-sans bg-[#f4f4f5] text-[#111] p-8 shadow-sm relative overflow-hidden min-h-[600px]">
      <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
      
      <div className="relative z-10">
        <h1 className="text-6xl font-black tracking-tighter text-blue-900/90 mb-2">INVOICE</h1>
        <div className="flex justify-between items-center border-b-2 border-blue-900/20 pb-4 mb-8">
           <h2 className="text-xl font-bold tracking-widest text-blue-900/80 uppercase">PUBLIC ANALOG™</h2>
           <div className="text-right">
              <div className="text-xs uppercase tracking-widest font-bold text-gray-500">Invoice No: {draft.id}</div>
           </div>
        </div>

        <div className="flex justify-between mb-12">
          <div className="space-y-1">
             <div className="text-xs uppercase tracking-widest font-bold text-gray-500">Billed To</div>
             <EditableText isEditing={isEditing} value={draft.clientName} onChange={(v) => setDraft({...draft, clientName: v})} className="text-xl font-black block" />
          </div>
          <div className="text-right space-y-1">
             <div className="text-xs uppercase tracking-widest font-bold text-gray-500">Date Due</div>
             <EditableText isEditing={isEditing} value={draft.dueDate} onChange={(v) => setDraft({...draft, dueDate: v})} className="text-lg font-bold block" />
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 pb-2 border-b border-blue-900/10">
            <div className="flex-1">Description</div>
            <div className="w-20 text-center">Qty</div>
            <div className="w-32 text-right">Price</div>
            <div className="w-32 text-right">Amount</div>
          </div>
          {draft.items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 border-b border-blue-900/5 text-sm font-medium">
              <div className="flex-1">
                 <EditableText isEditing={isEditing} value={item.description} onChange={(v) => handleItemChange(item.id, "description", v)} />
              </div>
              <div className="w-20 text-center">
                 {isEditing ? <Input type="number" className="h-7 px-1 text-center w-16 mx-auto bg-transparent border-blue-200" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))} /> : item.quantity}
              </div>
              <div className="w-32 text-right">
                 {isEditing ? <Input type="number" className="h-7 px-1 text-right w-24 ml-auto bg-transparent border-blue-200" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))} /> : INR.format(item.unitPrice)}
              </div>
              <div className="w-32 text-right font-bold text-blue-900">{INR.format(item.quantity * item.unitPrice)}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-end">
           <div className="text-4xl font-black tracking-tighter text-blue-900/20">THANK YOU</div>
           <div className="text-right">
              <div className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Total Amount</div>
              <div className="text-5xl font-black tracking-tighter text-blue-900">{INR.format(totals.total)}</div>
           </div>
        </div>
      </div>
    </div>
  );
}

// 6. Elevant Template
function ElevantTemplate({ draft, totals, isEditing, setDraft, handleItemChange }: InvoiceTemplateProps) {
  return (
    <div className="font-sans bg-white text-gray-900 p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-16 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-black"></div>
          <h2 className="text-2xl font-bold tracking-widest uppercase">ELEVANT</h2>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-light tracking-widest uppercase mb-1">INVOICE</h1>
          <div className="text-sm text-gray-400"># {draft.id}</div>
        </div>
      </div>

      <div className="flex justify-between mb-12">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Bill To</div>
          <EditableText isEditing={isEditing} value={draft.clientName} onChange={(v) => setDraft({...draft, clientName: v})} className="text-lg font-medium block" />
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Date</div>
          <EditableText isEditing={isEditing} value={draft.dueDate} onChange={(v) => setDraft({...draft, dueDate: v})} className="text-lg font-medium block" />
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between pb-3 border-b-2 border-black text-xs font-bold uppercase tracking-widest">
          <div className="flex-1">Description</div>
          <div className="w-24 text-center">Hours/Qty</div>
          <div className="w-32 text-right">Rate</div>
          <div className="w-32 text-right">Total</div>
        </div>
        {draft.items.map((item) => (
          <div key={item.id} className="flex justify-between py-4 border-b border-gray-100 text-sm">
            <div className="flex-1 font-medium text-gray-700">
              <EditableText isEditing={isEditing} value={item.description} onChange={(v) => handleItemChange(item.id, "description", v)} />
            </div>
            <div className="w-24 text-center text-gray-500">
              {isEditing ? <Input type="number" className="h-7 px-1 text-center w-16 mx-auto" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))} /> : item.quantity}
            </div>
            <div className="w-32 text-right text-gray-500">
              {isEditing ? <Input type="number" className="h-7 px-1 text-right w-24 ml-auto" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))} /> : INR.format(item.unitPrice)}
            </div>
            <div className="w-32 text-right font-medium">{INR.format(item.quantity * item.unitPrice)}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <div className="w-72 bg-gray-50 p-6 rounded-lg">
           <div className="flex justify-between text-sm mb-3 text-gray-600">
             <span>Subtotal</span><span>{INR.format(totals.subtotal)}</span>
           </div>
           <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
             <span>TOTAL</span><span>{INR.format(totals.total)}</span>
           </div>
        </div>
      </div>
    </div>
  );
}
