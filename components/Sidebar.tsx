
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isConnected: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isConnected }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, icon: 'fa-chart-pie', label: 'لوحة التحكم' },
    { id: AppView.CAMPAIGNS, icon: 'fa-paper-plane', label: 'الحملات' },
    { id: AppView.CONTACTS, icon: 'fa-users', label: 'جهات الاتصال' },
    { id: AppView.SETTINGS, icon: 'fa-cog', label: 'الإعدادات' },
  ];

  return (
    <aside className="w-64 bg-white border-l border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center space-x-3 space-x-reverse">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
          <i className="fab fa-whatsapp text-white text-xl"></i>
        </div>
        <span className="font-bold text-xl text-gray-800 tracking-tight">المرسل الذكي</span>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <i className={`fas ${item.icon} w-5 text-lg`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 space-x-reverse bg-gray-50 rounded-xl p-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {isConnected ? 'واتساب متصل' : 'غير متصل'}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              حالة الخدمة
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
