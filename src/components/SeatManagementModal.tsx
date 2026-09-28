import React, { useState } from 'react';
import { VoiceSeat, RoomRole } from '../types';
import { 
  Shield, MicOff, Mic, UserX, Ban, ArrowUpCircle, 
  Crown, Check, X, AlertTriangle, UserCheck 
} from 'lucide-react';

interface SeatManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  seat: VoiceSeat | null;
  seatIndex: number;
  currentUserRole: RoomRole;
  onMuteUser: (userId: string) => void;
  onKickUser: (seatIndex: number, userId: string) => void;
  onBanUser: (userId: string, userName: string) => void;
  onChangeRole: (userId: string, newRole: RoomRole) => void;
}

export const SeatManagementModal: React.FC<SeatManagementModalProps> = ({
  isOpen,
  onClose,
  seat,
  seatIndex,
  currentUserRole,
  onMuteUser,
  onKickUser,
  onBanUser,
  onChangeRole,
}) => {
  if (!isOpen || !seat || !seat.occupied) return null;

  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin' || currentUserRole === 'host' || currentUserRole === 'moderator';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 text-white font-sans" dir="rtl">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 rounded-t-3xl sm:rounded-3xl border border-purple-500/30 p-5 shadow-2xl animate-slideUp flex flex-col gap-4 text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <img
              src={seat.userAvatar}
              alt={seat.userName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400/60"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-white">{seat.userName}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  seat.role === 'owner' ? 'bg-amber-500 text-slate-950' :
                  seat.role === 'admin' ? 'bg-purple-600 text-white' :
                  seat.role === 'moderator' ? 'bg-blue-600 text-white' :
                  'bg-white/10 text-slate-200'
                }`}>
                  {seat.role === 'owner' ? 'المالك 👑' :
                   seat.role === 'admin' ? 'مدير 🛡️' :
                   seat.role === 'host' ? 'مضيف 🎙️' :
                   seat.role === 'moderator' ? 'مشرف ⚡' : 'متحدث'}
                </span>
              </div>
              <p className="text-[11px] text-purple-200 mt-0.5">مايك رقم {seatIndex + 1}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls for Host / Admin */}
        {canManage ? (
          <div className="space-y-2">
            <div className="text-xs font-bold text-amber-300 mb-1">إدارة المتحدث والصلاحيات:</div>

            {/* Mute User */}
            <button
              onClick={() => {
                if (seat.userId) onMuteUser(seat.userId);
                onClose();
              }}
              className="w-full p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs font-semibold text-slate-200 transition"
            >
              <div className="flex items-center gap-2">
                <MicOff className="w-4 h-4 text-amber-400" />
                <span>{seat.isMuted ? 'إلغاء كتم المايك' : 'كتم المايك (Mute)'}</span>
              </div>
              <span className="text-[10px] text-slate-400">فوري</span>
            </button>

            {/* Kick from Seat */}
            <button
              onClick={() => {
                if (seat.userId) onKickUser(seatIndex, seat.userId);
                onClose();
              }}
              className="w-full p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-between text-xs font-semibold text-rose-300 transition"
            >
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-400" />
                <span>إنزال من المايك (Kick from Seat)</span>
              </div>
              <span className="text-[10px] text-rose-400">إلى مستمع</span>
            </button>

            {/* Ban from Room (Owner & Admin only) */}
            {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
              <button
                onClick={() => {
                  if (seat.userId && seat.userName) onBanUser(seat.userId, seat.userName);
                  onClose();
                }}
                className="w-full p-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 flex items-center justify-between text-xs font-semibold text-red-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-400" />
                  <span>طرد وحظر من الغرفة (Ban)</span>
                </div>
                <span className="text-[10px] text-red-400">حظر نهائي</span>
              </button>
            )}

            {/* Change Role to Moderator or Admin (Owner only) */}
            {currentUserRole === 'owner' && (
              <div className="pt-2 border-t border-purple-800/40 flex gap-2">
                <button
                  onClick={() => {
                    if (seat.userId) onChangeRole(seat.userId, 'moderator');
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-bold"
                >
                  ترقية لمشرف ⚡
                </button>
                <button
                  onClick={() => {
                    if (seat.userId) onChangeRole(seat.userId, 'admin');
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold"
                >
                  تعيين كمدير 🛡️
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-white/5 text-center text-xs text-slate-300">
            أنت في وضع مستمع. لا تملك صلاحية الإشراف على هذا المايك.
          </div>
        )}
      </div>
    </div>
  );
};
