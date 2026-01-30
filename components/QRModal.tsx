
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRModalProps {
  onConnected: () => void;
  isOpen: boolean;
  qrCodeData: string | null;
  connectionStatus: string;
}

const QRModal: React.FC<QRModalProps> = ({ onConnected, isOpen, qrCodeData, connectionStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl transform transition-all border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-6">
            <i className="fas fa-qrcode text-3xl"></i>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ربط حساب واتساب الحقيقي</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            {connectionStatus === 'connecting' ? 'جاري الاتصال بالسيرفر...' : 'امسح الرمز أدناه بهاتفك للربط المباشر'}
          </p>

          <div className="relative group mx-auto w-72 h-72">
            <div className="relative aspect-square w-full bg-white rounded-3xl flex items-center justify-center border-2 border-emerald-100 p-6 shadow-inner overflow-hidden">
              {!qrCodeData ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-xs text-gray-400 font-medium">بانتظار الرمز من السيرفر...</p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10 animate-[scan_2s_linear_infinite]"></div>
                  
                  <QRCodeSVG 
                    value={qrCodeData} 
                    size={240}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                        src: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
          </div>

          <div className="mt-8 space-y-3 text-right text-xs">
            <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                <i className="fas fa-check-circle text-emerald-500 ml-2"></i>
                <span>تأكد من فتح واتساب > الأجهزة المرتبطة > ربط جهاز</span>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                <i className="fas fa-signal text-blue-500 ml-2"></i>
                <span>حالة السيرفر الحالي: <span className="font-bold mr-1">{connectionStatus}</span></span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
};

export default QRModal;
