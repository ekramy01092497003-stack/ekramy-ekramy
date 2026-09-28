import React, { useState } from 'react';
import { FamilyItem, UserProfile } from '../types';
import { mockFamilies } from '../data/mockData';
import { 
  Users, Crown, Trophy, Plus, Shield, Sparkles, 
  ChevronLeft, X, Check, Flame, MessageCircle 
} from 'lucide-react';

interface FamiliesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const FamiliesModal: React.FC<FamiliesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [families, setFamilies] = useState<FamilyItem[]>(mockFamilies);
  const [joinedMsg, setJoinedMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleJoinFamily = (familyId: string, familyName: string) => {
    setFamilies((prev) =>
      prev.map((f) => (f.id === familyId ? { ...f, isJoined: !f.isJoined } : f))
    );
    setJoinedMsg(`تم تقديم طلب الانضمام إلى ${familyName} بنجاح! 🦅✨`);
    setTimeout(() => setJoinedMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 text-white font-sans" dir="rtl">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#160d26] to-slate-950 rounded-t-3xl sm:rounded-3xl border border-purple-500/30 p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-1.5">
                <span>نظام العائلات (Families)</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-[11px] text-purple-200">التحالفات، دعم الرومات، وترتيب العائلات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback message */}
        {joinedMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
            {joinedMsg}
          </div>
        )}

        {/* Current user family badge if any */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-pink-900/30 border border-purple-400/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-black border border-amber-400/40 text-sm">
              🦅
            </div>
            <div>
              <span className="text-[10px] text-slate-300 block">عائلتك الحالية:</span>
              <span className="text-xs font-black text-amber-300">
                {currentUser.familyName || 'صقور العرب'}
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
            مستوى 12
          </span>
        </div>

        {/* Families Leaderboard List */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-black text-slate-200 flex items-center justify-between">
            <span>ترتيب أقوى العائلات هذا الأسبوع:</span>
            <span className="text-[10px] text-purple-300 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>دوري العائلات</span>
            </span>
          </h4>

          {families.map((fam, idx) => (
            <div
              key={fam.id}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  idx === 0 ? 'bg-amber-400 text-slate-950 font-bold' :
                  idx === 1 ? 'bg-slate-300 text-slate-950 font-bold' :
                  'bg-white/10 text-white'
                }`}>
                  {idx + 1}
                </span>
                <img
                  src={fam.avatar}
                  alt={fam.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-purple-400/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">{fam.name}</span>
                    <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded-full font-bold">
                      {fam.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-[170px] truncate">
                    {fam.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-amber-300">
                    <span>{fam.membersCount} عضو</span>
                    <span>•</span>
                    <span>{fam.totalCoins.toLocaleString()} 🪙 كوينز دعم</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleJoinFamily(fam.id, fam.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shrink-0 ${
                  fam.isJoined
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                }`}
              >
                {fam.isJoined ? 'عضوك' : 'انضمام'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
