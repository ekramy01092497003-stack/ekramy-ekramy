import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Trophy, Star, Crown, Gift, CheckCircle, ChevronLeft, X, Sparkles } from 'lucide-react';

interface LevelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const LevelsModal: React.FC<LevelsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  if (!isOpen) return null;

  const currentLevel = currentUser.badgeLevel || 15;
  const currentExp = 7850;
  const nextLevelExp = 10000;
  const progressPercent = Math.min(100, Math.floor((currentExp / nextLevelExp) * 100));

  const levelTiers = [
    { level: 5, title: 'عضو نشط', perk: 'فتح إرسال هدايا الورود والبالونات', coinsReward: 100, reached: true },
    { level: 10, title: 'متحدث برونزي', perk: 'إمكانية حجز مقاعد متقدمة في الرومات', coinsReward: 300, reached: true },
    { level: 15, title: 'نجم فضي', perk: 'هالة مميزة حول المايك + لون اسم أزرق', coinsReward: 500, reached: true },
    { level: 20, title: 'قائد ذهبي', perk: 'تأثير دخول سيارة رياضية للغرفة', coinsReward: 1000, reached: false },
    { level: 30, title: 'إمبراطور ملكي', perk: 'تاج الإمبراطور + حصانة ضد الطرد العادي', coinsReward: 3000, reached: false },
    { level: 50, title: 'أسطورة PartyLive', perk: 'روم مخصص مع خادم صوت فائق الدقة', coinsReward: 10000, reached: false },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 text-white font-sans" dir="rtl">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#190e29] to-slate-950 rounded-t-3xl sm:rounded-3xl border border-amber-400/40 p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
              ⭐
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-1.5">
                <span>نظام المستويات والخبرة (Levels & EXP)</span>
              </h3>
              <p className="text-[11px] text-amber-200">اكسب نقاط الخبرة بإرسال الهدايا والتفاعل بالرومات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Level Status Card */}
        <div className="mt-4 p-4 rounded-3xl bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-amber-900/50 border border-amber-400/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                Lv.{currentLevel}
              </div>
              <div>
                <span className="text-xs font-black text-white">{currentUser.name}</span>
                <span className="text-[10px] text-amber-300 block">نجم فضي متميز</span>
              </div>
            </div>
            <div className="text-left text-xs font-bold text-amber-300">
              {currentExp} / {nextLevelExp} EXP
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-300 mt-1 block text-left">
              متبقي {nextLevelExp - currentExp} EXP للوصول إلى المستوى {currentLevel + 1}
            </span>
          </div>
        </div>

        {/* Level Milestones */}
        <div className="mt-5 space-y-2.5">
          <h4 className="text-xs font-black text-slate-200 mb-2">
            مكافآت المستويات والمزايا المفتوحة:
          </h4>
          {levelTiers.map((tier) => (
            <div
              key={tier.level}
              className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                tier.reached
                  ? 'bg-amber-400/10 border-amber-400/30 text-white'
                  : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                  tier.reached ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-slate-400'
                }`}>
                  {tier.level}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{tier.title}</span>
                    {tier.reached && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full font-bold">
                        مكتمل ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5">{tier.perk}</p>
                </div>
              </div>

              <div className="text-left shrink-0">
                <span className="text-xs font-black text-amber-300 block">
                  +{tier.coinsReward} 🪙
                </span>
                <span className="text-[9px] text-slate-400">Coins</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
