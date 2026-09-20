import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, Search, Sparkles } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess, books = [] }) {
  const [scanError, setScanError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setScanError('');
    const scannerId = 'qr-reader-container';

    let html5QrCode;
    try {
      html5QrCode = new Html5Qrcode(scannerId);
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 220, height: 220 } };

      html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleDetectedCode(decodedText, html5QrCode);
        },
        () => {
          // ignore frame errors while scanning
        }
      ).catch((err) => {
        console.warn('Không thể bật camera:', err);
        setScanError('Không tìm thấy Camera hoặc chưa cấp quyền truy cập Camera trên trình duyệt. Anh có thể nhập mã ISBN bên dưới.');
      });
    } catch (e) {
      console.warn('Khởi tạo scanner lỗi:', e);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          scannerRef.current.clear();
        });
      }
    };
  }, [isOpen]);

  const handleDetectedCode = (codeText, scannerInstance) => {
    if (scannerInstance) {
      scannerInstance.stop().catch(() => {});
    }

    // Phân tích mã QR: Có thể là JSON hoặc mã ISBN chuỗi thuần
    let matchedBook = null;

    try {
      const parsed = JSON.parse(codeText);
      if (parsed.id) {
        matchedBook = books.find(b => b.id === Number(parsed.id));
      }
      if (!matchedBook && parsed.isbn) {
        matchedBook = books.find(b => b.isbn.trim() === parsed.isbn.trim());
      }
    } catch (_) {
      // Chuỗi text thông thường (mã ISBN hoặc ID sách)
      const clean = codeText.trim();
      matchedBook = books.find(b => b.isbn.trim() === clean || String(b.id) === clean);
    }

    if (matchedBook) {
      onScanSuccess(matchedBook);
      onClose();
    } else {
      setScanError(`Đã quét thấy mã: "${codeText}", nhưng không tìm thấy cuốn sách nào khớp trong kho!`);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const term = manualCode.trim().toLowerCase();
    const found = books.find(b => 
      b.isbn.toLowerCase().includes(term) ||
      String(b.id) === term ||
      b.title.toLowerCase().includes(term)
    );

    if (found) {
      onScanSuccess(found);
      onClose();
    } else {
      setScanError(`Không tìm thấy cuốn sách nào với từ khóa "${manualCode}"`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Quét Mã QR / Barcode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hướng camera về phía mã QR hoặc mã vạch của sách
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Scanner View */}
        <div className="p-6">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 aspect-square max-w-[280px] mx-auto shadow-inner">
            <div id="qr-reader-container" className="w-full h-full" />
            {/* Visual Scanner Overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-indigo-400/60 rounded-2xl m-6 animate-pulse" />
          </div>

          {/* Error / Alert Message */}
          {scanError && (
            <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{scanError}</p>
            </div>
          )}

          {/* Fallback: Tra cứu nhanh bằng tay */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Hoặc nhập mã ISBN / Tên sách để tìm ngay:
            </span>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="VD: 978-604... hoặc Tên sách"
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-xs outline-hidden dark:text-slate-100"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tìm</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
