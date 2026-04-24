
export type TemplateId = 'classic' | 'modern' | 'bold' | 'elegant' | 'minimalist' | 'custom';

export interface BankAccount {
  id: string;
  bankName: string; // e.g., CBE, Dashen, Telebirr
  accountNumber: string;
  accountName: string;
  isVisible: boolean;
  type: 'bank' | 'wallet';
}

export interface UserProfile {
  id: string;
  businessName: string;
  logoURL: string; // base64 string
  tin: string;
  address: string;
  phone: string;
  email: string;
  stampURL: string; // base64 string
  signatureURL: string; // base64 string
  templateId: TemplateId;
  currency: string;
  language?: 'en' | 'am';
  
  // Custom Template Assets
  customBackgroundURL?: string; // Full A4 background
  customHeaderURL?: string;     // Header image
  customFooterURL?: string;     // Footer image

  // Pro Features
  isPro: boolean;
  trialStartDate?: string; // ISO date
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'pending_verification' | 'canceled';
  paymentStatus?: 'pending' | 'approved' | 'rejected';
  jobType?: string; // Deprecated, keeping for backward compatibility
  jobTypes?: string[]; // New: Multiple job categories
  bankAccounts: BankAccount[];
  
  // Cancellation
  cancellationReason?: string;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  tin: string;
  phone: string;
  email: string;
  address: string;
  tags: string[];
}

export interface CatalogItem {
  id: string;
  type: 'service' | 'product';
  name: string;
  description: string;
  unitPrice: number;
  unitType: string;
  // Pro: optional link to a job template
  jobTemplateId?: string;
}

export interface JobTemplate {
  id: string;
  name: string;
  description: string;
  category: string; // matches UserProfile.jobType
  items: CatalogItem[];
}

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  
  // Pro: Grouping
  groupId?: string;
  groupName?: string;
}

export interface InvoiceGroup {
  id: string;
  name: string;
  showBreakdown: boolean;
  total: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'accepted' | 'failed' | 'processing' | 'paid';

export interface Invoice {
  id: string;
  userProfileID: string;
  client: Client;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  vatRate: number; // percentage
  discount: {
    type: 'percentage' | 'amount';
    value: number;
  };
  legalText: string;
  isQuotation: boolean;
  includeStamp: boolean;
  includeSignature: boolean;
  revision: number;
  language?: 'en' | 'am';
  
  // Pro Features
  status: InvoiceStatus;
  selectedBankAccountId?: string; // ID of the bank account to show
  groups?: InvoiceGroup[]; // Configuration for item groups
  originalInvoiceId?: string; // To track history if ID changes
  jobName?: string; // For folder organization
  
  // Versioning
  isBackup?: boolean; // True if this is an old version
  parentId?: string | null; // ID of the current active invoice this backup belongs to
}
