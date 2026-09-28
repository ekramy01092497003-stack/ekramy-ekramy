import React, { useState } from 'react';
import { MainBottomBar } from './components/MainBottomBar';
import { PartyTab } from './components/PartyTab';
import { ChatsTab } from './components/ChatsTab';
import { MomentsTab } from './components/MomentsTab';
import { ProfileTab } from './components/ProfileTab';
import { VoiceRoomModal } from './components/VoiceRoomModal';
import { StartBroadcastModal } from './components/StartBroadcastModal';
import { ComposeCodeViewer } from './components/ComposeCodeViewer';
import { SwitchUserModal } from './components/SwitchUserModal';
import { WalletModal } from './components/WalletModal';
import { FamiliesModal } from './components/FamiliesModal';
import { LevelsModal } from './components/LevelsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { 
  currentUser as initialUser, 
  initialVoiceRooms 
} from './data/mockData';
import { VoiceRoom, UserProfile } from './types';
import { Smartphone, Monitor, Code, Users, User, Wallet, Bell, Download } from 'lucide-react';

export default function App() {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [rooms, setRooms] = useState<VoiceRoom[]>(initialVoiceRooms);
  const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [showComposeSpecs, setShowComposeSpecs] = useState<boolean>(false);
  const [showSwitchUserModal, setShowSwitchUserModal] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showFamiliesModal, setShowFamiliesModal] = useState<boolean>(false);
  const [showLevelsModal, setShowLevelsModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showPWAInstallModal, setShowPWAInstallModal] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Handle Tab Selection from MainBottomBar
  const handleTabSelected = (tabIndex: number) => {
    if (tabIndex === 2) {
      // Center Pink Elevated Action Button -> Start Broadcast / Voice Room
      setShowBroadcastModal(true);
    } else {
      setSelectedTab(tabIndex);
    }
  };

  const handleUpdateCoins = (newCoins: number) => {
    setUser((prev) => ({
      ...prev,
      coins: newCoins,
    }));
  };

  const handleCreateRoom = (newRoom: VoiceRoom) => {
    setRooms([newRoom, ...rooms]);
    setShowBroadcastModal(false);
    setActiveRoom(newRoom);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* Top Floating Control Bar for Developers (Toggle Device Frame, Compose Specs, Quick Switch) */}
      <div className="w-full max-w-5xl py-2 px-4 flex items-center justify-between z-50 text-xs border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-pink-400">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="tracking-wide">PartyLive Core</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono hidden sm:inline">
            Jetpack Compose Material3 NavigationBar Spec
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch User / New User Button */}
          <button
            onClick={() => setShowSwitchUserModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/30 to-purple-600/30 hover:from-pink-600/50 hover:to-purple-600/50 text-pink-300 border border-pink-500/40 transition active:scale-95 font-semibold"
            title="تبديل أو تجربة مستخدم جديد"
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[85px] sm:max-w-none">{user.name}</span>
          </button>

          {/* Android APK & Install Guide Button */}
          <button
            onClick={() => setShowPWAInstallModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition active:scale-95 shadow-md shadow-emerald-600/20"
            title="تثبيت APK / تشغيل على أندرويد عبر ADB"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت APK / ADB</span>
          </button>

          {/* Kotlin Code Viewer Button */}
          <button
            onClick={() => setShowComposeSpecs(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-500/30 transition active:scale-95 font-semibold"
            title="عرض كود Jetpack Compose"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compose Code</span>
          </button>

          {/* Toggle Device Mockup Mode */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="تبديل وضع العرض"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">شاشة واسعة</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden sm:inline">إطار الجوال</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main App Container (either Mobile Device Frame or Responsive Fluid Container) */}
      <main
        className={`w-full relative transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[430px] my-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-[44px] overflow-hidden border-[6px] border-slate-800 bg-slate-900 min-h-[880px]'
            : 'max-w-2xl my-0 shadow-none rounded-none border-none min-h-screen'
        }`}
      >
        {/* Mobile Status Bar Simulation (Time, Battery, Wifi, VoLTE) */}
        {isMobileFrame && (
          <div className="h-8 px-6 bg-transparent flex items-center justify-between text-[11px] font-bold text-white/90 select-none z-30 relative pt-1" dir="ltr">
            <span>1:06:09</span>
            {/* Camera cutout */}
            <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>VoLTE</span>
              <span>100%</span>
              <span className="w-4 h-2 rounded-xs border border-white/80 p-0.5 flex">
                <span className="w-full h-full bg-white" />
              </span>
            </div>
          </div>
        )}

        {/* Tab 0: 👥 Party / Voice Rooms (حزب / بث مباشر / متعلق) */}
        {selectedTab === 0 && (
          <PartyTab
            rooms={rooms}
            onSelectRoom={(room) => setActiveRoom(room)}
            onOpenLiveBroadcast={() => setShowBroadcastModal(true)}
            onOpenInstall={() => setShowPWAInstallModal(true)}
          />
        )}

        {/* Tab 1: 💬 Chats / Messages (الدردشات) */}
        {selectedTab === 1 && (
          <ChatsTab 
            currentUser={user} 
            onOpenNotifications={() => setShowNotificationsModal(true)} 
          />
        )}

        {/* Tab 3: 🪐 Moments / Social Planet (الحالة / يتبع) */}
        {selectedTab === 3 && (
          <MomentsTab currentUser={user} onUpdateCoins={handleUpdateCoins} />
        )}

        {/* Tab 4: ☺ Profile / Me (أنا / الملف الشخصي) */}
        {selectedTab === 4 && (
          <ProfileTab
            currentUser={user}
            onUpdateCoins={handleUpdateCoins}
            onOpenCreateRoom={() => setShowBroadcastModal(true)}
            onOpenSwitchUser={() => setShowSwitchUserModal(true)}
            onOpenWallet={() => setShowWalletModal(true)}
            onOpenFamilies={() => setShowFamiliesModal(true)}
            onOpenLevels={() => setShowLevelsModal(true)}
          />
        )}

        {/* Floating Jetpack Compose NavigationBar Replica */}
        <MainBottomBar
          selectedTab={selectedTab}
          onTabSelected={handleTabSelected}
          unreadCount={1}
        />
      </main>

      {/* Voice Party Room Modal (9-Mic Live Stage) */}
      {activeRoom && (
        <VoiceRoomModal
          room={activeRoom}
          currentUser={user}
          onClose={() => setActiveRoom(null)}
          onUpdateCoins={handleUpdateCoins}
        />
      )}

      {/* Center Action: Start Live Broadcast or Voice Room */}
      {showBroadcastModal && (
        <StartBroadcastModal
          currentUser={user}
          onClose={() => setShowBroadcastModal(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}

      {/* Jetpack Compose Kotlin Code & Specification Sheet */}
      <ComposeCodeViewer
        isOpen={showComposeSpecs}
        onClose={() => setShowComposeSpecs(false)}
        selectedTab={selectedTab}
      />

      {/* Switch User or Create New User Modal */}
      <SwitchUserModal
        currentUser={user}
        isOpen={showSwitchUserModal}
        onClose={() => setShowSwitchUserModal(false)}
        onSwitchUser={(newUser) => setUser(newUser)}
      />

      {/* Wallet & Coins Recharge Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        currentUser={user}
        onUpdateCoins={handleUpdateCoins}
      />

      {/* Families Modal */}
      <FamiliesModal
        isOpen={showFamiliesModal}
        onClose={() => setShowFamiliesModal(false)}
        currentUser={user}
      />

      {/* Levels & EXP Modal */}
      <LevelsModal
        isOpen={showLevelsModal}
        onClose={() => setShowLevelsModal(false)}
        currentUser={user}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />

      {/* Android APK & ADB Guide Modal */}
      <PWAInstallModal
        isOpen={showPWAInstallModal}
        onClose={() => setShowPWAInstallModal(false)}
      />
    </div>
  );
}
