
import React, { useState, useRef } from 'react';
import { Upload, Loader2, X, FileText, AlertCircle, FileSpreadsheet, FileBox } from 'lucide-react';
import { extractInvoiceData, extractDataFromText, ExtractedInvoiceData } from '../services/ocrService';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

interface OCRScannerProps {
  onDataExtracted: (data: ExtractedInvoiceData) => void;
  onClose: () => void;
}

const OCRScanner: React.FC<OCRScannerProps> = ({ onDataExtracted, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'doc' | 'excel' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsScanning(true);

    const type = file.type;
    const name = file.name.toLowerCase();

    try {
        if (type.startsWith('image/')) {
            setFileType('image');
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target?.result as string;
                setPreview(base64);
                await startOcrScan(base64, type);
            };
            reader.readAsDataURL(file);
        } else if (type === 'application/pdf') {
            setFileType('pdf');
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target?.result as string;
                // PDF preview is harder to show as image, but we'll show an icon
                setPreview('pdf-icon'); 
                await startOcrScan(base64, type);
            };
            reader.readAsDataURL(file);
        } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
            setFileType('excel');
            setPreview('excel-icon');
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const csv = XLSX.utils.sheet_to_csv(worksheet);
                await startTextScan(csv);
            };
            reader.readAsArrayBuffer(file);
        } else if (name.endsWith('.docx')) {
            setFileType('doc');
            setPreview('doc-icon');
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const result = await mammoth.extractRawText({ arrayBuffer });
                await startTextScan(result.value);
            };
            reader.readAsArrayBuffer(file);
        } else {
            throw new Error("Unsupported file type. Please upload an image, PDF, Word, or Excel file.");
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file");
        setIsScanning(false);
    }
  };

  const startOcrScan = async (base64: string, mimeType: string) => {
    try {
      const data = await extractInvoiceData(base64, mimeType);
      onDataExtracted(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan document");
      setIsScanning(false);
    }
  };

  const startTextScan = async (text: string) => {
    try {
      const data = await extractDataFromText(text);
      onDataExtracted(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract data from text");
      setIsScanning(false);
    }
  };

  const renderPreview = () => {
      if (!preview) return null;
      if (preview === 'pdf-icon') return <div className="w-48 h-64 bg-red-50 rounded-xl flex items-center justify-center border-2 border-red-200"><FileText className="w-16 h-16 text-red-500" /></div>;
      if (preview === 'excel-icon') return <div className="w-48 h-64 bg-green-50 rounded-xl flex items-center justify-center border-2 border-green-200"><FileSpreadsheet className="w-16 h-16 text-green-500" /></div>;
      if (preview === 'doc-icon') return <div className="w-48 h-64 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-200"><FileBox className="w-16 h-16 text-blue-500" /></div>;
      return <img src={preview} alt="Scanning" className="w-48 h-64 object-cover rounded-xl" />;
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          Fill from Document
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-slate-500" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isScanning && !preview && !error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-700">Upload or Take Photo</p>
              <p className="text-xs text-slate-500 mt-1 text-center">Supports Image, PDF, Word, and Excel</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx" 
                className="hidden" 
              />
            </div>
            
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Gemini AI will automatically extract client details, items, and totals from your files to pre-fill the form.
              </p>
            </div>
          </motion.div>
        ) : isScanning ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <div className="relative">
              <div className="opacity-50 blur-[1px]">
                  {renderPreview()}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                  <div className="h-1 w-32 bg-blue-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600"
                      animate={{ x: [-128, 128] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">Analyzing Document...</p>
              <p className="text-sm text-slate-500">Extracting data for your proforma</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8" />
            </div>
            <p className="font-bold text-slate-800 mb-2">Process Failed</p>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <button 
              onClick={() => { setPreview(null); setError(null); setIsScanning(false); }}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default OCRScanner;
