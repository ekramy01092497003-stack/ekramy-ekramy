import React, { useState } from 'react';
import { VoiceRoom } from '../types';
import { 
  countryFilters, trophyBannerImg, cpRoomImg, 
  djPenguinImg, royalAgencyImg 
} from '../data/mockData';
import { Search, Flame, Users, Sparkles, Trophy, Heart, Download } from 'lucide-react';

interface PartyTabProps {
  rooms: VoiceRoom[];
  onSelectRoom: (room: VoiceRoom) => void;
  onOpenLiveBroadcast: () => void;
  onOpenInstall?: () => void;
}

export const PartyTab: React.FC<PartyTabProps> = ({
  rooms,
  onSelectRoom,
  onOpenLiveBroadcast,
  onOpenInstall,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'related' | 'party' | 'live'>('party');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredRooms = rooms.filter((room) => {
    const matchesCountry = selectedCountry === 'ALL' || room.country === (
      selectedCountry === 'EGY' ? 'مصر' :
      selectedCountry === 'SAU' ? 'السعودية' :
      selectedCountry === 'KWT' ? 'الكويت' :
      room.country
    );
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen pb-24 text-slate-100 bg-gradient-to-b from-[#2A0845] via-[#150727] to-[#0A0314]">
      {/* Top Header matching Screenshot 1 */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2 flex items-center justify-between backdrop-blur-md bg-[#1d0630]/80 border-b border-purple-900/30">
        {/* Search & Install trigger buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSearching(!isSearching)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition active:scale-95"
            aria-label="بحث في الغرف"
          >
            <Search className="w-4 h-4 text-white/90" />
          </button>
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="px-2.5 py-1.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 text-[11px] font-bold transition active:scale-95"
              title="تثبيت التطبيق على أندرويد"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تثبيت APK</span>
            </button>
          )}
        </div>

        {/* 3 Navigation Tabs: متعلق / حزب / بث مباشر */}
        <div className="flex items-center gap-4 text-base font-bold">
          <button
            onClick={() => setSelectedSubTab('related')}
            className={`transition-colors relative pb-1 ${
              selectedSubTab === 'related' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            متعلق
            {selectedSubTab === 'related' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setSelectedSubTab('party')}
            className={`transition-all relative pb-1 flex items-center gap-1 ${
              selectedSubTab === 'party'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300 text-lg font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF37C8] animate-pulse" />
            <span>حزب</span>
            {selectedSubTab === 'party' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF37C8] to-[#E43AD8] rounded-full shadow-[0_0_8px_#FF37C8]" />
            )}
          </button>

          <button
            onClick={() => {
              setSelectedSubTab('live');
              onOpenLiveBroadcast();
            }}
            className={`transition-colors relative pb-1 ${
              selectedSubTab === 'live' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            بث مباشر
            {selectedSubTab === 'live' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Expandable Search Input */}
      {isSearching && (
        <div className="px-4 py-2 bg-[#200537] border-b border-purple-900/40 animate-slideDown">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن غرفة، مذيع، أو موضوع..."
              className="w-full bg-white/10 text-white rounded-full py-2 px-4 pr-10 text-xs placeholder-slate-400 outline-none border border-purple-500/30 focus:border-pink-500"
              autoFocus
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* Country Filter Chips (ALL, SAU, KWT, SYR, EGY, ARE, QAT, YEM...) */}
      <div className="px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        {countryFilters.map((country) => {
          const isActive = selectedCountry === country.id;
          return (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30 ring-1 ring-pink-400/50'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white border border-white/5'
              }`}
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </button>
          );
        })}
      </div>

      {/* Star of the Week Royal Trophy Banner ("نجم الأسبوع") */}
      <div className="px-4 pt-1 pb-3">
        <div
          onClick={onOpenLiveBroadcast}
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-500/40 cursor-pointer group transform transition hover:scale-[1.01]"
        >
          <img
            src={trophyBannerImg}
            alt="نجم الأسبوع"
            referrerPolicy="no-referrer"
            className="w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-purple-950/40 to-transparent flex flex-col justify-end p-3 text-right">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3 fill-current" />
                الموسم 4
              </span>
              <span className="text-xs text-purple-200 font-bold">باقي يومين على التتويج ⏳</span>
            </div>
            <h2 className="text-xl font-black text-amber-300 drop-shadow-md mt-0.5">
              نجم الأسبوع الملكي 🏆
            </h2>
            <p className="text-[11px] text-slate-200">تنافس على جوائز بقيمة 1,000,000 كوينز وكؤوس ماسية</p>
          </div>
          {/* Carousel dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <span className="w-4 h-1.5 rounded-full bg-pink-500 shadow" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
        </div>
      </div>

      {/* Special Feature Cards: CP / Family / Wealth Cards */}
      <div className="px-4 pb-3 grid grid-cols-2 gap-2.5">
        {/* CP Romantic Couple Room Banner */}
        <div
          onClick={() => onSelectRoom(rooms[3] || rooms[0])}
          className="relative rounded-2xl overflow-hidden border border-pink-500/40 cursor-pointer shadow-lg group hover:border-pink-400 transition"
        >
          <img
            src={cpRoomImg}
            alt="CP Couple room"
            referrerPolicy="no-referrer"
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-right">
            <div className="flex items-center justify-between">
              <span className="bg-pink-600/90 text-white font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-current" />
                CP رومانسي
              </span>
              <span className="text-[10px] text-pink-300 font-bold">روم الحبايب</span>
            </div>
          </div>
        </div>

        {/* Stacked Family & Wealth Mini Banners */}
        <div className="flex flex-col gap-2">
          {/* Family Banner */}
          <div
            onClick={() => onSelectRoom(rooms[1] || rooms[0])}
            className="flex-1 rounded-2xl bg-gradient-to-r from-blue-900/90 to-indigo-950/90 border border-blue-400/40 p-2.5 flex items-center justify-between cursor-pointer hover:border-blue-300 transition shadow"
          >
            <div className="text-right">
              <div className="text-xs font-black text-blue-200 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-300" />
                عائلة الملوك
              </div>
              <div className="text-[10px] text-blue-300/80">تصنيف العائلات الكبرى</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-blue-400 overflow-hidden ring-2 ring-blue-500/30">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
                alt="عائلة"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Wealth / Top Coiners Banner */}
          <div
            onClick={() => onSelectRoom(rooms[0])}
            className="flex-1 rounded-2xl bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border border-amber-500/40 p-2.5 flex items-center justify-between cursor-pointer hover:border-amber-400 transition shadow"
          >
            <div className="text-right">
              <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                قائمة الثروة
              </div>
              <div className="text-[10px] text-amber-200/80">داعمي الأسبوع الذهبي</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 overflow-hidden ring-2 ring-amber-500/30">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="ثروة"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Live Voice Rooms Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-white">
            <Flame className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>الغرف الأكثر تفاعلاً</span>
          </div>
          <span className="text-xs text-purple-300">عرض الكل ({filteredRooms.length})</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredRooms.map((room, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl transition-all duration-300 hover:scale-[1.02] border ${
                  isTop1
                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                    : isTop2
                    ? 'border-amber-500/80 ring-2 ring-amber-500/30'
                    : isTop3
                    ? 'border-rose-500/70'
                    : 'border-white/10'
                }`}
              >
                {/* Room Cover Photo */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={room.coverImage}
                    alt={room.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />

                  {/* Top Rank Badge */}
                  {room.rankBadge && (
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1 ${
                          isTop1
                            ? 'bg-purple-600 text-white'
                            : isTop2
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        <Trophy className="w-2.5 h-2.5 fill-current" />
                        {room.rankBadge}
                      </span>
                    </div>
                  )}

                  {/* Country Flag Badge */}
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-xs">
                    {room.countryFlag}
                  </div>

                  {/* Room Category Tag */}
                  <div className="absolute bottom-16 right-2">
                    <span className="bg-black/60 backdrop-blur-md text-[10px] text-pink-300 font-bold px-2 py-0.5 rounded-lg border border-pink-500/30">
                      {room.category}
                    </span>
                  </div>

                  {/* Bottom details inside card */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5 text-right flex flex-col gap-1">
                    <h3 className="text-xs font-black text-white leading-tight truncate">
                      {room.title}
                    </h3>

                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                      <div className="flex items-center gap-1 font-medium truncate max-w-[90px]">
                        <img
                          src={room.hostAvatar}
                          alt={room.hostName}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover border border-white/40"
                        />
                        <span className="truncate">{room.hostName}</span>
                      </div>

                      <div className="flex items-center gap-1 font-bold text-amber-300 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{room.onlineCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
