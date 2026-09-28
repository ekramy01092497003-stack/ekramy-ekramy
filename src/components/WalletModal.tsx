import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Wallet, Plus, History, Gift, ShieldCheck, 
  ArrowUpRight, ArrowDownLeft, X, Sparkles, CheckCircle2 
} from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateCoins: (newCoins: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCoins,
}) => {
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const coinPackages = [
    { coins: 500, price: '4.99 $', bonus: '+50 كوينز مجاناً', tag: 'شائع' },
    { coins: 1200, price: '9.99 $', bonus: '+150 كوينز مجاناً', tag: 'توفير' },
    { coins: 3000, price: '24.99 $', bonus: '+500 كوينز مجاناً', tag: 'الأكثر طلباً' },
    { coins: 7000, price: '49.99 $', bonus: '+1500 كوينز مجاناً', tag: 'كبار الداعمين' },
    { coins: 15000, price: '99.99 $', bonus: '+4000 كوينز مجاناً', tag: 'VIP ملكي' },
    { coins: 35000, price: '199.99 $', bonus: '+10000 كوينز مجاناً', tag: 'حوت الحفلات' },
  ];

  const handleRecharge = (coins: number) => {
    onUpdateCoins(currentUser.coins + coins);
    setSuccessMsg(`تم شحن ${coins.toLocaleString()} كوينز بنجاح في محفظتك! 🎉`);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 text-white font-sans" dir="rtl">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#1a0f2e] to-slate-950 rounded-t-3xl sm:rounded-3xl border border-amber-500/30 p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
              🪙
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-1.5">
                <span>المحفظة والشحن (Wallet & Coins)</span>
              </h3>
              <p className="text-[11px] text-amber-200">العملة الموحدة الوحيدة في التطبيق</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Current Balance Card */}
        <div className="mt-4 p-4 rounded-3xl bg-gradient-to-r from-amber-600/30 via-yellow-500/20 to-purple-600/30 border border-amber-400/40 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-7xl opacity-15 select-none pointer-events-none">
            🪙
          </div>
          <div>
            <span className="text-xs text-amber-200 block font-medium">الرصيد الكلي المتاح</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-black text-yellow-300 tracking-tight">
                {currentUser.coins.toLocaleString()}
              </span>
              <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                Coins 🪙
              </span>
            </div>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-300 block">أرباح البث القابلة للسحب</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
              {currentUser.earnings.toLocaleString()} كوينز
            </span>
          </div>
        </div>

        {/* Coin Packages Grid */}
        <div className="mt-5">
          <h4 className="text-xs font-black text-slate-200 mb-2 flex items-center justify-between">
            <span>باقات الشحن الرسمية المباشرة:</span>
            <span className="text-[10px] text-amber-400 font-normal">شحن فوري ⚡</span>
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {coinPackages.map((pack, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPack(idx)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  selectedPack === idx
                    ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-amber-400/40 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-yellow-300 flex items-center gap-1">
                    <span>{pack.coins.toLocaleString()}</span>
                    <span className="text-xs">🪙</span>
                  </span>
                  <span className="text-[9px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-1.5 py-0.5 rounded-full font-bold">
                    {pack.tag}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-300 font-bold mt-1">
                  {pack.bonus}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecharge(pack.coins);
                  }}
                  className="mt-2.5 w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:from-amber-400 hover:to-yellow-400 transition active:scale-95"
                >
                  {pack.price}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security and Trust note */}
        <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-[11px] text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>نظام شحن محمي ومشفر 100% بدون أي وساطة، والعملة الوحيدة هي الكوينز.</span>
        </div>
      </div>
    </div>
  );
};
