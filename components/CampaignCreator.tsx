
import React, { useState } from 'react';
import { enhanceMessage } from '../services/geminiService';
import { Contact } from '../types';

interface CampaignCreatorProps {
  onStartCampaign: (contacts: Contact[], message: string) => void;
  isReady: boolean;
}

const CampaignCreator: React.FC<CampaignCreatorProps> = ({ onStartCampaign, isReady }) => {
  const [numbersInput, setNumbersInput] = useState('');
  const [message, setMessage] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!message) return;
    setIsEnhancing(true);
    const enhanced = await enhanceMessage(message);
    setMessage(enhanced);
    setIsEnhancing(false);
  };

  const handleStart = () => {
    const numbers = numbersInput
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 5);
    
    const contacts: Contact[] = numbers.map(num => ({
      number: num,
      status: 'pending'
    }));

    if (contacts.length === 0 || !message) {
      alert("يرجى إدخال رقم هاتف واحد على الأقل ونص الرسالة.");
      return;
    }

    onStartCampaign(contacts, message);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target?.result as string;
        const found = text.match(/\+?[1-9]\d{1,14}/g);
        if (found) {
            setNumbersInput(found.join('\n'));
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <i className="fas fa-list-ol text-emerald-500 ml-2"></i>
          جهات الاتصال المستهدفة
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              أرقام الهواتف (رقم واحد في كل سطر)
            </label>
            <textarea
              className="w-full h-64 p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm font-mono outline-none"
              placeholder="+1234567890&#10;+966500000000"
              value={numbersInput}
              onChange={(e) => setNumbersInput(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs font-medium text-gray-400 uppercase tracking-widest">أو</span>
            </div>
          </div>

          <label className="flex flex-col items-center justify-center w-full py-6 bg-emerald-50 border-2 border-dashed border-emerald-100 rounded-2xl cursor-pointer hover:bg-emerald-100 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <i className="fas fa-file-excel text-emerald-500 text-2xl mb-2"></i>
              <p className="text-sm text-emerald-700 font-semibold">رفع ملف إكسل أو CSV</p>
              <p className="text-xs text-emerald-500 mt-1">سيتم استخراج الأرقام تلقائياً</p>
            </div>
            <input type="file" className="hidden" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <i className="fas fa-comment-alt text-emerald-500 ml-2"></i>
          محتوى الرسالة
        </h3>

        <div className="flex-1 space-y-4">
          <div className="relative h-full flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              نص الرسالة
            </label>
            <div className="relative flex-1">
              <textarea
                className="w-full h-full min-h-[300px] p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm outline-none resize-none"
                placeholder="اكتب رسالتك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={handleEnhance}
                disabled={isEnhancing || !message}
                className="absolute bottom-4 left-4 flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {isEnhancing ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-magic"></i>
                )}
                <span>تحسين بالذكاء الاصطناعي</span>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStart}
              disabled={!isReady}
              className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-3 space-x-reverse text-white font-bold text-lg shadow-xl transition-all ${
                isReady 
                  ? 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-paper-plane"></i>
              <span>إطلاق الحملة</span>
            </button>
            {!isReady && (
              <p className="text-center text-xs text-red-500 mt-3 font-medium">
                يرجى ربط واتساب أولاً عبر رمز QR
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreator;
