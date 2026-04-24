import React, { useState, useRef } from 'react';
import { X, UploadCloud } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  onFileLoad: (dataUrl: string) => void;
  initialPreview?: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, onFileLoad, initialPreview }) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (dataUrl: string, mimeType: string = 'image/jpeg') => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_DIMENSION = 400; // Max width or height
      let { width, height } = img;

      if (width > height) {
        if (width > MAX_DIMENSION) {
          height = Math.round(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width = Math.round(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        const outputMimeType = mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = outputMimeType === 'image/jpeg' ? 0.9 : undefined;

        const resizedDataUrl = canvas.toDataURL(outputMimeType, quality);
        
        setPreview(resizedDataUrl);
        onFileLoad(resizedDataUrl);
      }
    };
    img.src = dataUrl;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        processImage(e.target.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemove = () => {
      setPreview(null);
      onFileLoad('');
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg text-center h-48">
      <label className="text-sm font-medium text-slate-700 mb-2">{label}</label>
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="h-20 w-auto object-contain rounded-md" />
          <button onClick={handleRemove} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 leading-none">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-slate-100"
          >
              <UploadCloud className="w-8 h-8 mb-1" />
              <span className="text-xs">Upload File</span>
          </button>
          <p className="text-xs text-slate-500 mt-2 px-2">
              For best results, upload a digital file with a transparent or white background.
          </p>
          <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
          /> 
        </div>
      )}
    </div>
  );
};

export default FileUploader;