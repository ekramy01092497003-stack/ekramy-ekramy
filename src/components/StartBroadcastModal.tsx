import React, { useState } from 'react';
import { VoiceRoom, UserProfile } from '../types';
import { X, Mic, Video, Sparkles, Lock, Globe } from 'lucide-react';

interface StartBroadcastModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onCreateRoom: (room: VoiceRoom) => void;
}

export const StartBroadcastModal: React.FC<StartBroadcastModalProps> = ({
  currentUser,
  onClose,
  onCreateRoom,
}) => {
  const [mode, setMode] = useState<'audio' | 'video'>('audio');
  const [title, setTitle] = useState(`غرفة ${currentUser.name} للمرح`);
  const [category, setCategory] = useState('دردشة وسهرة');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRoom: VoiceRoom = {
      id: `room-${Date.now()}`,
      title: title.trim(),
      category,
      country: currentUser.country,
      countryFlag: currentUser.countryFlag,
      coverImage: currentUser.avatar,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostId: currentUser.id,
      onlineCount: 1,
      rankBadge: 'New',
      tags: [category, 'مباشر'],
      gradient: 'from-purple-900 via-pink-900 to-black',
      announcement: `أهلاً بكم في غرفة ${currentUser.name}! مرحباً بالجميع.`,
      admins: [],
      moderators: [],
      bannedUsers: [],
      mutedUsers: [],
      seats: [
        {
          seatNumber: 1,
          occupied: true,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          role: 'host',
          isSpeaking: true,
        },
        { seatNumber: 2, occupied: false },
        { seatNumber: 3, occupied: false },
        { seatNumber: 4, occupied: false },
        { seatNumber: 5, occupied: false },
        { seatNumber: 6, occupied: false },
        { seatNumber: 7, occupied: false },
        { seatNumber: 8, occupied: false },
        { seatNumber: 9, occupied: false },
      ],
    };

    onCreateRoom(newRoom);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 text-white" dir="rtl">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 rounded-t-3xl sm:rounded-3xl border border-purple-500/40 p-5 shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF37C8] to-[#E43AD8] flex items-center justify-center shadow-md">
              <span className="text-white text-base">●</span>
            </div>
            <div>
              <h2 className="text-base font-black text-white">بدء بث أو غرفة جديدة</h2>
              <p className="text-[11px] text-purple-200">اختر نوع البث وابدأ التفاعل فوراً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Mode Selector (Voice Party vs Live Video) */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <button
            type="button"
            onClick={() => setMode('audio')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition active:scale-95 ${
              mode === 'audio'
                ? 'bg-gradient-to-br from-pink-600/40 to-purple-600/40 border-pink-400 ring-2 ring-pink-500/40'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-pink-500/30 flex items-center justify-center text-pink-400 mb-1.5">
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-white">غرفة صوتية (9 مايكات)</span>
            <span className="text-[10px] text-purple-200 mt-0.5">دردشة، طرب، وألعاب</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('video')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition active:scale-95 ${
              mode === 'video'
                ? 'bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border-purple-400 ring-2 ring-purple-500/40'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 mb-1.5">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-white">بث مباشر فيديو</span>
            <span className="text-[10px] text-purple-200 mt-0.5">تفاعل وجه لوجه</span>
          </button>
        </div>

        {/* Room configuration form */}
        <form onSubmit={handleStart} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">عنوان الغرفة</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب عنواناً جذاباً..."
              className="w-full bg-white/10 text-white rounded-xl py-2 px-3 text-xs outline-none border border-white/15 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">تصنيف الغرفة</label>
            <div className="flex flex-wrap gap-1.5">
              {['دردشة وسهرة', 'طرب وأغاني', 'شحن وألعاب', 'مسابقات كبرى', 'تعارف وحوار'].map(
                (cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-[11px] px-3 py-1 rounded-full font-bold transition ${
                      category === cat
                        ? 'bg-gradient-to-r from-[#FF37C8] to-[#E43AD8] text-white shadow'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Privacy Switch */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
              {isPrivate ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Globe className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isPrivate ? 'غرفة خاصة برقم سري' : 'غرفة عامة للجميع'}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isPrivate ? 'bg-pink-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isPrivate ? 'translate-x-[-20px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {isPrivate && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة مرور الغرفة (4 أرقام)..."
              maxLength={6}
              className="w-full bg-white/10 text-white rounded-xl py-2 px-3 text-xs outline-none border border-amber-400/40"
            />
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className="mt-3 w-full py-3 rounded-2xl text-white font-bold text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #FF37C8 0%, #E43AD8 100%)',
              boxShadow: '0 8px 25px rgba(255, 55, 200, 0.45)',
            }}
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>بدء الغرفة الآن</span>
          </button>
        </form>
      </div>
    </div>
  );
};
