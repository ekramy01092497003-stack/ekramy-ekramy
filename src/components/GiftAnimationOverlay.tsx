import React, { useEffect, useState } from 'react';
import { GiftItem } from '../types';
import { Sparkles, Heart } from 'lucide-react';

export interface FloatingGiftParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  icon: string;
  duration: number;
  delay: number;
  type: 'heart' | 'star' | 'firework' | 'ring' | 'coin';
  color: string;
  rotation: number;
}

interface GiftAnimationOverlayProps {
  gift: GiftItem | null;
  senderName: string;
  broadcasterName: string;
  onAnimationComplete?: () => void;
}

export const GiftAnimationOverlay: React.FC<GiftAnimationOverlayProps> = ({
  gift,
  senderName,
  broadcasterName,
  onAnimationComplete,
}) => {
  const [particles, setParticles] = useState<FloatingGiftParticle[]>([]);
  const [fireworkRings, setFireworkRings] = useState<number[]>([1, 2, 3]);

  useEffect(() => {
    if (!gift) {
      setParticles([]);
      return;
    }

    // Determine particles theme based on the gift
    const isHeartGift = gift.id.includes('rose') || gift.id.includes('heart') || gift.id.includes('kiss') || gift.nameAr.includes('وردة') || gift.nameAr.includes('قلب');
    const isFireworksGift = gift.id.includes('rocket') || gift.id.includes('castle') || gift.id.includes('yacht') || gift.id.includes('car') || gift.cost >= 200;

    const newParticles: FloatingGiftParticle[] = [];
    const count = isFireworksGift ? 42 : isHeartGift ? 36 : 28;

    const heartIcons = ['💖', '❤️', '💕', '✨', '🌸', '💘', '💗', '🥰'];
    const fireworkIcons = ['🎆', '🎇', '✨', '💥', '⭐', '🌟', '🚀', '🔥', '👑'];
    const luxuryIcons = ['💎', '👑', '🪙', '✨', '🌟', '⚡'];

    const pool = isFireworksGift ? fireworkIcons : isHeartGift ? heartIcons : luxuryIcons;
    const colors = ['#f43f5e', '#ec4899', '#eab308', '#a855f7', '#06b6d4', '#f97316'];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `p-${i}-${Date.now()}`,
        x: Math.random() * 88 + 6, // 6% to 94% horizontal
        y: Math.random() * 30 + 65, // Start from bottom / mid
        size: Math.floor(Math.random() * 24) + 18,
        icon: pool[Math.floor(Math.random() * pool.length)],
        duration: Math.random() * 1.8 + 1.6,
        delay: Math.random() * 0.9,
        type: isFireworksGift ? 'firework' : 'heart',
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.floor(Math.random() * 360),
      });
    }

    setParticles(newParticles);
    setFireworkRings([1, 2, 3]);

    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3800);

    return () => clearTimeout(timer);
  }, [gift, onAnimationComplete]);

  if (!gift) return null;

  const isLuxury = gift.cost >= 200;
  const isHeartThemed = gift.nameAr.includes('وردة') || gift.nameAr.includes('قلب') || gift.id.includes('rose');

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient Radial Spotlight Glow */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isLuxury 
            ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/35 via-purple-900/30 to-transparent animate-pulse'
            : isHeartThemed
            ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/35 via-rose-900/30 to-transparent'
            : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/25 via-pink-600/20 to-transparent'
        }`} 
      />

      {/* Explosive Shockwave Rings for Fireworks / Super Gifts */}
      {isLuxury && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {fireworkRings.map((ring) => (
            <div
              key={ring}
              className="absolute rounded-full border-2 border-yellow-300/80 animate-ping opacity-75"
              style={{
                width: `${ring * 160}px`,
                height: `${ring * 160}px`,
                animationDuration: `${1.2 + ring * 0.4}s`,
                animationDelay: `${ring * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Hearts & Fireworks Particles System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute select-none transform-gpu animate-gift-float"
            style={{
              left: `${p.x}%`,
              bottom: `${p.y - 40}%`,
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              filter: `drop-shadow(0 0 10px ${p.color})`,
            }}
          >
            {p.icon}
          </div>
        ))}
      </div>

      {/* Center 3D Showcase Icon with Dramatic Entry */}
      <div className="relative z-10 flex flex-col items-center animate-gift-bounce scale-110">
        {/* Aura Ring */}
        <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-amber-500 opacity-60 blur-xl animate-spin-slow pointer-events-none" />

        {/* Big Gift Icon */}
        <div className="text-9xl drop-shadow-[0_20px_45px_rgba(255,215,0,0.9)] filter select-none transition-transform hover:scale-125 duration-300">
          {gift.icon}
        </div>

        {/* Broadcaster Appreciation Banner */}
        <div className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-purple-700 to-amber-600 border-2 border-yellow-300 shadow-[0_10px_35px_rgba(245,158,11,0.7)] text-center flex items-center gap-2 backdrop-blur-md animate-pulse">
          <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300 shrink-0" />
          <div className="text-right">
            <div className="text-xs font-bold text-yellow-200">
              <span className="text-white font-black">{senderName}</span> أهدى المذيع <span className="text-amber-300 font-black">{broadcasterName}</span>
            </div>
            <div className="text-base font-black text-white flex items-center gap-1.5 justify-center">
              <span>{gift.nameAr}</span>
              <span className="text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                {gift.cost} 🪙
              </span>
            </div>
          </div>
          <Heart className="w-5 h-5 text-rose-300 fill-rose-400 shrink-0 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
