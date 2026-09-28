import React, { useState, useEffect, useRef } from 'react';
import { VoiceRoom, VoiceSeat, GiftItem, UserProfile, RoomRole, HandRaiseRequest } from '../types';
import { mockGifts } from '../data/mockData';
import { GiftAnimationOverlay } from './GiftAnimationOverlay';
import { SeatManagementModal } from './SeatManagementModal';
import { HandRaiseModal } from './HandRaiseModal';
import { 
  X, Mic, MicOff, Volume2, Share2, 
  Send, Heart, Crown, Gift, Sparkles, ChevronDown,
  Wand2, Radio, Sliders, Music, Smile, Play, Check,
  Hand, Shield, UserX, Ban
} from 'lucide-react';

interface VoiceRoomModalProps {
  room: VoiceRoom;
  currentUser: UserProfile;
  onClose: () => void;
  onUpdateCoins: (newCoins: number) => void;
}

export interface VoiceFilter {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  type: 'enhancement' | 'funny' | 'spatial';
  pitch: number; // Semitones / playback rate multiplier
  echo: number;
  reverb: string;
  description: string;
  tag: string;
  color: string;
}

export const voiceFiltersList: VoiceFilter[] = [
  {
    id: 'original',
    name: 'الصوت الطبيعي',
    nameEn: 'Original',
    icon: '🎙️',
    type: 'enhancement',
    pitch: 1.0,
    echo: 0,
    reverb: 'خام',
    description: 'صوتك الحقيقي بدون أي مؤثرات مع تنقية أساسية',
    tag: 'طبيعي',
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'studio_pro',
    name: 'استوديو نقي (Studio HD)',
    nameEn: 'Studio HD',
    icon: '✨',
    type: 'enhancement',
    pitch: 1.0,
    echo: 0.15,
    reverb: 'دافئ',
    description: 'تحسين نبرة الصوت، إزالة التشويش، وتضخيم الدفء الإذاعي',
    tag: 'احترافي',
    color: 'from-amber-600 to-yellow-600',
  },
  {
    id: 'concert_hall',
    name: 'صدى الحفلات (Concert)',
    nameEn: 'Concert Hall',
    icon: '🏛️',
    type: 'spatial',
    pitch: 1.0,
    echo: 0.45,
    reverb: 'قاعة كبرى',
    description: 'صدى صوت سينمائي شبيه بمسارح الغناء وحفلات الطرب',
    tag: 'طرب',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'chipmunk',
    name: 'السنجاب المضحك (Chipmunk)',
    nameEn: 'Chipmunk',
    icon: '🐿️',
    type: 'funny',
    pitch: 1.65,
    echo: 0,
    reverb: 'سريع وحاد',
    description: 'رفع طبقة الصوت لنبرة كوميدية مرحة ومضحكة جداً',
    tag: 'مضحك',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'robot',
    name: 'الروبوت الفضائي (Cyborg)',
    nameEn: 'Robot',
    icon: '🤖',
    type: 'funny',
    pitch: 0.88,
    echo: 0.35,
    reverb: 'معدني',
    description: 'نبرة إلكترونية رقمية روبوتية بنمط الأجهزة الذكية',
    tag: 'خيال',
    color: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'deep_giant',
    name: 'العملاق الضخم (Deep Bass)',
    nameEn: 'Deep Giant',
    icon: '🗿',
    type: 'funny',
    pitch: 0.65,
    echo: 0.25,
    reverb: 'جهير عميق',
    description: 'تضخيم عميق جداً لترددات البيس لصوت مرعب وقوي',
    tag: 'ضخم',
    color: 'from-red-800 to-slate-900',
  },
  {
    id: 'radio_80s',
    name: 'مذياع كلاسيكي (Vintage Radio)',
    nameEn: 'Vintage Radio',
    icon: '📻',
    type: 'enhancement',
    pitch: 1.05,
    echo: 0.1,
    reverb: 'FM حنين',
    description: 'مرشح صوتي بنمط راديو الثمانينات الكلاسيكي القديم',
    tag: 'كلاسيك',
    color: 'from-emerald-700 to-teal-900',
  },
];

interface RoomChatMessage {
  id: string;
  sender: string;
  text: string;
  isSpecial?: boolean;
  avatar?: string;
  isGift?: boolean;
}

export const VoiceRoomModal: React.FC<VoiceRoomModalProps> = ({
  room,
  currentUser,
  onClose,
  onUpdateCoins,
}) => {
  const [seats, setSeats] = useState<VoiceSeat[]>(room.seats);
  const [userSeatIndex, setUserSeatIndex] = useState<number | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [showGiftSheet, setShowGiftSheet] = useState(false);
  const [showAudioFilterModal, setShowAudioFilterModal] = useState(false);
  const [activeFilterId, setActiveFilterId] = useState<string>('studio_pro');
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  const [micVolume, setMicVolume] = useState<number>(85);
  const [noiseReduction, setNoiseReduction] = useState<boolean>(true);
  const [filterToast, setFilterToast] = useState<string | null>(null);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<GiftItem | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // RBAC Roles & Room Administration state
  const isOwner = room.hostId === currentUser.id || currentUser.id === '1000';
  const isAdmin = isOwner || (room.admins && room.admins.includes(currentUser.id));
  const isModerator = isAdmin || (room.moderators && room.moderators.includes(currentUser.id));
  const currentUserRole: RoomRole = isOwner ? 'owner' : isAdmin ? 'admin' : isModerator ? 'moderator' : userSeatIndex !== null ? 'speaker' : 'listener';

  const [selectedSeatToManage, setSelectedSeatToManage] = useState<{ seat: VoiceSeat; index: number } | null>(null);
  const [handRaiseRequests, setHandRaiseRequests] = useState<HandRaiseRequest[]>([
    { id: 'req-1', userId: 'user-wait-1', userName: 'أبو فهد 🇸🇦', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', requestedAt: 'منذ دقيقة' },
    { id: 'req-2', userId: 'user-wait-2', userName: 'مريم لايف 🌸', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', requestedAt: 'منذ دقيقتين' },
  ]);
  const [showHandRaiseModal, setShowHandRaiseModal] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [bannedUserIds, setBannedUserIds] = useState<string[]>(room.bannedUsers || []);

  const [chatMessages, setChatMessages] = useState<RoomChatMessage[]>([
    { id: '1', sender: 'النظام', text: 'مرحباً بك في الغرفة! يرجى الالتزام بالاحترام المتبادل 🛡️', isSpecial: true },
    { id: '2', sender: 'سارة لايف', text: 'نورتوا الغرفة جميعاً يا هلا والله 💖' },
    { id: '3', sender: 'أحمد ملك', text: 'أجمل سهرة مع كابتن جراح والعائلة الملكية' },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [roomScore, setRoomScore] = useState(128400);

  const activeFilter = voiceFiltersList.find((f) => f.id === activeFilterId) || voiceFiltersList[0];

  // Play synthetic audio preview for testing filters
  const playFilterPreview = (filter: VoiceFilter) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setPreviewPlaying(filter.id);

      // Create an oscillator tone sequence simulating voice speech
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      const baseFreq = 260 * filter.pitch;
      osc.type = filter.id === 'robot' ? 'sawtooth' : filter.id === 'radio_80s' ? 'square' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, ctx.currentTime + 0.35);

      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime((micVolume / 100) * 0.25, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);

      setTimeout(() => {
        setPreviewPlaying(null);
      }, 700);
    } catch {
      setPreviewPlaying(null);
    }
  };

  const handleApplyFilter = (filter: VoiceFilter) => {
    setActiveFilterId(filter.id);
    playFilterPreview(filter);
    setFilterToast(`تم تفعيل فلتر "${filter.name}" للمايك الخاص بك! 🎙️✨`);
    setTimeout(() => setFilterToast(null), 3500);

    // Announce filter switch in room chat if user is seated
    if (userSeatIndex !== null) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: currentUser.name,
          text: `فعل فلتر الصوت: ${filter.icon} ${filter.name}`,
          isSpecial: true,
        },
      ]);
    }
  };

  // Check if current user is already in a seat
  useEffect(() => {
    const idx = seats.findIndex(s => s.userId === currentUser.id);
    if (idx !== -1) {
      setUserSeatIndex(idx);
    }
  }, [seats, currentUser.id]);

  // Periodic random room activity simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const activeVoiceSeats = seats.map((seat) => {
        if (!seat.occupied) return seat;
        // randomly toggle speaking
        const rand = Math.random();
        return {
          ...seat,
          isSpeaking: rand > 0.4,
        };
      });
      setSeats(activeVoiceSeats);
    }, 2800);
    return () => clearInterval(timer);
  }, [seats]);

  const handleSeatClick = (index: number) => {
    const seat = seats[index];
    if (seat.occupied) {
      if (seat.userId === currentUser.id) {
        // Leave seat
        const updated = [...seats];
        updated[index] = { seatNumber: seat.seatNumber, occupied: false };
        setSeats(updated);
        setUserSeatIndex(null);
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'النظام',
            text: `نزل ${currentUser.name} من المايك رقم ${index + 1}`,
            isSpecial: true,
          },
        ]);
      } else {
        // Open management modal if admin/moderator/owner or inspection
        setSelectedSeatToManage({ seat, index });
      }
      return;
    }

    // Occupy empty seat
    const updated = [...seats];
    if (userSeatIndex !== null) {
      updated[userSeatIndex] = { seatNumber: seats[userSeatIndex].seatNumber, occupied: false };
    }
    updated[index] = {
      seatNumber: seat.seatNumber,
      occupied: true,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      isMuted: isMicMuted,
      isSpeaking: true,
      role: currentUserRole === 'owner' ? 'owner' : currentUserRole === 'admin' ? 'admin' : 'speaker',
    };
    setSeats(updated);
    setUserSeatIndex(index);

    // Announce in chat
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'النظام',
        text: `صعد ${currentUser.name} إلى المايك رقم ${index + 1} 🎙️`,
        isSpecial: true,
      },
    ]);
  };

  // Mute specific user (Moderator / Admin / Owner)
  const handleMuteUser = (targetUserId: string) => {
    setSeats((prev) =>
      prev.map((s) => (s.userId === targetUserId ? { ...s, isMuted: !s.isMuted, isSpeaking: false } : s))
    );
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'النظام',
        text: `تم تعديل حالة كتم المايك للمستخدم بواسطة المشرف 🛡️`,
        isSpecial: true,
      },
    ]);
  };

  // Kick from seat (Moderator / Admin / Owner)
  const handleKickUser = (seatIndex: number, targetUserId: string) => {
    setSeats((prev) => {
      const copy = [...prev];
      copy[seatIndex] = { seatNumber: copy[seatIndex].seatNumber, occupied: false };
      return copy;
    });
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'النظام',
        text: `تم إنزال المستخدم من المايك بواسطة إدارة الغرفة ⚡`,
        isSpecial: true,
      },
    ]);
  };

  // Ban from room (Admin / Owner)
  const handleBanUser = (targetUserId: string, targetUserName: string) => {
    setBannedUserIds((prev) => [...prev, targetUserId]);
    setSeats((prev) =>
      prev.map((s) => (s.userId === targetUserId ? { seatNumber: s.seatNumber, occupied: false } : s))
    );
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'النظام',
        text: `تم طرد وحظر "${targetUserName}" من الغرفة نهائياً 🚫`,
        isSpecial: true,
      },
    ]);
  };

  // Promote / Change role (Owner only)
  const handleChangeRole = (targetUserId: string, newRole: RoomRole) => {
    setSeats((prev) =>
      prev.map((s) => (s.userId === targetUserId ? { ...s, role: newRole } : s))
    );
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'النظام',
        text: `تمت ترقية العضو لرتبة ${newRole === 'admin' ? 'مدير 🛡️' : 'مشرف ⚡'} بواسطة المالك`,
        isSpecial: true,
      },
    ]);
  };

  // Raise hand action for listener
  const handleToggleRaiseHand = () => {
    if (hasRaisedHand) {
      setHandRaiseRequests((prev) => prev.filter((r) => r.userId !== currentUser.id));
      setHasRaisedHand(false);
    } else {
      setHandRaiseRequests((prev) => [
        ...prev,
        {
          id: `req-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          requestedAt: 'الآن',
        },
      ]);
      setHasRaisedHand(true);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'النظام',
          text: `قام ${currentUser.name} برفع اليد لطلب الصعود للمايك ✋`,
          isSpecial: true,
        },
      ]);
    }
  };

  // Accept speaker from hand raise queue
  const handleAcceptSpeaker = (req: HandRaiseRequest) => {
    const emptyIndex = seats.findIndex((s) => !s.occupied);
    if (emptyIndex === -1) {
      alert('جميع مقاعد المايكات ممتلئة حالياً!');
      return;
    }
    const updated = [...seats];
    updated[emptyIndex] = {
      seatNumber: emptyIndex + 1,
      occupied: true,
      userId: req.userId,
      userName: req.userName,
      userAvatar: req.userAvatar,
      isMuted: false,
      isSpeaking: true,
      role: 'speaker',
    };
    setSeats(updated);
    setHandRaiseRequests((prev) => prev.filter((r) => r.id !== req.id));
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'النظام',
        text: `تم قبول ${req.userName} وصعوده إلى المايك ${emptyIndex + 1} 🎉`,
        isSpecial: true,
      },
    ]);
  };

  const handleToggleMute = () => {
    if (userSeatIndex === null) return;
    const newMuted = !isMicMuted;
    setIsMicMuted(newMuted);
    const updated = [...seats];
    updated[userSeatIndex] = {
      ...updated[userSeatIndex],
      isMuted: newMuted,
      isSpeaking: !newMuted,
    };
    setSeats(updated);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: currentUser.name,
        text: messageInput.trim(),
        avatar: currentUser.avatar,
      },
    ]);
    setMessageInput('');
  };

  const handleSendGift = (gift: GiftItem) => {
    if (currentUser.coins < gift.cost) {
      alert(`رصيدك الحالي ${currentUser.coins} عملة غير كافٍ. يمكنك شحن رصيدك بسهولة!`);
      return;
    }

    const newCoins = currentUser.coins - gift.cost;
    onUpdateCoins(newCoins);
    setRoomScore((prev) => prev + gift.cost * 10);

    // Trigger visual effect
    setActiveGiftAnimation(gift);
    setTimeout(() => {
      setActiveGiftAnimation(null);
    }, 3200);

    // Add gift message
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: currentUser.name,
        text: `أهدى ${room.hostName} ${gift.icon} ${gift.nameAr} بقيمة ${gift.cost} عملة! 🔥`,
        isGift: true,
      },
    ]);

    setShowGiftSheet(false);
  };

  const hostSeat = seats[0];
  const guestSeats = seats.slice(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between overflow-hidden text-white font-sans select-none animate-fadeIn">
      {/* Room Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition active:scale-95"
            aria-label="إغلاق الغرفة"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>

          {/* Host lockup badge */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
            <div className="relative">
              <img
                src={room.hostAvatar}
                alt={room.hostName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400"
              />
              <span className="absolute -bottom-1 -right-1 text-[10px]">👑</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold leading-tight truncate max-w-[120px]">{room.title}</div>
              <div className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                <span>{roomScore.toLocaleString()}</span>
                <span>✨ كوينز</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side status */}
        <div className="flex items-center gap-2">
          <div className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{room.onlineCount}</span>
            <span className="text-slate-300 text-[10px]">متصل</span>
          </div>

          <button
            onClick={() => alert('تم نسخ رابط الغرفة بنجاح!')}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            title="مشاركة الغرفة"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition active:scale-95"
            title="مغادرة"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Room Announcement ticker */}
      <div className="px-4 py-1 flex items-center gap-2">
        <div className="flex-1 bg-purple-950/60 border border-purple-500/30 rounded-xl px-3 py-1.5 text-[11px] text-purple-200 flex items-center gap-2 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{room.announcement}</span>
        </div>

        {/* Quick Filter Pill Indicator */}
        <button
          onClick={() => setShowAudioFilterModal(true)}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-400/40 text-amber-300 hover:border-amber-300 transition text-[11px] font-bold shadow-xs active:scale-95"
          title="تغيير فلتر نبرة الصوت"
        >
          <span className="text-xs">{activeFilter.icon}</span>
          <span className="max-w-[70px] truncate">{activeFilter.name}</span>
          <Wand2 className="w-3 h-3 text-pink-400" />
        </button>
      </div>

      {/* Audio Filter Toast Feedback */}
      {filterToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-slate-950/95 border border-amber-400/80 text-amber-300 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Wand2 className="w-4 h-4 text-pink-400 animate-spin" />
          <span>{filterToast}</span>
        </div>
      )}

      {/* Floating Hearts, Fireworks, and Luxury Gift Overlay Animation System */}
      <GiftAnimationOverlay
        gift={activeGiftAnimation}
        senderName={currentUser.name}
        broadcasterName={room.hostName}
        onAnimationComplete={() => setActiveGiftAnimation(null)}
      />

      {/* 9-Mic Voice Grid Area */}
      <div className="flex-1 px-4 py-2 flex flex-col justify-center">
        {/* Host Seat (Center Top) */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative group cursor-pointer" onClick={() => handleSeatClick(0)}>
            {/* Audio Wave Ring if speaking */}
            {hostSeat.isSpeaking && (
              <div className="absolute -inset-2 rounded-full border-2 border-amber-400/80 animate-ping pointer-events-none" />
            )}
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 shadow-lg relative flex items-center justify-center">
              <img
                src={hostSeat.userAvatar || room.hostAvatar}
                alt={hostSeat.userName || room.hostName}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                <Crown className="w-3 h-3 fill-current" />
                المضيف
              </span>
              {hostSeat.isSpeaking && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full px-1.5 py-0.5 text-[9px] flex items-center gap-0.5 font-bold shadow">
                  <span className="w-1 h-2 bg-white rounded-full animate-voice-wave-1" />
                  <span className="w-1 h-3 bg-white rounded-full animate-voice-wave-2" />
                  <span className="w-1 h-2 bg-white rounded-full animate-voice-wave-3" />
                </div>
              )}
            </div>
          </div>
          <span className="text-xs font-bold text-white mt-1.5 max-w-[120px] truncate">
            {hostSeat.userName || room.hostName}
          </span>
          <span className="text-[10px] text-amber-300 font-medium">المايك الرئيسي</span>
        </div>

        {/* 8 Guest Seats Grid (4x2) */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 max-w-[380px] mx-auto w-full">
          {guestSeats.map((seat, idx) => {
            const actualIndex = idx + 1;
            const isMe = seat.userId === currentUser.id;

            return (
              <div
                key={actualIndex}
                onClick={() => handleSeatClick(actualIndex)}
                className="flex flex-col items-center cursor-pointer transition-transform active:scale-95"
              >
                <div className="relative">
                  {seat.occupied ? (
                    <div className="relative">
                      {seat.isSpeaking && !seat.isMuted && (
                        <div className="absolute -inset-1.5 rounded-full border-2 border-pink-400 animate-ping pointer-events-none" />
                      )}
                      <div
                        className={`w-14 h-14 rounded-full p-0.5 ${
                          isMe
                            ? 'bg-gradient-to-tr from-amber-300 via-yellow-400 to-orange-500 ring-2 ring-amber-300 shadow-lg glow-gold-pulse'
                            : 'bg-white/20'
                        } flex items-center justify-center relative`}
                      >
                        <img
                          src={seat.userAvatar}
                          alt={seat.userName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full rounded-full object-cover"
                        />
                        {/* VIP 5 Mini Crown for current user on seat */}
                        {isMe && currentUser.vipLevel >= 5 && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs filter drop-shadow-[0_0_6px_rgba(251,191,36,1)]">
                            👑
                          </span>
                        )}
                        {/* Role Badge (Admin / Moderator) */}
                        {seat.role && seat.role !== 'speaker' && seat.role !== 'listener' && (
                          <span className={`absolute -bottom-1 -right-1 text-[8px] px-1 py-0.2 rounded-full font-bold shadow ${
                            seat.role === 'owner' ? 'bg-amber-400 text-slate-950' :
                            seat.role === 'admin' ? 'bg-purple-600 text-white' :
                            seat.role === 'moderator' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                          }`}>
                            {seat.role === 'admin' ? 'مدير' : seat.role === 'moderator' ? 'مشرف' : 'مضيف'}
                          </span>
                        )}
                      </div>
                      {/* Speaking equalizer pill */}
                      {seat.isSpeaking && !seat.isMuted ? (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pink-500 text-white rounded-full px-1.5 py-0.5 text-[8px] flex items-center gap-0.5 shadow">
                          <span className="w-0.5 h-1.5 bg-white rounded-full animate-voice-wave-1" />
                          <span className="w-0.5 h-2 bg-white rounded-full animate-voice-wave-2" />
                          <span className="w-0.5 h-1.5 bg-white rounded-full animate-voice-wave-3" />
                        </div>
                      ) : seat.isMuted ? (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5 text-white shadow">
                          <MicOff className="w-2.5 h-2.5" />
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/15 border border-dashed border-white/25 flex flex-col items-center justify-center group transition">
                      <Mic className="w-4 h-4 text-white/50 group-hover:text-white/80 transition" />
                      <span className="text-[10px] text-white/50 mt-0.5 font-bold">{actualIndex + 1}</span>
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-semibold text-slate-200 mt-1 max-w-[70px] truncate text-center">
                  {seat.occupied ? (isMe ? 'أنا' : seat.userName) : `مايك ${actualIndex + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Room Chat & Event Area */}
      <div className="px-4 py-2 flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`text-xs px-2.5 py-1.5 rounded-xl backdrop-blur-md max-w-[85%] self-start ${
              msg.isGift
                ? 'bg-gradient-to-r from-pink-600/50 to-purple-600/50 border border-pink-400/40 text-yellow-200 font-bold'
                : msg.isSpecial
                ? 'bg-purple-900/60 border border-purple-400/30 text-purple-200'
                : 'bg-black/40 border border-white/10 text-white'
            }`}
          >
            <span className="font-bold text-amber-300 ml-1.5">{msg.sender}:</span>
            <span className="text-slate-100">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Room Bottom Controller */}
      <div className="px-4 py-3 bg-black/70 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-2">
        {/* Chat input form */}
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="اكتب رسالة للغرفة..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none text-right"
          />
          <button type="submit" className="p-1 hover:text-pink-400 transition" aria-label="إرسال">
            <Send className="w-3.5 h-3.5 rotate-180" />
          </button>
        </form>

        {/* Mic control button (if on seat) */}
        {userSeatIndex !== null ? (
          <button
            onClick={handleToggleMute}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
              isMicMuted ? 'bg-red-500/80 text-white' : 'bg-emerald-500 text-white'
            }`}
            title={isMicMuted ? 'إلغاء الكتم' : 'كتم المايك'}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        ) : (
          <button
            onClick={() => handleSeatClick(4)}
            className="px-3 py-2 rounded-full bg-white/15 hover:bg-white/20 text-xs font-semibold flex items-center gap-1 text-white border border-white/20"
          >
            <Mic className="w-3.5 h-3.5 text-pink-400" />
            <span>صعود</span>
          </button>
        )}

        {/* Hand Raise Button (for listeners or moderators) */}
        {userSeatIndex === null && (
          <button
            onClick={handleToggleRaiseHand}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 ${
              hasRaisedHand
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={hasRaisedHand ? 'إلغاء طلب الصعود' : 'رفع اليد لطلب المايك (Raise Hand)'}
          >
            <Hand className="w-4 h-4" />
          </button>
        )}

        {/* Host / Moderator Hand Raise Management Badge */}
        {(isOwner || isAdmin || isModerator) && (
          <button
            onClick={() => setShowHandRaiseModal(true)}
            className="relative w-10 h-10 rounded-full bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/40 flex items-center justify-center text-white transition active:scale-95"
            title="إدارة طلبات الصعود للمايك"
          >
            <Shield className="w-4 h-4 text-amber-300" />
            {handRaiseRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                {handRaiseRequests.length}
              </span>
            )}
          </button>
        )}

        {/* Voice Effects & Sound Filters Button */}
        <button
          onClick={() => setShowAudioFilterModal(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 ${
            activeFilterId !== 'original'
              ? 'bg-gradient-to-tr from-amber-500 to-pink-500 text-white shadow-md shadow-pink-500/30'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="فلاتر الصوت والمؤثرات المضحكة"
        >
          <Wand2 className="w-4 h-4 animate-pulse" />
        </button>

        {/* Gift Button */}
        <button
          onClick={() => setShowGiftSheet(true)}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition"
          style={{
            background: 'linear-gradient(135deg, #FF37C8 0%, #E43AD8 100%)',
            boxShadow: '0 4px 15px rgba(255, 55, 200, 0.5)',
          }}
          title="إرسال هدية"
        >
          <Gift className="w-5 h-5 text-white animate-bounce" />
        </button>
      </div>

      {/* Seat Management Modal (Mute, Kick, Ban, Promote) */}
      <SeatManagementModal
        isOpen={!!selectedSeatToManage}
        onClose={() => setSelectedSeatToManage(null)}
        seat={selectedSeatToManage?.seat || null}
        seatIndex={selectedSeatToManage?.index || 0}
        currentUserRole={currentUserRole}
        onMuteUser={handleMuteUser}
        onKickUser={handleKickUser}
        onBanUser={handleBanUser}
        onChangeRole={handleChangeRole}
      />

      {/* Hand Raise Requests Modal for Host/Admins */}
      <HandRaiseModal
        isOpen={showHandRaiseModal}
        onClose={() => setShowHandRaiseModal(false)}
        requests={handRaiseRequests}
        onAccept={handleAcceptSpeaker}
        onReject={(id) => setHandRaiseRequests((prev) => prev.filter((r) => r.id !== id))}
      />

      {/* Voice Filters & Audio Enhancement Modal */}
      {showAudioFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 text-slate-100 font-sans">
          <div
            className="w-full max-w-md bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 rounded-t-3xl sm:rounded-3xl border border-purple-500/40 p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col gap-4 text-right"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    <span>مغير نبرة الصوت والمؤثرات</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-[11px] text-purple-200">
                    غيّر نبرة صوتك مباشرة أثناء الحديث على المايك
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAudioFilterModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mic Studio Tweaks (Noise Reduction & Gain Slider) */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  <span>مستوى حساسية المايك</span>
                </span>
                <span className="text-amber-400 font-mono">{micVolume}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                value={micVolume}
                onChange={(e) => setMicVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />

              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                <span className="text-slate-300">عزل الضوضاء والتشويش الذكي</span>
                <button
                  type="button"
                  onClick={() => setNoiseReduction(!noiseReduction)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition ${
                    noiseReduction
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {noiseReduction ? '✓ مفعّل' : 'معطل'}
                </button>
              </div>
            </div>

            {/* Preset Categories */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-black text-amber-300">اختر نبرة الصوت أو الفلتر المضحك:</h4>

              <div className="grid grid-cols-1 gap-2">
                {voiceFiltersList.map((filter) => {
                  const isSelected = filter.id === activeFilterId;
                  const isTesting = previewPlaying === filter.id;

                  return (
                    <div
                      key={filter.id}
                      onClick={() => handleApplyFilter(filter)}
                      className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-[0.99] ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-pink-400 shadow-md ring-1 ring-pink-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${filter.color} flex items-center justify-center text-2xl shadow-md shrink-0`}
                        >
                          {filter.icon}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-xs text-white group-hover:text-pink-200">
                              {filter.name}
                            </h5>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                                filter.type === 'funny'
                                  ? 'bg-pink-500/20 text-pink-300 border border-pink-400/30'
                                  : filter.type === 'spatial'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                              }`}
                            >
                              {filter.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-0.5 max-w-[200px] leading-tight">
                            {filter.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Audio Test Tone Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playFilterPreview(filter);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            isTesting
                              ? 'bg-pink-500 text-white animate-pulse'
                              : 'bg-white/10 hover:bg-white/20 text-slate-300'
                          }`}
                          title="تجربة عينة نبرة الصوت"
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </button>

                        {/* Selection check indicator */}
                        {isSelected ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border border-white/20 group-hover:border-white/40" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Live Tips */}
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-pink-400 shrink-0 animate-ping" />
              <span>
                يتم تطبيق الفلتر فوراً على صوتك عند التحدث على أي مايك من المايكات التسعة!
              </span>
            </div>

            {/* Action buttons */}
            <button
              type="button"
              onClick={() => setShowAudioFilterModal(false)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
            >
              حفظ النبرة ومتابعة التحدث
            </button>
          </div>
        </div>
      )}

      {/* Gift Bottom Sheet */}
      {showGiftSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
          <div
            className="w-full max-w-[440px] mx-auto bg-slate-900 rounded-t-3xl border-t border-slate-700/80 p-4 shadow-2xl flex flex-col gap-3 animate-slideUp"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">إرسال الهدايا الملكية</h3>
                <p className="text-xs text-slate-400">ادعم المضيف والغرفة ببريق الهدايا</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <span className="text-xs font-bold text-amber-400">{currentUser.coins.toFixed(2)}</span>
                <span className="text-xs text-slate-300">عملة 🪙</span>
                <button
                  onClick={() => {
                    onUpdateCoins(currentUser.coins + 50);
                    alert('تم شحن 50 عملة مجاناً بنجاح!');
                  }}
                  className="bg-pink-600 hover:bg-pink-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold"
                >
                  + شحن
                </button>
              </div>
            </div>

            {/* Gift Grid */}
            <div className="grid grid-cols-4 gap-2.5 py-2">
              {mockGifts.map((gift) => (
                <button
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 transition active:scale-95 group relative"
                >
                  <span className="text-3xl filter group-hover:scale-110 transition-transform mb-1">
                    {gift.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200 text-center leading-tight truncate w-full">
                    {gift.nameAr}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-400 font-bold">
                    <span>{gift.cost}</span>
                    <span>🪙</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">كل الهدايا تزيد من ترتيب الغرفة الأسبوعي</span>
              <button
                onClick={() => setShowGiftSheet(false)}
                className="px-4 py-1.5 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
