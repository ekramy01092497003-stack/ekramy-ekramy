import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Sparkles, Check, Globe } from 'lucide-react';

interface SwitchUserModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSwitchUser: (newUser: UserProfile) => void;
}

const presetUsers: UserProfile[] = [
  {
    id: '1000',
    name: 'القيصر المصري',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    badgeLevel: 15,
    country: 'مصر',
    countryFlag: '🇪🇬',
    coins: 500.0,
    followers: 120,
    following: 1,
    visitors: 350,
    earnings: 85,
    vipLevel: 5,
    activeVipBadgeId: 'badge-phoenix',
  },
  {
    id: '8888',
    name: 'سلطان الخليج 👑',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    badgeLevel: 25,
    country: 'السعودية',
    countryFlag: '🇸🇦',
    coins: 1250.0,
    followers: 450,
    following: 38,
    visitors: 1200,
    earnings: 340,
    vipLevel: 5,
    activeVipBadgeId: 'badge-whale',
  },
  {
    id: '2026',
    name: 'أميرة الشام 🌸',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    badgeLevel: 14,
    country: 'سوريا',
    countryFlag: '🇸🇾',
    coins: 45.0,
    followers: 88,
    following: 54,
    visitors: 240,
    earnings: 15,
    vipLevel: 2,
    activeVipBadgeId: 'badge-knight',
  },
];

export const SwitchUserModal: React.FC<SwitchUserModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSwitchUser,
}) => {
  const [customName, setCustomName] = useState('');
  const [customCountry, setCustomCountry] = useState('مصر');
  const [customFlag, setCustomFlag] = useState('🇪🇬');

  if (!isOpen) return null;

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    const newUser: UserProfile = {
      id: randomId,
      name: customName.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?w=300&auto=format&fit=crop&q=80`,
      badgeLevel: 1,
      country: customCountry,
      countryFlag: customFlag,
      coins: 50.0, // Welcome gift coins!
      followers: 0,
      following: 0,
      visitors: 0,
      earnings: 0,
      vipLevel: 1,
      activeVipBadgeId: 'badge-sultan',
    };

    onSwitchUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 text-white font-sans" dir="rtl">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 rounded-t-3xl sm:rounded-3xl border border-purple-500/40 p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-1.5">
                <span>تجربة مستخدم جديد / التبديل</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-[11px] text-purple-200">
                جرّب التطبيق بحسابات مختلفة أو أنشئ حساباً جديداً فوراً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Quick Accounts Switcher */}
        <div className="my-4 flex flex-col gap-2">
          <h4 className="text-xs font-black text-amber-300">حسابات جاهزة للاختبار:</h4>
          <div className="flex flex-col gap-2">
            {presetUsers.map((preset) => {
              const isCurrent = currentUser.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSwitchUser(preset);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] ${
                    isCurrent
                      ? 'bg-gradient-to-r from-pink-900/60 to-purple-900/60 border-pink-400 ring-1 ring-pink-400/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={preset.avatar}
                      alt={preset.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-400/50"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                        <span>{preset.name}</span>
                        <span>{preset.countryFlag}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-0.5">
                        <span className="font-mono text-amber-300">ID: {preset.id}</span>
                        <span>•</span>
                        <span className="text-amber-400">{preset.coins.toFixed(0)} 🪙</span>
                        <span>•</span>
                        <span className="text-pink-300">Lv.{preset.badgeLevel}</span>
                      </div>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      نشط الآن
                    </span>
                  ) : (
                    <button className="text-[10px] bg-white/10 hover:bg-pink-600 px-3 py-1 rounded-full text-white font-bold transition">
                      تبديل
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Brand New Custom User */}
        <div className="p-4 rounded-3xl bg-white/5 border border-purple-500/30 flex flex-col gap-3">
          <h4 className="text-xs font-black text-pink-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>إنشاء حساب مستخدم جديد كلياً</span>
          </h4>

          <form onSubmit={handleCreateNewUser} className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-bold">اسم المستخدم:</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="مثال: نجم الليل، كابتن مصر..."
                className="w-full bg-white/10 text-white rounded-xl py-2 px-3 text-xs outline-none border border-white/15 focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-bold">الدولة:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { name: 'مصر', flag: '🇪🇬' },
                  { name: 'السعودية', flag: '🇸🇦' },
                  { name: 'الكويت', flag: '🇰🇼' },
                  { name: 'الإمارات', flag: '🇦🇪' },
                  { name: 'المغرب', flag: '🇲🇦' },
                  { name: 'العراق', flag: '🇮🇶' },
                  { name: 'فلسطين', flag: '🇵🇸' },
                  { name: 'الأردن', flag: '🇯🇴' },
                ].map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => {
                      setCustomCountry(c.name);
                      setCustomFlag(c.flag);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition ${
                      customCountry === c.name
                        ? 'bg-pink-600 text-white shadow'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
            >
              + دخول بحساب جديد (مع هدية 50 عملة 🪙)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
