
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CampaignCreator from './components/CampaignCreator';
import CampaignTracker from './components/CampaignTracker';
import QRModal from './components/QRModal';
import { AppView, Contact, CampaignStats } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isConnected, setIsConnected] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<{ contacts: Contact[], message: string } | null>(null);
  const [stats, setStats] = useState<CampaignStats>({ total: 0, sent: 0, failed: 0, pending: 0 });

  const startCampaign = (contacts: Contact[], message: string) => {
    setActiveCampaign({ contacts, message });
    setStats({
      total: contacts.length,
      sent: 0,
      failed: 0,
      pending: contacts.length
    });
    setCurrentView(AppView.CAMPAIGNS);
    
    runSimulation(contacts);
  };

  const runSimulation = (contacts: Contact[]) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= contacts.length) {
        clearInterval(interval);
        return;
      }

      const updatedContacts = [...contacts];
      const isSuccess = Math.random() > 0.05;
      
      updatedContacts[index].status = isSuccess ? 'sent' : 'failed';
      
      setActiveCampaign(prev => prev ? { ...prev, contacts: updatedContacts } : null);
      setStats(prev => ({
        ...prev,
        sent: isSuccess ? prev.sent + 1 : prev.sent,
        failed: !isSuccess ? prev.failed + 1 : prev.failed,
        pending: prev.pending - 1
      }));

      index++;
    }, 1500);
  };

  const connectWhatsApp = () => {
    setIsConnected(true);
    setShowQRModal(false);
  };

  const viewLabels: Record<AppView, string> = {
    [AppView.DASHBOARD]: 'لوحة التحكم',
    [AppView.CAMPAIGNS]: 'الحملات',
    [AppView.CONTACTS]: 'جهات الاتصال',
    [AppView.SETTINGS]: 'الإعدادات'
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isConnected={isConnected} 
      />
      
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {viewLabels[currentView]}
            </h1>
            <p className="text-gray-500 mt-1">إدارة حملاتك التسويقية عبر واتساب باحترافية</p>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            {!isConnected ? (
              <button 
                onClick={() => setShowQRModal(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all flex items-center space-x-2 space-x-reverse"
              >
                <i className="fas fa-qrcode"></i>
                <span>ربط واتساب</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <i className="fas fa-user text-sm"></i>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold leading-none">جلسة نشطة</p>
                  <p className="text-[10px] text-emerald-500 font-semibold mt-1">v2.58.4 (مستقر)</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {currentView === AppView.DASHBOARD && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-lg text-right">
                <h2 className="text-3xl font-bold mb-4">أطلق حملات ذكية</h2>
                <p className="text-emerald-50 opacity-90 leading-relaxed mb-8">
                  اربط حساب واتساب الخاص بشركتك وتواصل مع جمهورك بفعالية. استخدم الذكاء الاصطناعي المدمج لتخصيص رسائلك وتتبع وصولها في الوقت الفعلي.
                </p>
                <button 
                  onClick={() => setCurrentView(AppView.CAMPAIGNS)}
                  className="bg-white text-emerald-700 px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  إنشاء حملة جديدة
                </button>
              </div>
              <i className="fab fa-whatsapp absolute -left-10 -bottom-10 text-[20rem] text-white/10 rotate-12"></i>
            </div>

            <CampaignCreator onStartCampaign={startCampaign} isReady={isConnected} />
          </div>
        )}

        {currentView === AppView.CAMPAIGNS && (
          <div className="space-y-8">
            {activeCampaign ? (
              <CampaignTracker 
                contacts={activeCampaign.contacts} 
                stats={stats} 
                message={activeCampaign.message} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-[2.5rem] border border-dashed border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 text-4xl mb-6">
                  <i className="fas fa-paper-plane"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">لا توجد حملات نشطة</h3>
                <p className="text-gray-500 mt-2 mb-8 max-w-xs">ابدأ بإنشاء حملة جديدة من لوحة التحكم أو منشئ الحملات.</p>
                <button 
                  onClick={() => setCurrentView(AppView.DASHBOARD)}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
                >
                  بدء حملة جديدة
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === AppView.CONTACTS && (
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900">دفتر العناوين</h3>
                <button className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl">إضافة مجموعة جديدة</button>
             </div>
             <div className="text-center py-20">
                <i className="fas fa-users text-5xl text-gray-100 mb-4"></i>
                <p className="text-gray-400 font-medium">مجموعات جهات الاتصال الخاصة بك ستظهر هنا.</p>
             </div>
           </div>
        )}

        {currentView === AppView.SETTINGS && (
           <div className="max-w-2xl bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
             <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تأخير الرسائل (بالثواني)</label>
                  <input type="range" className="w-full accent-emerald-600" min="1" max="10" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>سريع (1 ثانية)</span>
                    <span>آمن (10 ثواني)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="text-right">
                    <p className="font-bold text-gray-800">إعادة محاولة الإرسال تلقائياً</p>
                    <p className="text-xs text-gray-500">حاول الإرسال مرة أخرى تلقائياً في حال فشل المحاولة الأولى</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="text-right">
                    <p className="font-bold text-gray-800">تحسين الرسائل بالذكاء الاصطناعي</p>
                    <p className="text-xs text-gray-500">استخدم Gemini Pro لتحسين صياغة الرسائل بذكاء</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
             </div>
           </div>
        )}
      </main>

      <QRModal 
        isOpen={showQRModal} 
        onConnected={connectWhatsApp} 
      />
    </div>
  );
};

export default App;
