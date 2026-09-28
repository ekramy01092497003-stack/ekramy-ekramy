import React, { useState } from 'react';
import { X, Copy, Check, Code, Smartphone, Sparkles, Layers, ShieldCheck, Coins } from 'lucide-react';

interface ComposeCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: number;
}

export const ComposeCodeViewer: React.FC<ComposeCodeViewerProps> = ({
  isOpen,
  onClose,
  selectedTab,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'main' | 'room' | 'roles' | 'models' | 'store'>('main');

  if (!isOpen) return null;

  const codeSnippets = {
    main: `// ==========================================
// 1. PartyLiveNavigation & MainBottomBar.kt
// Material3 Jetpack Compose NavigationBar Replica
// Arabic RTL Layout Direction Enforced
// ==========================================
package com.partylive.app.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection

@Composable
fun PartyLiveApp() {
    // فرض الاتجاه من اليمين إلى اليسار (RTL العربية)
    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        var currentTab by remember { mutableStateOf(0) }
        var showCreateRoom by remember { mutableStateOf(false) }

        Scaffold(
            bottomBar = {
                MainBottomBar(
                    selectedTab = currentTab,
                    onTabSelected = { index ->
                        if (index == 2) {
                            showCreateRoom = true
                        } else {
                            currentTab = index
                        }
                    }
                )
            },
            containerColor = Color(0xFF0F0A1C)
        ) { paddingValues ->
            Box(modifier = Modifier.padding(paddingValues).fillMaxSize()) {
                when (currentTab) {
                    0 -> PartyHomeScreen() // الرئيسية والرومات
                    1 -> ChatsScreen()     // الدردشة والرسائل
                    3 -> MomentsScreen()   // الحالة والمواضيع (🪐)
                    4 -> ProfileScreen()   // الملف الشخصي وأنا (☺)
                }
            }
        }
    }
}

@Composable
fun MainBottomBar(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit
) {
    NavigationBar(
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .clip(RoundedCornerShape(32.dp)),
        containerColor = Color.White,
        tonalElevation = 8.dp
    ) {
        // Tab 0: الحفلات والغرف الصوتية 👥
        NavigationBarItem(
            selected = selectedTab == 0,
            onClick = { onTabSelected(0) },
            icon = { Text("👥", fontSize = 22.sp) },
            colors = NavigationBarItemDefaults.colors(
                indicatorColor = Color.Transparent,
                selectedIconColor = Color(0xFF1E293B),
                unselectedIconColor = Color(0xFF94A3B8)
            )
        )

        // Tab 1: الدردشات والرسائل 💬
        NavigationBarItem(
            selected = selectedTab == 1,
            onClick = { onTabSelected(1) },
            icon = { Text("💬", fontSize = 22.sp) },
            colors = NavigationBarItemDefaults.colors(
                indicatorColor = Color.Transparent,
                selectedIconColor = Color(0xFF1E293B),
                unselectedIconColor = Color(0xFF94A3B8)
            )
        )

        // Tab 2: الزر الوردي المرتفع لبدء البث والغرفة الصوتية
        Box(
            modifier = Modifier
                .size(60.dp)
                .offset(y = (-6).dp)
                .clip(CircleShape)
                .background(
                    Brush.linearGradient(
                        listOf(Color(0xFFFF37C8), Color(0xFFE43AD8))
                    )
                )
                .clickable { onTabSelected(2) },
            contentAlignment = Alignment.Center
        ) {
            Text(text = "●", color = Color.White, fontSize = 28.sp)
        }

        // Tab 3: الحالة والمنشورات 🪐
        NavigationBarItem(
            selected = selectedTab == 3,
            onClick = { onTabSelected(3) },
            icon = { Text("🪐", fontSize = 22.sp) },
            colors = NavigationBarItemDefaults.colors(
                indicatorColor = Color.Transparent,
                selectedIconColor = Color(0xFF1E293B),
                unselectedIconColor = Color(0xFF94A3B8)
            )
        )

        // Tab 4: أنا والملف الشخصي ☺
        NavigationBarItem(
            selected = selectedTab == 4,
            onClick = { onTabSelected(4) },
            icon = { Text("☺", fontSize = 22.sp) },
            colors = NavigationBarItemDefaults.colors(
                indicatorColor = Color.Transparent,
                selectedIconColor = Color(0xFF1E293B),
                unselectedIconColor = Color(0xFF94A3B8)
            )
        )
    }
}`,

    room: `// ==========================================
// 2. VoiceRoomScreen.kt (9-Mics Live Voice Stage)
// With Live Voice SDK & 9 Mics Arrangement
// ==========================================
package com.partylive.app.ui.room

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.partylive.app.data.model.VoiceSeat
import com.partylive.app.data.model.RoomRole

@Composable
fun VoiceRoomScreen(
    roomTitle: String,
    seats: List<VoiceSeat>,
    currentUserRole: RoomRole,
    onSeatClick: (Int) -> Unit,
    onSendGiftClick: () -> Unit,
    onToggleMic: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFF2A0845), Color(0xFF150727), Color(0xFF0A0314))
                )
            )
            .padding(16.dp)
    ) {
        // رأس الغرفة: التاج وعدد المتواجدين ومعرف الغرفة
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(roomTitle, color = Color.White, fontSize = 16.sp, style = MaterialTheme.typography.titleMedium)
            Badge(containerColor = Color(0x33FFFFFF)) {
                Text("🔥 475 متصل", color = Color(0xFFFBBF24), fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // المايك الرئيسي رقم 1 (Host Mic)
        val hostSeat = seats.firstOrNull()
        Column(
            horizontalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Box(
                modifier = Modifier
                    .size(76.dp)
                    .clip(CircleShape)
                    .border(2.dp, Color(0xFFF59E0B), CircleShape)
                    .clickable { onSeatClick(0) },
                contentAlignment = Alignment.Center
            ) {
                Text(if (hostSeat?.occupied == true) "👑" else "🎙️", fontSize = 28.sp)
            }
            Text("المايك الرئيسي (المضيف)", color = Color(0xFFFDE68A), fontSize = 11.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        // المقاعد الثمانية الأخرى (Grid 4x2)
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth().weight(1f)
        ) {
            itemsIndexed(seats.drop(1)) { index, seat ->
                val actualIndex = index + 1
                VoiceSeatItem(seat = seat, seatNumber = actualIndex, onClick = { onSeatClick(actualIndex) })
            }
        }

        // شريط التحكم بالصوت وإرسال الهدايا
        Row(
            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onToggleMic) { Text("🎙️", fontSize = 24.sp) }
            IconButton(onClick = { /* رفع اليد */ }) { Text("✋", fontSize = 24.sp) }
            Button(
                onClick = onSendGiftClick,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFF37C8)),
                shape = RoundedCornerShape(20.dp)
            ) {
                Text("🎁 إرسال هدية", color = Color.White)
            }
        }
    }
}

@Composable
fun VoiceSeatItem(seat: VoiceSeat, seatNumber: Int, onClick: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { onClick() }) {
        Box(
            modifier = Modifier
                .size(54.dp)
                .clip(CircleShape)
                .background(if (seat.occupied) Color(0x33FFFFFF) else Color(0x1AFFFFFF))
                .border(1.dp, if (seat.isSpeaking) Color(0xFFFF37C8) else Color(0x33FFFFFF), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(if (seat.occupied) (seat.userName.firstOrNull()?.toString() ?: "👤") else "🔒", fontSize = 18.sp, color = Color.White)
        }
        Text("مايك $seatNumber", fontSize = 10.sp, color = Color(0xFFCBD5E1))
    }
}`,

    roles: `// ==========================================
// 3. RoomPermissionsManager.kt
// Full RBAC System: Owner / Admin / Host / Moderator / Speaker / Listener
// Mute, Kick, Ban, Hand Raise & Stage Elevation
// ==========================================
package com.partylive.app.domain.permissions

enum class RoomRole(val rank: Int, val titleAr: String) {
    OWNER(6, "المالك"),
    ADMIN(5, "المدير"),
    HOST(4, "المضيف"),
    MODERATOR(3, "المشرف"),
    SPEAKER(2, "متحدث"),
    LISTENER(1, "مستمع")
}

data class PermissionAction(
    val canMute: Boolean,
    val canKick: Boolean,
    val canBan: Boolean,
    val canLockSeat: Boolean,
    val canPromote: Boolean,
    val canAcceptHandRaise: Boolean
)

object RoomPermissionsManager {

    fun getPermissions(actorRole: RoomRole, targetRole: RoomRole): PermissionAction {
        // المالك يمتلك كامل الصلاحيات
        if (actorRole == RoomRole.OWNER) {
            return PermissionAction(
                canMute = true,
                canKick = targetRole != RoomRole.OWNER,
                canBan = targetRole != RoomRole.OWNER,
                canLockSeat = true,
                canPromote = true,
                canAcceptHandRaise = true
            )
        }

        // المدير يمكنه إدارة المشرفين والمتحدثين والمستمعين
        if (actorRole == RoomRole.ADMIN) {
            val hasRankAdvantage = actorRole.rank > targetRole.rank
            return PermissionAction(
                canMute = hasRankAdvantage,
                canKick = hasRankAdvantage,
                canBan = hasRankAdvantage,
                canLockSeat = true,
                canPromote = false,
                canAcceptHandRaise = true
            )
        }

        // المشرف والمضيف
        if (actorRole == RoomRole.MODERATOR || actorRole == RoomRole.HOST) {
            val hasRankAdvantage = targetRole == RoomRole.SPEAKER || targetRole == RoomRole.LISTENER
            return PermissionAction(
                canMute = hasRankAdvantage,
                canKick = hasRankAdvantage,
                canBan = false,
                canLockSeat = false,
                canPromote = false,
                canAcceptHandRaise = true
            )
        }

        // المتحدث والمستمع بدون صلاحيات إدارية
        return PermissionAction(
            canMute = false,
            canKick = false,
            canBan = false,
            canLockSeat = false,
            canPromote = false,
            canAcceptHandRaise = false
        )
    }
}`,

    models: `// ==========================================
// 4. PartyLiveModels.kt
// Single Currency: COINS ONLY (No Diamonds, No Gems)
// Data Classes Ready for Firebase Firestore & RTC SDK
// ==========================================
package com.partylive.app.data.model

import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.ServerTimestamp
import java.util.Date

// المستخدم الموحد: عملة واحدة فقط هي Coins
data class UserProfile(
    @DocumentId val id: String = "",
    val name: String = "",
    val avatar: String = "",
    val coins: Long = 10_000_000L, // كوينز فقط بدون أي ماسات
    val badgeLevel: Int = 15,
    val vipLevel: Int = 5,
    val country: String = "مصر",
    val countryFlag: String = "🇪🇬",
    val followersCount: Int = 1280,
    val followingCount: Int = 34,
    val visitorsCount: Int = 3500,
    val familyId: String? = "fam-1",
    val familyName: String? = "صقور العرب"
)

// الغرفة الصوتية
data class VoiceRoom(
    @DocumentId val id: String = "",
    val title: String = "",
    val hostId: String = "",
    val hostName: String = "",
    val hostAvatar: String = "",
    val onlineCount: Int = 1,
    val announcement: String = "",
    val admins: List<String> = emptyList(),
    val moderators: List<String> = emptyList(),
    val bannedUsers: List<String> = emptyList(),
    val mutedUsers: List<String> = emptyList(),
    val seats: List<VoiceSeat> = emptyList(),
    @ServerTimestamp val createdAt: Date? = null
)

// مقعد المايك الصوتي
data class VoiceSeat(
    val seatNumber: Int = 0,
    val occupied: Boolean = false,
    val userId: String? = null,
    val userName: String = "",
    val userAvatar: String = "",
    val isMuted: Boolean = false,
    val isSpeaking: Boolean = false,
    val isLocked: Boolean = false,
    val role: RoomRole = RoomRole.LISTENER
)

// طلب رفع اليد
data class HandRaiseRequest(
    val id: String = "",
    val userId: String = "",
    val userName: String = "",
    val userAvatar: String = "",
    val requestedAt: Long = System.currentTimeMillis()
)

// الهدية الملكية بالكوينز
data class GiftItem(
    val id: String = "",
    val nameAr: String = "",
    val costCoins: Long = 0L, // بالعملات الذهبية Coins
    val icon: String = "",
    val animationType: String = "banner"
)`,

    store: `// ==========================================
// 5. WalletAndStoreScreen.kt
// Coins-Only Recharge & Royal VIP Privilege System
// ==========================================
package com.partylive.app.ui.store

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class CoinPackage(val coins: Long, val price: String, val bonus: String)

@Composable
fun WalletScreen(
    currentCoins: Long,
    onRechargeSelected: (CoinPackage) -> Unit
) {
    val packages = listOf(
        CoinPackage(500, "4.99 $", "+50 كوينز مجاناً"),
        CoinPackage(1200, "9.99 $", "+150 كوينز مجاناً"),
        CoinPackage(3000, "24.99 $", "+500 كوينز مجاناً"),
        CoinPackage(7000, "49.99 $", "+1500 كوينز مجاناً"),
        CoinPackage(15000, "99.99 $", "+4000 كوينز مجاناً"),
        CoinPackage(35000, "199.99 $", "+10000 كوينز مجاناً")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F0A1C))
            .padding(16.dp)
    ) {
        // بطاقة رصيد الكوينز الحالي
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1533))
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("🪙 رصيد المحفظة الحالي", color = Color(0xFFFBBF24), fontSize = 13.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Text("$currentCoins Coins", color = Color.White, fontSize = 28.sp, style = MaterialTheme.typography.headlineMedium)
                Text("العملة المعتمدة الوحيدة في كافة الغرف والهدايا والمتجر", color = Color(0xFF94A3B8), fontSize = 11.sp)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
        Text("باقات شحن الكوينز", color = Color.White, fontSize = 16.sp)

        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(packages) { pack ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF1A122B), RoundedCornerShape(16.dp))
                        .border(1.dp, Color(0x33FBBF24), RoundedCornerShape(16.dp))
                        .clickable { onRechargeSelected(pack) }
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("\${pack.coins} Coins 🪙", color = Color.White, fontSize = 15.sp)
                        Text(pack.bonus, color = Color(0xFF34D399), fontSize = 11.sp)
                    }
                    Button(
                        onClick = { onRechargeSelected(pack) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(pack.price, color = Color.Black)
                    }
                }
            }
        }
    }
}`
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 text-slate-100" dir="ltr">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Kotlin & Jetpack Compose Native Specification</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  RTL Arabic Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">جميع الشاشات والصلاحيات والعملة الموحدة Coins</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs font-semibold text-white transition active:scale-95 shadow-md"
              title="نسخ كود Kotlin"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-slate-800/80 no-scrollbar">
          <button
            onClick={() => setActiveCodeTab('main')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'main'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1. التنقل والـ NavigationBar</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('room')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'room'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. غرفة الصوت (9 مايكات)</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('roles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'roles'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. نظام الصلاحيات الكامل</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('models')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'models'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>4. نماذج البيانات (Firebase Firestore)</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('store')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'store'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>5. المحفظة والكوينز فقط</span>
          </button>
        </div>

        {/* Code Block with line numbering */}
        <div className="flex-1 overflow-y-auto my-3 rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs leading-relaxed text-slate-300">
          <pre className="overflow-x-auto whitespace-pre">
            <code>{codeSnippets[activeCodeTab]}</code>
          </pre>
        </div>

        {/* Architectural Footer Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-left">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>عملة موحدة Coins</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              تم استبعاد أي Diamonds أو Gems والاعتماد بنسبة 100% على الـ Coins للشحن والإهداء.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RBAC الصلاحيات الكاملة</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Owner, Admin, Host, Moderator, Speaker, Listener مع كتم وطرد وحظر وإدارة المايكات.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-[11px] font-bold text-pink-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RTL & Mobile Ready</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              تخطيط عربي كامل RTL مع هيكل متوافق مع Firebase Firestore وAgora/LiveKit RTC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
