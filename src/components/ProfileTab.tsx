import React, { useState } from 'react';
import { UserProfile, VipBadge } from '../types';
import { vipBadgesList } from '../data/mockData';
import { 
  Edit3, Copy, ChevronLeft, ChevronRight, Plus, 
  Store, Award, Shield, Gift, Briefcase, Settings, 
  Headphones, Sparkles, Check, Crown, Flame, Zap, CheckCircle2,
  Wallet, Users, Star
} from 'lucide-react';

interface ProfileTabProps {
  currentUser: UserProfile;
  onUpdateCoins: (newCoins: number) => void;
  onOpenCreateRoom: () => void;
  onOpenSwitchUser?: () => void;
  onOpenWallet?: () => void;
  onOpenFamilies?: () => void;
  onOpenLevels?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  currentUser,
  onUpdateCoins,
  onOpenCreateRoom,
  onOpenSwitchUser,
  onOpenWallet,
  onOpenFamilies,
  onOpenLevels,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [badges, setBadges] = useState<VipBadge[]>(vipBadgesList);
  const [activeBadgeId, setActiveBadgeId] = useState<string>(
    currentUser.activeVipBadgeId || 'badge-sultan'
  );
  const [badgeToast, setBadgeToast] = useState<string | null>(null);

  const activeBadge = badges.find((b) => b.id === activeBadgeId) || badges[0];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(currentUser.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEquipBadge = (badge: VipBadge) => {
    if (!badge.isUnlocked) {
      alert(`شارة ${badge.name} مقفلة! تتطلب مستوى ${badge.tier}. يمكنك ترقية مستواك الملكي فوراً.`);
      return;
    }
    setActiveBadgeId(badge.id);
    setBadgeToast(`تم تفعيل شارة "${badge.name}" الملكية بهالة ذهبية متوهجة! 👑✨`);
    setTimeout(() => setBadgeToast(null), 3500);
  };

  const handleUnlockBadgeTrial = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, isUnlocked: true } : b))
    );
    setActiveBadgeId(badgeId);
    setBadgeToast('تهانينا! تمت ترقيتك وفتح الشارة الملكية بنجاح 🌟');
    setTimeout(() => setBadgeToast(null), 3500);
  };

  const handleRecharge = (amount: number) => {
    onUpdateCoins(currentUser.coins + amount);
    alert(`🎉 تم شحن ${amount} عملة بنجاح! رصيدك الجديد: ${(currentUser.coins + amount).toFixed(2)} عملة`);
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gradient-to-b from-[#f9f4fb] via-[#f7f0fa] to-[#f0e4f2] text-slate-900" dir="rtl">
      {/* Toast Notification for Badge Activation */}
      {badgeToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-950/95 text-amber-300 font-bold text-xs border border-amber-400 glow-gold-pulse flex items-center gap-2 shadow-2xl animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{badgeToast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('edit')}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition"
            title="تعديل الملف الشخصي"
          >
            <Edit3 className="w-5 h-5" />
          </button>

          {onOpenSwitchUser && (
            <button
              onClick={onOpenSwitchUser}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-bold transition border border-pink-200"
              title="تجربة مستخدم جديد"
            >
              <span>تبديل الحساب</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setActiveModal('settings')}
          className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition"
          title="الإعدادات"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* User Identity Profile Card matching Screenshot 4 with Golden VIP Glow */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div className="text-right">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-lg font-black text-slate-900">{currentUser.name}</h1>
            <span className="w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-black">
              ✦
            </span>

            {/* Active VIP Badge Pill with Golden Glow Effect */}
            {activeBadge && (
              <button
                onClick={() => setActiveModal('vip_badges')}
                className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-[10px] glow-gold-pulse shadow-md transition transform hover:scale-105 active:scale-95 border border-yellow-200"
                title={`${activeBadge.name} (${activeBadge.tier}) - انقر لتغيير الشارة`}
              >
                <span className="text-xs">{activeBadge.icon}</span>
                <span className="tracking-wide">{activeBadge.name}</span>
                <span className="text-[9px] bg-slate-950/20 px-1 py-0.2 rounded font-mono">
                  {activeBadge.tier}
                </span>
              </button>
            )}
          </div>

          {/* Country flag and ID with Copy */}
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
            <span className="text-base">{currentUser.countryFlag}</span>
            <span>{currentUser.country}</span>
            <div
              onClick={handleCopyId}
              className="flex items-center gap-1 cursor-pointer bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 text-amber-900 hover:from-amber-200 hover:to-yellow-200 px-2 py-0.5 rounded-full transition active:scale-95 shadow-xs"
              title="نسخ المعرف ID المميز"
            >
              <span className="font-mono text-[11px] font-black tracking-wide">ID:{currentUser.id}</span>
              <span className="text-[10px]">👑</span>
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-amber-700" />}
            </div>
          </div>

          {/* Coins and VIP level badges bar */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <span>🪙</span>
              <span>{currentUser.coins.toLocaleString()} Coins</span>
            </span>
            <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <span>⭐</span>
              <span>Lv.{currentUser.badgeLevel}</span>
            </span>
            <span className="bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <span>👑</span>
              <span>VIP {currentUser.vipLevel}</span>
            </span>
          </div>
        </div>

        {/* Profile Avatar with Royal VIP 5 Supreme Golden Emperor Frame */}
        <div 
          onClick={() => setActiveModal('vip_badges')}
          className="relative group cursor-pointer"
          title="إطار VIP 5 الإمبراطوري المتوهج - انقر للتخصيص"
        >
          {/* VIP 5 Rotating Solar Shimmer & Multi-layer Glow */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 opacity-90 blur-md vip5-frame-glow pointer-events-none" />
          
          {/* VIP 5 Golden Wings on Sides */}
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 text-2xl select-none filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse pointer-events-none">
            🪽
          </div>
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 text-2xl select-none filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] -scale-x-100 animate-pulse pointer-events-none">
            🪽
          </div>

          {/* VIP 5 Supreme Golden Crown on Top of Avatar */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none filter drop-shadow-[0_0_10px_rgba(245,158,11,1)]">
            <span className="text-xl animate-bounce">👑</span>
          </div>

          {/* VIP 5 Level Ribbon Pill */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-[9px] shadow-lg border border-yellow-200 glow-gold-pulse flex items-center gap-0.5 whitespace-nowrap">
            <span>VIP 5</span>
            <span className="text-[10px]">✨</span>
          </div>

          {/* Golden Emperor Metal Outer Ring */}
          <div className="w-20 h-20 rounded-full p-1.5 bg-gradient-to-tr from-amber-300 via-yellow-400 to-orange-500 shadow-2xl relative z-10 ring-4 ring-amber-400/90 border-2 border-white">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 4 Stats Grid: المتابع, تابع, زائر, الإيرادات matching Screenshot 4 */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 grid grid-cols-4 text-center divide-x divide-x-reverse divide-slate-100">
          <div>
            <div className="text-base font-black text-slate-900">{currentUser.followers}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">المتابع</div>
          </div>
          <div>
            <div className="text-base font-black text-slate-900">{currentUser.following}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">تابع</div>
          </div>
          <div>
            <div className="text-base font-black text-slate-900">{currentUser.visitors}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">زائر</div>
          </div>
          <div>
            <div className="text-base font-black text-slate-900">{currentUser.earnings}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">الإيرادات</div>
          </div>
        </div>
      </div>

      {/* VIP Exclusive Banner matching Screenshot 4 */}
      <div className="px-4 py-1.5">
        <div
          onClick={() => setActiveModal('vip')}
          className="rounded-2xl p-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-950 text-white flex items-center justify-between cursor-pointer shadow-md hover:opacity-95 transition"
        >
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-lg flex items-center gap-1 shadow">
              VIP 👑
            </span>
            <span className="text-xs font-bold text-amber-200">امتيازات حصرية</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-indigo-300" />
        </div>
      </div>

      {/* Dedicated VIP Badges Showcase Section with Golden Glow */}
      <div className="px-4 py-2">
        <div className="rounded-3xl p-3.5 bg-gradient-to-br from-amber-950/20 via-yellow-950/15 to-slate-900/10 border-2 border-amber-400/50 shadow-md relative overflow-hidden">
          {/* Shimmer background bar */}
          <div className="absolute inset-0 pointer-events-none opacity-40 gold-shimmer-bg" />

          <div className="relative z-10 flex items-center justify-between pb-2 border-b border-amber-300/30">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
              <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span className="text-sm">شارات VIP الملكية</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                توهج ذهبي
              </span>
            </div>
            <button
              onClick={() => setActiveModal('vip_badges')}
              className="text-[11px] text-amber-700 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>الخزانة الملكية</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Badges Scroll with Golden Glow */}
          <div className="relative z-10 pt-2.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            {badges.map((b) => {
              const isEquipped = b.id === activeBadgeId;
              return (
                <div
                  key={b.id}
                  onClick={() => handleEquipBadge(b)}
                  className={`flex-shrink-0 w-28 p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-between text-center select-none active:scale-95 ${
                    isEquipped
                      ? 'bg-gradient-to-b from-amber-400/30 via-yellow-300/20 to-amber-500/10 border-amber-400 glow-gold-pulse shadow-md ring-2 ring-amber-400/60'
                      : b.isUnlocked
                      ? 'bg-white/80 border-amber-200/80 hover:border-amber-400 shadow-xs'
                      : 'bg-slate-100/70 border-slate-200 opacity-60'
                  }`}
                >
                  {/* Status Indicator */}
                  {isEquipped ? (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[8px] font-black px-2 py-0.2 rounded-full shadow flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-slate-950 animate-ping" />
                      مفعّلة
                    </span>
                  ) : !b.isUnlocked ? (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                      مقفلة
                    </span>
                  ) : null}

                  {/* Badge Icon with glowing container */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 mt-1 ${
                      isEquipped
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-md glow-gold scale-105'
                        : 'bg-amber-100/80 text-amber-700'
                    }`}
                  >
                    <span>{b.icon}</span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-900 mt-1.5 truncate w-full">
                    {b.name}
                  </span>

                  <span className="text-[9px] text-amber-700 font-extrabold mt-0.5">
                    {b.tier}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* "حقيبتي" (My Wallet) Cards matching Screenshot 4 */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between pb-1.5 px-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
            <Briefcase className="w-4 h-4 text-pink-600" />
            <span>حقيبتي</span>
          </div>
          <button
            onClick={() => setActiveModal('wallet')}
            className="text-[11px] text-pink-600 font-bold hover:underline"
          >
            سجل المعاملات
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Total Coins - Amber Gold Gradient */}
          <div
            onClick={() => onOpenWallet ? onOpenWallet() : setActiveModal('wallet')}
            className="rounded-3xl p-3.5 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-200 border border-amber-300/80 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition active:scale-[0.98]"
          >
            <div className="flex items-center justify-between text-amber-950">
              <span className="text-xs font-black">رصيد الكوينز</span>
              <span className="text-xl">🪙</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1 text-slate-900">
              <span className="text-xl font-black">{currentUser.coins.toLocaleString()}</span>
              <span className="text-xs font-bold text-amber-950">Coins</span>
            </div>
          </div>

          {/* Card 2: Earnings / Cashable Coins - Emerald Violet Gradient */}
          <div
            onClick={() => onOpenWallet ? onOpenWallet() : setActiveModal('wallet')}
            className="rounded-3xl p-3.5 bg-gradient-to-br from-purple-300 via-pink-300 to-rose-200 border border-purple-300/60 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition active:scale-[0.98]"
          >
            <div className="flex items-center justify-between text-purple-950">
              <span className="text-xs font-black">أرباح البث</span>
              <span className="text-xl">💰</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1 text-slate-900">
              <span className="text-xl font-black">{currentUser.earnings.toLocaleString()}</span>
              <span className="text-xs font-bold text-purple-950">كوينز قابلة للسحب</span>
            </div>
          </div>
        </div>
      </div>

      {/* "إنشاء غرفتك الخاصة" Banner with big (+) button matching Screenshot 4 */}
      <div className="px-4 py-2">
        <div
          onClick={onOpenCreateRoom}
          className="rounded-3xl p-3.5 bg-gradient-to-r from-pink-100 via-purple-100 to-pink-50 border border-pink-200 shadow-sm flex items-center justify-between cursor-pointer group hover:border-pink-300 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <span className="text-lg">🎙️</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-black text-slate-900">
                <span>إنشاء</span>
                <span className="text-xs text-pink-600 bg-pink-100 px-1.5 py-0.2 rounded">غرفة</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">أنشئ غرفتك الخاصة وابدأ استقبال الزوار</p>
            </div>
          </div>

          {/* Large (+) Button */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/40 group-hover:scale-105 active:scale-95 transition">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Menu List matching Screenshot 4 */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 flex flex-col divide-y divide-slate-100">
          {/* شارات VIP الملكية الذهبية */}
          <div
            onClick={() => setActiveModal('vip_badges')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-amber-50/60 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center glow-gold-pulse shadow-sm">
                <Crown className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                  شارات VIP الذهبية
                </span>
                <span className="block text-[10px] text-amber-600 font-bold">
                  {activeBadge?.name} • مفعّلة الآن
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold px-2 py-0.5 rounded-full glow-gold shadow-xs">
                توهج ذهبي ✨
              </span>
              <ChevronLeft className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          {/* المستوى (Level) */}
          <div
            onClick={() => onOpenLevels ? onOpenLevels() : setActiveModal('level')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 rounded-2xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">المستويات والمكافآت (Levels)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="text-pink-600 font-bold">Lv.{currentUser.badgeLevel}</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

          {/* العائلات (Families) */}
          <div
            onClick={() => onOpenFamilies ? onOpenFamilies() : alert('العائلات')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 rounded-2xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">عائلتي (Families)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="text-indigo-600 font-bold">{currentUser.familyName || 'صقور العرب'}</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

          {/* المتجر (Mall) */}
          <div
            onClick={() => setActiveModal('mall')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 rounded-2xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">متجر الهدايا والإطارات (Mall)</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </div>

          {/* خاص ID (Special ID) */}
          <div
            onClick={() => setActiveModal('special_id')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 rounded-2xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">خاص ID</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </div>

          {/* مكافأة (Rewards) */}
          <div
            onClick={() => setActiveModal('rewards')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 rounded-2xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">مكافأة</span>
            </div>
            <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
              جاهزة
            </span>
          </div>

          {/* حقيبة السلعة (Backpack / Inventory) */}
          <div
            onClick={() => setActiveModal('backpack')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 rounded-2xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">حقيبة السلعة</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </div>

          {/* خدمة العملاء (Support) */}
          <div
            onClick={() => alert('مرحباً بك في خدمة عملاء PartyLive! الدعم الفني متاح 24/7')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 rounded-2xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">خدمة العملاء</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* VIP Badges Management Modal with Golden Glow */}
      {activeModal === 'vip_badges' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 text-slate-900 font-sans">
          <div className="w-full max-w-md bg-gradient-to-b from-[#1c1204] via-[#150d03] to-[#0d0701] text-white rounded-t-3xl sm:rounded-3xl border-2 border-amber-400/80 p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg glow-gold-pulse">
                  <Crown className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-base text-amber-300 flex items-center gap-1.5">
                    <span>خزانة شارات VIP الملكية</span>
                    <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </h3>
                  <p className="text-[11px] text-amber-200/80">اختر شارتك الذهبية لتتألق بها في الملف والغرف</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
              >
                ✕
              </button>
            </div>

            {/* Current Active Badge Spotlight Card with Live Glow */}
            <div className="my-4 p-4 rounded-3xl bg-gradient-to-br from-amber-500/25 via-yellow-500/10 to-transparent border-2 border-amber-400/80 glow-gold-pulse relative overflow-hidden text-right">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow">
                  الشارة النشطة حالياً ✨
                </span>
                <span className="text-xs font-black text-amber-300">{activeBadge.tier}</span>
              </div>

              <div className="flex items-center gap-3 my-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-3xl shadow-xl glow-gold">
                  {activeBadge.icon}
                </div>
                <div>
                  <h4 className="text-base font-black text-white">{activeBadge.name}</h4>
                  <p className="text-xs text-amber-200/90 mt-0.5 leading-snug">{activeBadge.description}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-amber-400/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>الميزة: {activeBadge.perk}</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  الهالة مفعّلة
                </span>
              </div>
            </div>

            {/* Badges Selection Grid */}
            <h4 className="text-xs font-black text-amber-200 mb-2">الشارات المتاحة لكبار الشخصيات:</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {badges.map((b) => {
                const isSelected = b.id === activeBadgeId;
                return (
                  <div
                    key={b.id}
                    onClick={() => handleEquipBadge(b)}
                    className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-right relative ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 glow-gold ring-2 ring-amber-400/60'
                        : b.isUnlocked
                        ? 'bg-white/5 border-amber-500/30 hover:border-amber-400 hover:bg-white/10'
                        : 'bg-black/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl">
                        {b.icon}
                      </div>
                      <span className="text-[10px] font-black text-amber-300 bg-black/40 px-1.5 py-0.5 rounded border border-amber-400/20">
                        {b.tier}
                      </span>
                    </div>

                    <h5 className="font-black text-xs text-white leading-tight">{b.name}</h5>
                    <p className="text-[10px] text-slate-300 mt-1 line-clamp-2 leading-tight">
                      {b.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                      {isSelected ? (
                        <span className="text-[10px] text-amber-300 font-black flex items-center gap-1">
                          <Check className="w-3 h-3 text-amber-400" />
                          مفعّلة
                        </span>
                      ) : b.isUnlocked ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipBadge(b);
                          }}
                          className="w-full py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] shadow"
                        >
                          تفعيل الشارة
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnlockBadgeTrial(b.id);
                          }}
                          className="w-full py-1 rounded-lg bg-purple-700/80 hover:bg-purple-600 text-white font-bold text-[9px]"
                        >
                          فتح تجريبي 🔓
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition"
            >
              حفظ والإغلاق
            </button>
          </div>
        </div>
      )}

      {/* Wallet / Recharge Modal */}
      {activeModal === 'wallet' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-[440px] bg-white rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">محفظة الكوينز والماسات</h3>
              <span className="text-xs text-amber-600 font-bold">
                رصيدك: {currentUser.coins.toFixed(2)} عملة 🪙
              </span>
            </div>

            <p className="text-xs text-slate-500">اختر الباقة المناسبة للشحن الفوري:</p>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { coins: 50, price: '$0.99', bonus: '+5' },
                { coins: 200, price: '$2.99', bonus: '+25' },
                { coins: 500, price: '$6.99', bonus: '+80' },
                { coins: 1000, price: '$12.99', bonus: '+200' },
                { coins: 2500, price: '$29.99', bonus: '+600' },
                { coins: 5000, price: '$49.99', bonus: '+1500' },
              ].map((pkg) => (
                <button
                  key={pkg.coins}
                  onClick={() => handleRecharge(pkg.coins)}
                  className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex flex-col items-center justify-center transition active:scale-95"
                >
                  <span className="text-lg">🪙</span>
                  <span className="font-black text-sm text-slate-900 mt-1">{pkg.coins}</span>
                  <span className="text-[10px] text-amber-700 font-bold">{pkg.bonus} إضافي</span>
                  <span className="text-xs font-bold text-pink-600 mt-1">{pkg.price}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* VIP Perks Modal */}
      {activeModal === 'vip' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-amber-400 text-center animate-scaleUp glow-gold-pulse">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 mx-auto flex items-center justify-center text-3xl mb-3 shadow-lg">
              👑
            </div>
            <h3 className="text-lg font-black text-amber-300">امتيازات VIP 5 الإمبراطورية</h3>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              تهانينا! أنت الآن في أعلى رتبة VIP 5 الإمبراطورية مع إطار الأجنحة الذهبية المشعة وهيبة الصدارة!
            </p>
            <div className="flex flex-col gap-2 text-right text-xs text-slate-200 mb-5">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/40">
                <span className="text-lg">🪽</span>
                <span className="font-bold text-amber-200">إطار الأجنحة الذهبية والتاج الإمبراطوري</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800">
                <span className="text-lg">🏎️</span>
                <span>تأثير دخول حصري بطائرة الهليكوبتر والسيارة الفارهة</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800">
                <span className="text-lg">💬</span>
                <span>فقاعة دردشة ذهبية متوهجة وتأثير بريق الاسم</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800">
                <span className="text-lg">🛡️</span>
                <span>حصانة ملكية كاملة ضد الكتم + صدارة المايكات</span>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md"
            >
              تم استلام الإطار والامتيازات 👑
            </button>
          </div>
        </div>
      )}

      {/* Rewards / Daily Check-in Modal */}
      {activeModal === 'rewards' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 mx-auto flex items-center justify-center text-3xl mb-3">
              🎁
            </div>
            <h3 className="text-lg font-black text-slate-900">مكافأة تسجيل الدخول اليومية</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              تسجيل اليوم الأول نشط! استلم 5 عملات ذهبية مجاناً.
            </p>
            <button
              onClick={() => {
                handleRecharge(5);
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md"
            >
              استلام المكافأة (5 🪙)
            </button>
          </div>
        </div>
      )}

      {/* Mall / Store Modal */}
      {activeModal === 'mall' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-[440px] bg-white rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <h3 className="font-bold text-base text-slate-900">متجر التميز والشارات</h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'إطار الملوك الذهبي', cost: 100, icon: '👑' },
                { name: 'سيارة الرول رويس', cost: 300, icon: '🏎️' },
                { name: 'جناح الملاك الوردي', cost: 250, icon: '🪽' },
                { name: 'فقاعة نيون فضائية', cost: 80, icon: '🪐' },
              ].map((item) => (
                <div key={item.name} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center">
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  <span className="text-[11px] text-amber-600 font-bold mt-1">{item.cost} عملة</span>
                  <button
                    onClick={() => {
                      if (currentUser.coins >= item.cost) {
                        onUpdateCoins(currentUser.coins - item.cost);
                        alert(`مبروك! تم شراء ${item.name}`);
                      } else {
                        alert('رصيد الكوينز غير كافٍ، يمكنك شحن المحفظة أولاً');
                      }
                    }}
                    className="mt-2 w-full py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold"
                  >
                    شراء الآن
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Special ID Modal */}
      {activeModal === 'special_id' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
              🆔
            </div>
            <h3 className="text-lg font-black text-slate-900">معرف الحساب المميز (خاص ID)</h3>
            <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                معرف ملكي رباعي نشط
              </span>
              <span className="font-mono text-3xl font-black text-slate-900 tracking-wider">
                ID: {currentUser.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              هذا المعرف الرباعي النادر مفعّل رسمياً ومربوط بحسابك الملكي 👑
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-md"
            >
              تم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
