import React from 'react';
import { NotificationItem } from '../types';
import { mockNotifications } from '../data/mockData';
import { Bell, CheckCheck, Gift, Trophy, Shield, X, Sparkles } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 text-white font-sans" dir="rtl">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#190f2b] to-slate-950 rounded-t-3xl sm:rounded-3xl border border-purple-500/30 p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-1.5">
                <span>الإشعارات (Notifications)</span>
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              </h3>
              <p className="text-[11px] text-purple-200">الهدايا، الترقيات، ودعوات الرومات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="mt-4 space-y-2.5">
          {mockNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                notif.isRead
                  ? 'bg-white/5 border-white/10 text-slate-300'
                  : 'bg-purple-950/40 border-pink-500/40 shadow-sm text-white'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-lg">
                {notif.type === 'gift' ? '🎁' :
                 notif.type === 'level' ? '⭐' :
                 notif.type === 'family' ? '🦅' : '🛡️'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
