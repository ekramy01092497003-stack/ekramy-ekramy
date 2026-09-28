import React, { useState } from 'react';
import { DirectMessage, UserProfile } from '../types';
import { mockDirectMessages } from '../data/mockData';
import { 
  Search, Trash2, Bell, Heart, Users, Calendar, 
  Send, ChevronRight, CheckCheck, Smile
} from 'lucide-react';

interface ChatsTabProps {
  currentUser: UserProfile;
  onOpenNotifications?: () => void;
}

export const ChatsTab: React.FC<ChatsTabProps> = ({ currentUser, onOpenNotifications }) => {
  const [messages, setMessages] = useState<DirectMessage[]>(mockDirectMessages);
  const [activeChat, setActiveChat] = useState<DirectMessage | null>(null);
  const [chatHistory, setChatHistory] = useState<{ [id: string]: { sender: string; text: string; time: string; isMe: boolean }[] }>({
    'dm-1': [
      { sender: 'رنوشة تونسية', text: "I've followed you, let's chat", time: '2:03', isMe: false },
      { sender: 'أنا', text: 'أهلاً وسهلاً بكِ في عائلتنا! 🌹', time: '2:05', isMe: true },
    ],
    'dm-2': [
      { sender: 'MR ميرو 💻', text: 'لقد تابعتك، دعنا نتحدث', time: '12:38', isMe: false },
    ],
  });
  const [inputText, setInputText] = useState('');
  const [systemAlertMessage, setSystemAlertMessage] = useState<string | null>(null);

  const handleOpenSystemChannel = (name: string, description: string) => {
    setSystemAlertMessage(`${name}: ${description}`);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const newMsg = {
      sender: currentUser.name,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setChatHistory((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    }));

    // Update last message in list
    setMessages((prev) =>
      prev.map((m) =>
        m.id === activeChat.id ? { ...m, lastMessage: inputText.trim(), time: newMsg.time } : m
      )
    );

    setInputText('');

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replyMsg = {
        sender: activeChat.senderName,
        text: 'شكراً لرسالتك! يسعدني التواصل معك في الغرف الصوتية 🎙️✨',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setChatHistory((prev) => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), replyMsg],
      }));
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-white text-slate-900" dir="rtl">
      {/* Top Header matching Screenshot 3 */}
      <header className="sticky top-0 z-30 px-5 pt-3 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">الدردشات</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('تم تنظيف وقراءة جميع الإشعارات')}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
            title="تنظيف المحادثات"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => alert('بحث في الرسائل جهات الاتصال')}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
            title="بحث"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Official & System Channels matching Screenshot 3 */}
      <div className="flex flex-col px-4 pt-2">
        {/* 1. رسالة النظام (System Message) */}
        <div
          onClick={() => {
            if (onOpenNotifications) {
              onOpenNotifications();
            } else {
              handleOpenSystemChannel(
                'رسالة النظام',
                'تهانينا! لقد حصلت على باقة الترحيب المجانية ومكافأة تسجيل الدخول اليومية 5 عملات ذهبية.'
              );
            }
          }}
          className="flex items-center justify-between py-3.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50/70 rounded-2xl px-2 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-purple-500 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              {/* Mascot dual eye smiling icon */}
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <span className="text-purple-600 font-black text-sm">ᴗ</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">رسالة النظام</span>
                <span className="bg-pink-100 text-pink-600 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  ✓ رسمي
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">إشعارات الحساب، الشحن والمكافآت</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 rotate-180" />
        </div>

        {/* 2. أصدقاء (Friends) */}
        <div
          onClick={() => handleOpenSystemChannel('أصدقاء', 'لديك 12 صديقاً نشطاً الآن في الغرف الصوتية')}
          className="flex items-center justify-between py-3.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50/70 rounded-2xl px-2 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Bell className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900">أصدقاء</span>
              <p className="text-xs text-slate-400 mt-0.5">طلبات الصداقة ودعوات الغرف المباشرة</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 rotate-180" />
        </div>

        {/* 3. تابع (Following) */}
        <div
          onClick={() => handleOpenSystemChannel('تابع', 'المذيعون الذين تتابعهم بدأوا بثوثاً جديدة')}
          className="flex items-center justify-between py-3.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50/70 rounded-2xl px-2 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900">تابع</span>
              <p className="text-xs text-slate-400 mt-0.5">تنبيهات المتابعين وبدء البث المباشر</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 rotate-180" />
        </div>

        {/* 4. عائلة (Family) */}
        <div
          onClick={() => handleOpenSystemChannel('عائلة', 'اجتماع العائلة الملكية الليلة الساعة 10 م')}
          className="flex items-center justify-between py-3.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50/70 rounded-2xl px-2 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Users className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900">عائلة</span>
              <p className="text-xs text-slate-400 mt-0.5">دردشة أعضاء العائلة وصندوق دعم القبيلة</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 rotate-180" />
        </div>

        {/* 5. مركز الأحداث (Event Center) */}
        <div
          onClick={() =>
            handleOpenSystemChannel(
              'مركز الأحداث',
              'انطلقت مسابقة نجم الأسبوع الكبرى! احصل على مكافأة شحن إضافية 20% الآن.'
            )
          }
          className="flex items-center justify-between py-3.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50/70 rounded-2xl px-2 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Calendar className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900">مركز الأحداث</span>
              <p className="text-xs text-slate-400 mt-0.5">المهرجانات الشهرية وبطولات الغرف الصوتية</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 rotate-180" />
        </div>
      </div>

      {/* Direct Messages Section */}
      <div className="px-4 pt-3">
        <h2 className="text-xs font-bold text-slate-400 mb-1 px-1">المحادثات الخاصة</h2>

        <div className="flex flex-col divide-y divide-slate-100">
          {messages.map((dm) => (
            <div
              key={dm.id}
              onClick={() => setActiveChat(dm)}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 rounded-2xl px-2 transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={dm.avatar}
                    alt={dm.senderName}
                    referrerPolicy="no-referrer"
                    className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  {dm.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300/50" />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{dm.senderName}</h3>
                  <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{dm.lastMessage}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-slate-400 font-medium">{dm.time}</span>
                {dm.unreadCount && dm.unreadCount > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {dm.unreadCount}
                  </span>
                ) : (
                  <CheckCheck className="w-4 h-4 text-cyan-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Alert Popup */}
      {systemAlertMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center flex flex-col items-center animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
              <Bell className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">إشعار النظام</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">{systemAlertMessage}</p>
            <button
              onClick={() => setSystemAlertMessage(null)}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-md"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}

      {/* Active Direct Chat Sheet */}
      {activeChat && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveChat(null)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="relative">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.senderName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                {activeChat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{activeChat.senderName}</h3>
                <span className="text-[11px] text-emerald-600 font-medium">متصل الآن</span>
              </div>
            </div>

            <button
              onClick={() => alert(`تمت إضافة ${activeChat.senderName} لقائمة الأصدقاء المقربين!`)}
              className="text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition"
            >
              + إضافة
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50/60">
            {(chatHistory[activeChat.id] || []).map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.isMe
                    ? 'self-start bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none shadow-sm'
                    : 'self-end bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[9px] mt-1 ${
                    msg.isMe ? 'text-pink-200 text-left' : 'text-slate-400 text-right'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setInputText((prev) => prev + ' 🌹')}
              className="p-2 text-slate-400 hover:text-pink-500 transition"
              title="إيموجي"
            >
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 py-2 px-4 bg-slate-100 rounded-full text-xs text-slate-800 outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md active:scale-95 transition"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
