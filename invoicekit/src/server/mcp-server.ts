import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import * as mcpFunctions from "./mcp";

const server = new Server(
  {
    name: "invoicekit",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_invoice_draft",
        description: "Create an invoice draft from natural language input.",
        inputSchema: {
          type: "object",
          properties: { 
            input: { 
              type: "object",
              properties: {
                clientName: { type: "string" },
                items: { 
                  type: "array", 
                  items: { 
                    type: "object", 
                    properties: { 
                      description: { type: "string" }, 
                      quantity: { type: "number" }, 
                      unitPrice: { type: "number" } 
                    } 
                  }
                }
              },
              required: ["clientName", "items"]
            } 
          },
          required: ["input"],
        },
      },
      {
        name: "validate_invoice_draft",
        description: "Validate an invoice draft object.",
        inputSchema: {
          type: "object",
          properties: { 
            draftId: { type: "string" },
            draft: { type: "object" } 
          },
          required: ["draftId", "draft"],
        },
      },
      {
        name: "finalize_invoice",
        description: "Finalize an invoice and transition it to ISSUED status.",
        inputSchema: {
          type: "object",
          properties: { 
            id: { type: "string" },
            confirmationToken: { type: "string" }
          },
          required: ["id", "confirmationToken"],
        },
      },
      {
        name: "generate_invoice_pdf",
        description: "Generate a PDF for an invoice with a specific template.",
        inputSchema: {
          type: "object",
          properties: { 
            invoiceId: { type: "string" },
            templateId: { type: "string" }
          },
          required: ["invoiceId", "templateId"],
        },
      },
      {
        name: "send_invoice",
        description: "Send an invoice to a recipient.",
        inputSchema: {
          type: "object",
          properties: { 
            invoiceId: { type: "string" },
            recipient: { type: "string" }
          },
          required: ["invoiceId", "recipient"],
        },
      },
      {
        name: "create_quote",
        description: "Create a quote.",
        inputSchema: {
          type: "object",
          properties: { input: { type: "object" } },
          required: ["input"],
        },
      },
      {
        name: "convert_quote_to_invoice",
        description: "Convert a quote to an invoice.",
        inputSchema: {
          type: "object",
          properties: { quoteId: { type: "string" } },
          required: ["quoteId"],
        },
      },
      {
        name: "send_payment_reminder",
        description: "Send a payment reminder for an invoice.",
        inputSchema: {
          type: "object",
          properties: { invoiceId: { type: "string" } },
          required: ["invoiceId"],
        },
      },
      {
        name: "mark_paid",
        description: "Mark an invoice as paid.",
        inputSchema: {
          type: "object",
          properties: { 
            invoiceId: { type: "string" },
            amount: { type: "number" }
          },
          required: ["invoiceId", "amount"],
        },
      },
      {
        name: "reconcile_payment",
        description: "Reconcile a payment with an invoice.",
        inputSchema: {
          type: "object",
          properties: { 
            paymentId: { type: "string" },
            invoiceId: { type: "string" }
          },
          required: ["paymentId", "invoiceId"],
        },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const args = request.params.arguments || {};
  
  try {
    let result;
    switch (request.params.name) {
      case "create_invoice_draft":
        result = await mcpFunctions.create_invoice_draft(args.input || args);
        break;
      case "validate_invoice_draft":
        result = await mcpFunctions.validate_invoice_draft(args.draftId as string, args.draft as any);
        break;
      case "finalize_invoice":
        result = await mcpFunctions.finalize_invoice(args.id as string, args.confirmationToken as string);
        break;
      case "generate_invoice_pdf":
        result = await mcpFunctions.generate_invoice_pdf(args.invoiceId as string, args.templateId as string);
        break;
      case "send_invoice":
        result = await mcpFunctions.send_invoice(args.invoiceId as string, args.recipient as string);
        break;
      case "create_quote":
        result = await mcpFunctions.create_quote(args.input || args);
        break;
      case "convert_quote_to_invoice":
        result = await mcpFunctions.convert_quote_to_invoice(args.quoteId as string);
        break;
      case "send_payment_reminder":
        result = await mcpFunctions.send_payment_reminder(args.invoiceId as string);
        break;
      case "mark_paid":
        result = await mcpFunctions.mark_paid(args.invoiceId as string, args.amount as number);
        break;
      case "reconcile_payment":
        result = await mcpFunctions.reconcile_payment(args.paymentId as string, args.invoiceId as string);
        break;
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("InvoiceKit MCP Server running on stdio");
}

run().catch(console.error);
