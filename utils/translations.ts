
export type Language = 'en' | 'am';

export interface Translations {
  invoice: string;
  quotation: string;
  billTo: string;
  from: string;
  date: string;
  dueDate: string;
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
  subtotal: string;
  tax: string;
  discount: string;
  totalDue: string;
  bankDetails: string;
  accName: string;
  accNo: string;
  terms: string;
  signature: string;
  page: string;
  of: string;
  reference: string;
  tin: string;
  phone: string;
  email: string;
  address: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    invoice: 'Invoice',
    quotation: 'Quotation',
    billTo: 'Billed To',
    from: 'From',
    date: 'Issued On',
    dueDate: 'Payment Due',
    description: 'Description',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    totalDue: 'Total Due',
    bankDetails: 'Bank Transfer Details',
    accName: 'Account Name',
    accNo: 'Account No',
    terms: 'Terms & Notes',
    signature: 'Authorized Signature',
    page: 'Page',
    of: 'of',
    reference: 'Reference',
    tin: 'TIN',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
  },
  am: {
    invoice: 'ኢንቮይስ', // Invoice
    quotation: 'የዋጋ ማቅረቢያ', // Quotation
    billTo: 'ለማን', // Bill To
    from: 'ከ', // From
    date: 'የተሰጠበት ቀን', // Issued On
    dueDate: 'መከፈል ያለበት ቀን', // Payment Due
    description: 'ዝርዝር', // Description
    quantity: 'ብዛት', // Quantity
    unitPrice: 'ነጠላ ዋጋ', // Unit Price
    total: 'ጠቅላላ', // Total
    subtotal: 'ንዑስ ድምር', // Subtotal
    tax: 'ታክስ (ተ.እ.ታ)', // Tax
    discount: 'ቅናሽ', // Discount
    totalDue: 'ጠቅላላ ክፍያ', // Total Due
    bankDetails: 'የባንክ ዝርዝር', // Bank Transfer Details
    accName: 'የአካውንት ስም', // Account Name
    accNo: 'የአካውንት ቁጥር', // Account No
    terms: 'ውሎች እና ማስታወሻዎች', // Terms & Notes
    signature: 'የተፈቀደ ፊርማ', // Authorized Signature
    page: 'ገጽ', // Page
    of: 'ከ', // of
    reference: 'መለያ ቁጥር', // Reference
    tin: 'የግብር ከፋይ መለያ (TIN)', // TIN
    phone: 'ስልክ', // Phone
    email: 'ኢሜይል', // Email
    address: 'አድራሻ', // Address
  }
};
