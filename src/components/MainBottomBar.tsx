import React from 'react';

interface MainBottomBarProps {
  selectedTab: number;
  onTabSelected: (tabIndex: number) => void;
  unreadCount?: number;
}

export const MainBottomBar: React.FC<MainBottomBarProps> = ({
  selectedTab,
  onTabSelected,
  unreadCount = 1,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center pb-3 px-4">
      {/* Jetpack Compose NavigationBar Replica:
          modifier = Modifier.padding(horizontal = 16.dp).clip(RoundedCornerShape(32.dp))
          containerColor = Color.White
      */}
      <nav
        role="navigation"
        aria-label="شريط التنقل الرئيسي"
        className="pointer-events-auto relative w-full max-w-[420px] h-[68px] bg-white rounded-[32px] shadow-[0_10px_35px_rgba(0,0,0,0.18)] border border-slate-100/90 flex items-center justify-between px-3"
      >
        {/* Tab 0: 👥 Party / Voice Rooms (حزب / غرف) */}
        <button
          onClick={() => onTabSelected(0)}
          className={`flex-1 flex flex-col items-center justify-center h-full relative transition-all duration-200 active:scale-95 ${
            selectedTab === 0 ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="الغرف والحفلات"
          title="حزب (الغرف الصوتية)"
        >
          <div className="relative">
            {/* Custom SVG matching the screenshot's dual avatars */}
            <svg
              className={`w-7 h-7 transition-colors ${selectedTab === 0 ? 'text-slate-900' : 'text-slate-400'}`}
              viewBox="0 0 24 24"
              fill={selectedTab === 0 ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={selectedTab === 0 ? '0' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {selectedTab === 0 && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF37C8] rounded-full" />
            )}
          </div>
        </button>

        {/* Tab 1: 💬 Chats / Messages (الدردشات) */}
        <button
          onClick={() => onTabSelected(1)}
          className={`flex-1 flex flex-col items-center justify-center h-full relative transition-all duration-200 active:scale-95 ${
            selectedTab === 1 ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="الدردشات"
          title="الدردشات والرسائل"
        >
          <div className="relative">
            <svg
              className={`w-7 h-7 transition-colors ${selectedTab === 1 ? 'text-slate-900' : 'text-slate-400'}`}
              viewBox="0 0 24 24"
              fill={selectedTab === 1 ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={selectedTab === 1 ? '0' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-400/40 animate-pulse" />
            )}
            {selectedTab === 1 && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF37C8] rounded-full" />
            )}
          </div>
        </button>

        {/* Tab 2: Elevated Center Pink Action Box:
            Box(
              modifier = Modifier.size(64.dp).clip(CircleShape).background(
                Brush.linearGradient(listOf(Color(0xFFFF37C8), Color(0xFFE43AD8)))
              ).clickable { onTabSelected(2) },
              contentAlignment = Alignment.Center
            ) {
              Text(text = "●", color = Color.White, fontSize = 30.sp)
            }
        */}
        <div className="relative flex items-center justify-center px-1">
          <button
            onClick={() => onTabSelected(2)}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform -translate-y-2 hover:-translate-y-3 active:scale-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300"
            style={{
              background: 'linear-gradient(135deg, #FF37C8 0%, #E43AD8 100%)',
              boxShadow: '0 8px 24px rgba(255, 55, 200, 0.55), 0 2px 6px rgba(0,0,0,0.1)',
            }}
            aria-label="بدء بث أو غرفة صوتية جديدة"
            title="إنشاء غرفة أو بث صوتي"
          >
            {/* Center camera / live pulse dot */}
            <div className="w-8 h-8 rounded-full border-2 border-white/90 flex items-center justify-center">
              <span className="text-white text-2xl leading-none select-none drop-shadow">●</span>
            </div>
          </button>
        </div>

        {/* Tab 3: 🪐 Moments / Social Planet (الحالة / الفضاء) */}
        <button
          onClick={() => onTabSelected(3)}
          className={`flex-1 flex flex-col items-center justify-center h-full relative transition-all duration-200 active:scale-95 ${
            selectedTab === 3 ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="الحالة والمنشورات"
          title="الحالة (المواضيع والرائج)"
        >
          <div className="relative">
            {/* Planet with ring matching 🪐 */}
            <svg
              className={`w-7 h-7 transition-colors ${selectedTab === 3 ? 'text-slate-900' : 'text-slate-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="6" fill={selectedTab === 3 ? 'currentColor' : 'none'} />
              <path d="M2.5 14c2.5-4 12-8.5 19-3" strokeWidth="2.2" />
              <path d="M2.5 14c4 2 12 4 19-3" strokeWidth="2.2" strokeDasharray="3 2" />
            </svg>
            {selectedTab === 3 && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF37C8] rounded-full" />
            )}
          </div>
        </button>

        {/* Tab 4: ☺ Profile / Me (أنا) */}
        <button
          onClick={() => onTabSelected(4)}
          className={`flex-1 flex flex-col items-center justify-center h-full relative transition-all duration-200 active:scale-95 ${
            selectedTab === 4 ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="الملف الشخصي"
          title="أنا (الملف الشخصي)"
        >
          <div className="relative">
            {/* Smiley / Me icon matching ☺ */}
            <svg
              className={`w-7 h-7 transition-colors ${selectedTab === 4 ? 'text-slate-900' : 'text-slate-400'}`}
              viewBox="0 0 24 24"
              fill={selectedTab === 4 ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={selectedTab === 4 ? '0' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {selectedTab === 4 && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF37C8] rounded-full" />
            )}
          </div>
        </button>
      </nav>
    </div>
  );
};
