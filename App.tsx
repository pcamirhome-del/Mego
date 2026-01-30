
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import CampaignCreator from './components/CampaignCreator';
import CampaignTracker from './components/CampaignTracker';
import QRModal from './components/QRModal';
import { AppView, Contact, CampaignStats } from './types';
import { io, Socket } from 'socket.io-client';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isConnected, setIsConnected] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [connStatus, setConnStatus] = useState('disconnected');
  const [backendUrl, setBackendUrl] = useState('http://localhost:3000');
  
  const [activeCampaign, setActiveCampaign] = useState<{ contacts: Contact[], message: string } | null>(null);
  const [stats, setStats] = useState<CampaignStats>({ total: 0, sent: 0, failed: 0, pending: 0 });
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // الاتصال بالسيرفر عند فتح المودال أو عند تغيير الـ URL
    if (showQRModal && !isConnected) {
        initSocket();
    }
    return () => {
        socketRef.current?.disconnect();
    };
  }, [showQRModal, backendUrl]);

  const initSocket = () => {
    setConnStatus('connecting');
    socketRef.current = io(backendUrl);

    socketRef.current.on('connect', () => {
        setConnStatus('connected_to_server');
    });

    socketRef.current.on('qr', (data: string) => {
        setQrData(data);
        setConnStatus('qr_ready');
    });

    socketRef.current.on('ready', () => {
        setIsConnected(true);
        setShowQRModal(false);
        setConnStatus('authenticated');
    });

    socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        setConnStatus('disconnected');
        setQrData(null);
    });
  };

  const startCampaign = (contacts: Contact[], message: string) => {
    setActiveCampaign({ contacts, message });
    setStats({ total: contacts.length, sent: 0, failed: 0, pending: contacts.length });
    setCurrentView(AppView.CAMPAIGNS);
    
    // إذا كان هناك اتصال حقيقي بالسيرفر، أرسل الحملة له
    if (socketRef.current?.connected) {
        socketRef.current.emit('start_campaign', { contacts, message });
    } else {
        runSimulation(contacts);
    }
  };

  const runSimulation = (contacts: Contact[]) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= contacts.length) { clearInterval(interval); return; }
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

  const viewLabels: Record<AppView, string> = {
    [AppView.DASHBOARD]: 'لوحة التحكم',
    [AppView.CAMPAIGNS]: 'الحملات',
    [AppView.CONTACTS]: 'جهات الاتصال',
    [AppView.SETTINGS]: 'الإعدادات'
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <Sidebar currentView={currentView} setView={setCurrentView} isConnected={isConnected} />
      
      <main className="flex-1 overflow-y-auto p-8">
        {isConnected && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs text-emerald-700 font-bold">واتساب متصل حقيقياً بالسيرفر</p>
            </div>
          </div>
        )}

        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{viewLabels[currentView]}</h1>
            <p className="text-gray-500 mt-1">تطبيق الإرسال الجماعي الذكي</p>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            {!isConnected ? (
              <button 
                onClick={() => setShowQRModal(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center space-x-2 space-x-reverse"
              >
                <i className="fas fa-qrcode"></i>
                <span>ربط واتساب حقيقي</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white"><i className="fas fa-user text-sm"></i></div>
                <div className="text-right">
                  <p className="text-xs font-bold leading-none">متصل الآن</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {currentView === AppView.DASHBOARD && <CampaignCreator onStartCampaign={startCampaign} isReady={isConnected} />}
        
        {currentView === AppView.CAMPAIGNS && (
          activeCampaign ? <CampaignTracker contacts={activeCampaign.contacts} stats={stats} message={activeCampaign.message} /> 
          : <div className="text-center p-20">لا توجد حملات حالية</div>
        )}

        {currentView === AppView.SETTINGS && (
           <div className="max-w-2xl bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
             <div className="grid grid-cols-1 gap-6">
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                   <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                     <i className="fas fa-link ml-2"></i>
                     إعدادات السيرفر (Backend)
                   </h4>
                   <p className="text-xs text-blue-600 mb-4">أدخل عنوان السيرفر الذي يشغل Node.js و whatsapp-web.js</p>
                   <input 
                    type="text" 
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="http://localhost:3000" 
                    className="w-full p-3 rounded-xl border border-blue-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                   />
                </div>
             </div>
           </div>
        )}
      </main>

      <QRModal 
        isOpen={showQRModal} 
        onConnected={() => setIsConnected(true)} 
        qrCodeData={qrData}
        connectionStatus={connStatus}
      />
    </div>
  );
};

export default App;
