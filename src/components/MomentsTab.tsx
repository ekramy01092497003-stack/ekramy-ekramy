import React, { useState } from 'react';
import { MomentPost, UserProfile } from '../types';
import { mockMoments } from '../data/mockData';
import { 
  Bell, Edit3, Heart, MessageCircle, Share2, 
  Gift, Play, Sparkles, Plus, Image as ImageIcon
} from 'lucide-react';

interface MomentsTabProps {
  currentUser: UserProfile;
  onUpdateCoins: (newCoins: number) => void;
}

export const MomentsTab: React.FC<MomentsTabProps> = ({
  currentUser,
  onUpdateCoins,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'following'>('status');
  const [posts, setPosts] = useState<MomentPost[]>(mockMoments);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTag, setNewPostTag] = useState('#شحن_وتفعيل');
  const [selectedPostForGift, setSelectedPostForGift] = useState<MomentPost | null>(null);

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleSendGiftToPost = (post: MomentPost) => {
    if (currentUser.coins < 5) {
      alert('تحتاج إلى 5 عملات على الأقل لإرسال هدية للمنشور. يمكنك شحن رصيدك بسهولة!');
      return;
    }
    onUpdateCoins(currentUser.coins - 5);
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, giftsCount: p.giftsCount + 1 } : p))
    );
    alert(`🎉 تم إرسال بالون الهدية إلى ${post.authorName}!`);
    setSelectedPostForGift(null);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: MomentPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorBadges: {
        level: currentUser.badgeLevel,
        crownBadge: 1,
      },
      timeString: `مصر - ${new Date().toLocaleTimeString()} 2026-09-27`,
      country: 'مصر',
      text: newPostText.trim(),
      mediaUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
      mediaType: 'image',
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      sharesCount: 0,
      giftsCount: 0,
      hashtags: [newPostTag],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gradient-to-b from-[#fdf7fd] via-[#fbf3fa] to-[#f4e8f7] text-slate-900" dir="rtl">
      {/* Top Header matching Screenshot 2 */}
      <header className="sticky top-0 z-30 px-5 pt-3 pb-3 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('لا توجد إشعارات جديدة')}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition"
            title="الإشعارات"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-fuchsia-500 text-white flex items-center justify-center shadow-md shadow-pink-500/30 active:scale-95 transition"
            title="نشر منشور جديد"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: يتبع / الحالة */}
        <div className="flex items-center gap-5 text-base font-bold">
          <button
            onClick={() => setActiveTab('following')}
            className={`transition-all ${
              activeTab === 'following'
                ? 'text-pink-600 font-black'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            يتبع
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`transition-all relative flex items-center gap-1.5 ${
              activeTab === 'status'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 text-lg font-black'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>الحالة</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF37C8] animate-pulse" />
          </button>
        </div>
      </header>

      {/* Trending Topic Cards Grid matching Screenshot 2 */}
      <div className="px-4 pt-3 pb-3 grid grid-cols-2 gap-3">
        {/* Card 1: كل المواضيع (Peach/Amber) */}
        <div className="rounded-3xl p-3.5 bg-gradient-to-br from-amber-100/90 via-orange-50/90 to-pink-50/90 border border-amber-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/40">
            <span className="text-xs font-black text-amber-950 flex items-center gap-1">
              <span>كل المواضيع</span>
              <span className="text-amber-700">›</span>
            </span>
            <span className="text-xs">#</span>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="truncate">#شحن وتفعيل</span>
              <div className="w-6 h-6 rounded-lg bg-amber-200 overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=80&auto=format&fit=crop&q=80"
                  alt="شحن"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="truncate">😉 #Mood</span>
              <div className="w-6 h-6 rounded-lg bg-pink-200 overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Mood"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="truncate">#اقتباس</span>
              <div className="w-6 h-6 rounded-lg bg-amber-100 overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&auto=format&fit=crop&q=80"
                  alt="اقتباس"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: أكثر 3 مواضيع رواجاً (Cyan/Blue) */}
        <div className="rounded-3xl p-3.5 bg-gradient-to-br from-cyan-100/90 via-sky-50/90 to-blue-50/90 border border-sky-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-sky-200/40">
            <span className="text-xs font-black text-sky-950 flex items-center gap-1">
              <span>أكثر 3 مواضيع رواجاً</span>
              <span>🔥</span>
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="truncate"># شحن الباشا وهدوء</span>
              <span className="text-amber-500 font-bold">🥇</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="truncate">😋 # شحن المكسرات</span>
              <span className="text-slate-400 font-bold">🥈</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="truncate">🔥 # مزاجو</span>
              <span className="text-amber-700 font-bold">🥉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Posts Section matching Screenshot 2 */}
      <div className="px-4 flex flex-col gap-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3"
          >
            {/* Author lockup */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-300"
                />

                <div>
                  <h3 className="font-black text-xs text-slate-900 leading-snug">
                    {post.authorName}
                  </h3>

                  {/* Level & Wealth Badges bar */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-md shadow-xs">
                      🦁 {post.authorBadges.level}
                    </span>
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-md">
                      🪙 Coins VIP
                    </span>
                    {post.authorBadges.crownBadge && (
                      <span className="bg-amber-700 text-white font-black text-[9px] px-1.5 py-0.2 rounded-md">
                        👑 {post.authorBadges.crownBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`تمت متابعة ${post.authorName}`)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600 flex items-center justify-center transition"
                title="متابعة"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Post Text */}
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {post.text}
            </p>

            {/* Media Box (Matches Screenshot 2's red video banner "I Love You meri jaan") */}
            {post.mediaUrl && (
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-black shadow-md group cursor-pointer">
                <img
                  src={post.mediaUrl}
                  alt="Post media"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-900/60 to-black/80 flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-red-600/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                      TOP38
                    </span>
                    <span className="text-xs text-white/80 font-bold">1,340 مشاهدة</span>
                  </div>

                  <div className="self-center w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>

                  <div className="text-center font-black text-amber-200 text-sm tracking-wide">
                    {post.text}
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp & Location */}
            <div className="text-[11px] text-slate-400 font-medium">
              {post.timeString}
            </div>

            {/* Actions Bar matching Screenshot 2: "تقديم الهدايا" & Likes, Comments, Share */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {/* "تقديم الهدايا" button */}
              <button
                onClick={() => handleSendGiftToPost(post)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-bold transition active:scale-95"
              >
                <Gift className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span>تقديم الهدايا</span>
                {post.giftsCount > 0 && (
                  <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                    {post.giftsCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-4 text-slate-500">
                <button
                  onClick={() => alert('تمت إعادة النشر!')}
                  className="flex items-center gap-1 text-xs hover:text-slate-800 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{post.sharesCount}</span>
                </button>

                <button
                  onClick={() => alert('اكتب تعليقاً...')}
                  className="flex items-center gap-1 text-xs hover:text-slate-800 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount}</span>
                </button>

                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1 text-xs transition active:scale-125 ${
                    post.isLiked ? 'text-red-500 font-bold' : 'hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* New Moment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-[440px] bg-white rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <h3 className="font-bold text-base text-slate-900">نشر حالة جديدة</h3>

            <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="ما الذي يدور في ذهنك اليوم؟..."
                rows={3}
                className="w-full p-3 bg-slate-50 rounded-2xl text-xs text-slate-800 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-400"
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">الوسم:</span>
                {['#شحن_وتفعيل', '#Mood', '#اقتباس', '#مزاجو'].map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setNewPostTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-bold transition ${
                      newPostTag === tag
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => alert('تم اختيار صورة تجريبية')}
                  className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full"
                >
                  <ImageIcon className="w-4 h-4 text-pink-500" />
                  <span>إضافة صورة</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md"
                  >
                    نشر الحالة
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
