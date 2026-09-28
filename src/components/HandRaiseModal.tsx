import React from 'react';
import { HandRaiseRequest } from '../types';
import { Hand, UserCheck, X, Check, Users } from 'lucide-react';

interface HandRaiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: HandRaiseRequest[];
  onAccept: (request: HandRaiseRequest) => void;
  onReject: (requestId: string) => void;
}

export const HandRaiseModal: React.FC<HandRaiseModalProps> = ({
  isOpen,
  onClose,
  requests,
  onAccept,
  onReject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 text-white font-sans" dir="rtl">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 rounded-t-3xl sm:rounded-3xl border border-purple-500/30 p-5 shadow-2xl animate-slideUp flex flex-col gap-3 text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              ✋
            </div>
            <div>
              <h3 className="font-black text-sm text-white">طلبات الصعود للمايك (Hand Raise)</h3>
              <p className="text-[11px] text-purple-200">{requests.length} في قائمة الانتظار</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            لا توجد طلبات صعود معلقة حالياً 🎙️
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={req.userAvatar}
                    alt={req.userName}
                    className="w-10 h-10 rounded-full object-cover border border-purple-400/40"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{req.userName}</span>
                    <span className="text-[10px] text-slate-400">{req.requestedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAccept(req)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black flex items-center gap-1 transition active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>قبول</span>
                  </button>
                  <button
                    onClick={() => onReject(req.id)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
