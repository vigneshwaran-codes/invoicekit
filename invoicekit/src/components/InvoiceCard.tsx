"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InvoiceDraft, calculateTotals, validateInvoice, TemplateId } from "@/domain/invoice";
import { cn } from "@/lib/utils";
import { InvoiceRenderer } from "./InvoiceTemplates";

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function InvoiceCard({ initialDraft }: { initialDraft: InvoiceDraft }) {
  const [draft, setDraft] = React.useState<InvoiceDraft>(initialDraft);
  const [isEditing, setIsEditing] = React.useState(false);
  const [workflowState, setWorkflowState] = React.useState<"review" | "confirm" | "issued">("review");
  const [downloadState, setDownloadState] = React.useState<"idle" | "downloading" | "done">("idle");
  const [emailState, setEmailState] = React.useState<"idle" | "sending" | "done">("idle");

  const totals = calculateTotals(draft);
  const validation = validateInvoice(draft);

  const handleTemplateChange = (t: TemplateId) => {
    setDraft((prev) => ({ ...prev, templateId: t }));
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    }));
  };

  const issueInvoice = async () => {
    // In a real app, this hits the backend /finalize_invoice
    setWorkflowState("issued");
    setDraft((prev) => ({ ...prev, status: "ISSUED" }));
  };

  const handleDownloadPdf = () => {
    setDownloadState("downloading");
    setTimeout(() => {
      window.print();
      setDownloadState("done");
    }, 500);
  };

  const handleSendEmail = () => {
    setEmailState("sending");
    setTimeout(() => {
      const subject = encodeURIComponent(`Invoice ${draft.id}`);
      const body = encodeURIComponent(`Hi there,\n\nPlease find attached the invoice ${draft.id} for the total amount of ${INR.format(totals.total)}.\n\nThank you for your business!`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      setEmailState("done");
    }, 500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden bg-card/80 backdrop-blur-md shadow-xl border-white/20 print:shadow-none print:border-none print:bg-transparent print:max-w-none print:m-0">
      <CardHeader className="border-b border-border/50 bg-muted/20 print:hidden">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {draft.status === "ISSUED" ? "Invoice Issued" : "Invoice Draft"}
            </h2>
            <p className="text-xl font-medium mt-1">{draft.id}</p>
          </div>
          {workflowState !== "issued" && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Done Editing" : "Edit Details"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-8 print:p-0">
        <AnimatePresence mode="wait">
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              {workflowState === "confirm" && (
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 p-4 rounded-lg mb-6 flex justify-between items-center backdrop-blur-sm print:hidden">
                  <div>
                    <h3 className="font-semibold text-lg">Ready to issue</h3>
                    <p className="text-sm opacity-80">Review the final template below before issuing.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80 uppercase tracking-widest font-semibold mb-1">Total Due</p>
                    <p className="text-2xl font-bold">{INR.format(totals.total)}</p>
                  </div>
                </div>
              )}
              <InvoiceRenderer
                draft={draft}
                totals={totals}
                isEditing={isEditing && workflowState === "review"}
                setDraft={setDraft}
                handleItemChange={handleItemChange}
              />
            </motion.div>
        </AnimatePresence>

        {isEditing && workflowState !== "issued" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 pt-6 border-t border-border space-y-4 print:hidden"
          >
            {!validation.isValid && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                <p className="font-semibold mb-1">Please fix errors:</p>
                <ul className="list-disc pl-4">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <h4 className="text-sm font-semibold">Template Settings</h4>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={draft.templateId === "minimal" ? "default" : "secondary"} onClick={() => handleTemplateChange("minimal")}>Minimal</Button>
              <Button size="sm" variant={draft.templateId === "elegant" ? "default" : "secondary"} onClick={() => handleTemplateChange("elegant")}>Elegant</Button>
              <Button size="sm" variant={draft.templateId === "studio" ? "default" : "secondary"} onClick={() => handleTemplateChange("studio")}>Studio</Button>
              <Button size="sm" variant={draft.templateId === "weaver" ? "default" : "secondary"} onClick={() => handleTemplateChange("weaver")}>Weaver</Button>
              <Button size="sm" variant={draft.templateId === "analog" ? "default" : "secondary"} onClick={() => handleTemplateChange("analog")}>Analog</Button>
              <Button size="sm" variant={draft.templateId === "elevant" ? "default" : "secondary"} onClick={() => handleTemplateChange("elevant")}>Elevant</Button>
            </div>
          </motion.div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/10 border-t border-border/50 py-4 flex justify-end gap-3 print:hidden">
        {workflowState === "review" && (
          <Button 
            disabled={!validation.isValid}
            onClick={() => setWorkflowState("confirm")}
          >
            Preview & Confirm
          </Button>
        )}
        {workflowState === "confirm" && (
          <>
            <Button variant="ghost" onClick={() => setWorkflowState("review")}>Cancel</Button>
            <Button onClick={issueInvoice}>Issue Invoice</Button>
          </>
        )}
        {workflowState === "issued" && (
          <>
            <Button variant="secondary" onClick={handleDownloadPdf} disabled={downloadState !== "idle"}>
              {downloadState === "idle" ? "Download PDF" : downloadState === "downloading" ? "Downloading..." : "PDF Downloaded!"}
            </Button>
            <Button onClick={handleSendEmail} disabled={emailState !== "idle"}>
              {emailState === "idle" ? "Send via Email" : emailState === "sending" ? "Sending..." : "Email Sent!"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
