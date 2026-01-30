
import React from 'react';
import { Contact, CampaignStats } from '../types';

interface CampaignTrackerProps {
  contacts: Contact[];
  stats: CampaignStats;
  message: string;
}

const CampaignTracker: React.FC<CampaignTrackerProps> = ({ contacts, stats, message }) => {
  const progressPercent = Math.round((stats.sent + stats.failed) / stats.total * 100) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="الإجمالي" value={stats.total} color="blue" icon="fa-users" />
        <StatCard label="تم الإرسال" value={stats.sent} color="emerald" icon="fa-check-circle" />
        <StatCard label="فشل" value={stats.failed} color="red" icon="fa-times-circle" />
        <StatCard label="في الانتظار" value={stats.pending} color="amber" icon="fa-hourglass-half" />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">التقدم المباشر</h3>
          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {progressPercent}% مكتمل
          </span>
        </div>
        
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-gradient-to-l from-emerald-500 to-teal-600 transition-all duration-500 shadow-sm shadow-emerald-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="overflow-hidden border border-gray-100 rounded-2xl">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">رقم الهاتف</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-left">النتيجة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contacts.map((contact, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{contact.number}</td>
                  <td className="px-6 py-4 flex justify-center">
                    <StatusBadge status={contact.status} />
                  </td>
                  <td className="px-6 py-4 text-left text-xs text-gray-500 italic">
                    {contact.status === 'sent' ? 'تم تسليم الرسالة' : contact.status === 'failed' ? 'خطأ في الاتصال' : 'جاري المعالجة...'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) => {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4 space-x-reverse">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${colors[color]}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    pending: 'bg-gray-100 text-gray-500',
    sending: 'bg-blue-100 text-blue-600 animate-pulse',
    sent: 'bg-emerald-100 text-emerald-600',
    failed: 'bg-red-100 text-red-600'
  };

  const labels: any = {
    pending: 'في الانتظار',
    sending: 'جاري الإرسال',
    sent: 'تم الإرسال',
    failed: 'فشل'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default CampaignTracker;
