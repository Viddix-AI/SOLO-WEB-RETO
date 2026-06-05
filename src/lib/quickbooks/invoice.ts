import "server-only";
import { qboApi } from "./client";

/* eslint-disable @typescript-eslint/no-explicit-any */

const MV = "minorversion=70";

function esc(value: string): string {
  return value.replace(/'/g, "''");
}

async function query(statement: string): Promise<any> {
  return qboApi(`query?query=${encodeURIComponent(statement)}&${MV}`, "GET");
}

async function findIncomeAccountId(): Promise<string | undefined> {
  const r = await query("SELECT Id FROM Account WHERE AccountType = 'Income' MAXRESULTS 1");
  return r?.QueryResponse?.Account?.[0]?.Id;
}

async function findOrCreateItem(name: string): Promise<string> {
  const found = await query(`SELECT Id FROM Item WHERE Name = '${esc(name)}'`);
  const existing = found?.QueryResponse?.Item?.[0]?.Id;
  if (existing) return existing;

  const incomeAccountId = await findIncomeAccountId();
  const created = await qboApi<any>(`item?${MV}`, "POST", {
    Name: name,
    Type: "Service",
    IncomeAccountRef: incomeAccountId ? { value: incomeAccountId } : undefined,
  });
  return created.Item.Id;
}

export interface InvoiceCustomer {
  fname: string;
  lname: string;
  email?: string;
  phone?: string;
  country?: string;
  address?: { addr?: string; addr2?: string; city?: string; state?: string; zip?: string };
}

async function findOrCreateCustomer(c: InvoiceCustomer): Promise<string> {
  const displayName = `${c.fname} ${c.lname}`.trim() || c.email || "RETO Lead";
  const found = await query(`SELECT Id FROM Customer WHERE DisplayName = '${esc(displayName)}'`);
  const existing = found?.QueryResponse?.Customer?.[0]?.Id;
  if (existing) return existing;

  const created = await qboApi<any>(`customer?${MV}`, "POST", {
    DisplayName: displayName,
    GivenName: c.fname || undefined,
    FamilyName: c.lname || undefined,
    PrimaryEmailAddr: c.email ? { Address: c.email } : undefined,
    PrimaryPhone: c.phone ? { FreeFormNumber: c.phone } : undefined,
    BillAddr: c.address
      ? {
          Line1: c.address.addr || undefined,
          Line2: c.address.addr2 || undefined,
          City: c.address.city || undefined,
          CountrySubDivisionCode: c.address.state || undefined,
          PostalCode: c.address.zip || undefined,
          Country: c.country || undefined,
        }
      : undefined,
  });
  return created.Customer.Id;
}

export interface CreateInvoiceInput {
  customer: InvoiceCustomer;
  itemName: string;
  description?: string;
  unitPrice: number;
  qty: number;
  currency: "USD" | "EUR";
  billEmail?: string;
  /** Online card payment link (US-only). EU/LATAM = offline/concierge. */
  allowOnlinePayment: boolean;
  /** Internal reference that ties the request/lead to the invoice. */
  docNumber: string;
  memo?: string;
}

export interface CreatedInvoice {
  invoiceId: string;
  docNumber: string;
  emailed: boolean;
}

/**
 * Reusable: create a QBO Customer + Invoice (online payment enabled when allowed)
 * and email it so QBO delivers the pay link. Used by the chamber lead now and
 * ready for the protocol/book flow later.
 */
export async function createInvoiceWithLink(input: CreateInvoiceInput): Promise<CreatedInvoice> {
  const customerId = await findOrCreateCustomer(input.customer);
  const itemId = await findOrCreateItem(input.itemName);
  const amount = Number((input.unitPrice * input.qty).toFixed(2));

  const created = await qboApi<any>(`invoice?${MV}`, "POST", {
    CustomerRef: { value: customerId },
    DocNumber: input.docNumber.slice(0, 21),
    AllowOnlineCreditCardPayment: input.allowOnlinePayment,
    AllowOnlineACHPayment: false,
    CurrencyRef: { value: input.currency },
    BillEmail: input.billEmail ? { Address: input.billEmail } : undefined,
    CustomerMemo: input.memo ? { value: input.memo } : undefined,
    Line: [
      {
        DetailType: "SalesItemLineDetail",
        Amount: amount,
        Description: input.description,
        SalesItemLineDetail: {
          ItemRef: { value: itemId },
          Qty: input.qty,
          UnitPrice: input.unitPrice,
        },
      },
    ],
  });

  const invoiceId: string = created.Invoice.Id;

  let emailed = false;
  if (input.billEmail) {
    await qboApi(`invoice/${invoiceId}/send?sendTo=${encodeURIComponent(input.billEmail)}&${MV}`, "POST");
    emailed = true;
  }

  return { invoiceId, docNumber: input.docNumber, emailed };
}
