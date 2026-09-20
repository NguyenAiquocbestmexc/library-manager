import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, QrCode } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, book }) {
  const qrRef = useRef(null);

  if (!isOpen || !book) return null;

  // Dữ liệu mã hóa vào QR: JSON string chứa định danh sách
  const qrPayload = JSON.stringify({
    type: 'LIBRARY_BOOK',
    id: book.id,
    isbn: book.isbn,
    title: book.title
  });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>In Tem Mã QR - ${book.title}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 20px; }
            .sticker { border: 2px dashed #6366f1; border-radius: 12px; padding: 20px; max-width: 280px; margin: 0 auto; }
            .title { font-size: 14px; font-weight: bold; margin-top: 10px; color: #1e293b; }
            .author { font-size: 11px; color: #64748b; margin-top: 2px; }
            .isbn { font-family: monospace; font-size: 11px; color: #4f46e5; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="sticker">
            ${document.getElementById('book-qr-code').outerHTML}
            <div class="title">${book.title}</div>
            <div class="author">TG: ${book.author}</div>
            <div class="isbn">ISBN: ${book.isbn}</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const svg = document.getElementById('book-qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_${book.isbn || book.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up text-center p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <QrCode className="w-5 h-5" />
            <span>Mã QR Sách</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Box */}
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 inline-block mx-auto mb-4 shadow-inner">
          <QRCodeSVG
            id="book-qr-code"
            value={qrPayload}
            size={180}
            level="H"
            includeMargin={true}
            className="mx-auto rounded-lg"
          />
        </div>

        {/* Book Details */}
        <div className="mb-6 text-left bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
            {book.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tác giả: <span className="font-medium text-slate-700 dark:text-slate-300">{book.author}</span>
          </p>
          <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            ISBN: {book.isbn}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải Ảnh QR</span>
          </button>
          <button
            onClick={handlePrint}
            className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In Tem Dán</span>
          </button>
        </div>
      </div>
    </div>
  );
}
