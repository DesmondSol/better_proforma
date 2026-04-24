
import { GoogleGenAI, Type } from "@google/genai";
import { Invoice, Client, InvoiceItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface ExtractedInvoiceData {
  client: Partial<Client>;
  items: Partial<InvoiceItem>[];
  invoiceNumber?: string;
  date?: string;
  vatRate?: number;
  isQuotation?: boolean;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    client: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        companyName: { type: Type.STRING },
        tin: { type: Type.STRING },
        phone: { type: Type.STRING },
        email: { type: Type.STRING },
        address: { type: Type.STRING },
      },
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER },
        },
        required: ["name", "quantity", "unitPrice"],
      },
    },
    invoiceNumber: { type: Type.STRING },
    date: { type: Type.STRING, description: "ISO format date if possible" },
    vatRate: { type: Type.NUMBER, description: "VAT percentage (e.g. 15)" },
    isQuotation: { type: Type.BOOLEAN },
  },
};

export const extractInvoiceData = async (base64DataWithPrefix: string, mimeType: string = "image/jpeg"): Promise<ExtractedInvoiceData> => {
  // Remove data:mime;base64, prefix if present
  const base64Data = base64DataWithPrefix.split(',')[1] || base64DataWithPrefix;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        {
          text: "Extract all relevant information from this document. Focus on client details, itemized list, VAT, and dates. If it's a quotation or proforma, set isQuotation to true.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  try {
    const data = JSON.parse(response.text);
    return data as ExtractedInvoiceData;
  } catch (error) {
    console.error("Failed to parse OCR response:", error);
    throw new Error("Could not extract data from the document. Please try again or enter manually.");
  }
};

export const extractDataFromText = async (text: string): Promise<ExtractedInvoiceData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          text: `Extract all relevant information from the following text which represents an invoice or proforma. Focus on client details, itemized list, VAT, and dates. If it's a quotation or proforma, set isQuotation to true.\n\nDOCUMENT TEXT:\n${text}`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  try {
    const data = JSON.parse(response.text);
    return data as ExtractedInvoiceData;
  } catch (error) {
    console.error("Failed to parse text extraction response:", error);
    throw new Error("Could not extract data from the text. Please try again or enter manually.");
  }
};
