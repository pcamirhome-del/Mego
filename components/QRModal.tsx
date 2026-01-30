
import React, { useState, useEffect } from 'react';

interface QRModalProps {
  onConnected: () => void;
  isOpen: boolean;
}

const QRModal: React.FC<QRModalProps> = ({ onConnected, isOpen }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ربط حساب واتساب</h2>
          <p className="text-gray-500 text-sm mb-8">
            امسح رمز QR أدناه باستخدام تطبيق واتساب لبدء إرسال الرسائل.
          </p>

          <div className="relative aspect-square w-64 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 p-4">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs text-gray-400 font-medium">جاري إنشاء الجلسة...</p>
              </div>
            ) : (
              <div className="relative group cursor-pointer" onClick={onConnected}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WA_BULK_SENDER_MOCK_SESSION" 
                  alt="QR Code"
                  className="w-full h-full rounded-lg"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-lg flex items-center justify-center">
                   <div className="opacity-0 group-hover:opacity-100 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                     اضغط للمحاكاة (اتصال)
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4 text-right">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
              <p className="text-xs text-gray-600 leading-relaxed">افتح تطبيق واتساب على هاتفك</p>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
              <p className="text-xs text-gray-600 leading-relaxed">اضغط على القائمة أو الإعدادات واختر الأجهزة المرتبطة</p>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
              <p className="text-xs text-gray-600 leading-relaxed">وجه هاتفك نحو هذه الشاشة لمسح الرمز</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
