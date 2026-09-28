import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, QrCode, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [activeTab, setActiveTab] = useState<'apk' | 'adb' | 'twa'>('apk');

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const copyAdbCommand = () => {
    const cmd = `# 1. توصيل الهاتف عبر USB وتفعيل خيارات المطور وتصحيح أخطاء USB (USB Debugging)
adb devices

# 2. تشغيل التطبيق في وضع الـ WebApp فائق السرعة عبر Chrome على جهازك:
adb shell am start -n com.android.chrome/com.google.android.apps.chrome.Main -d "${currentUrl}"

# 3. لتثبيت التطبيق مباشرة كـ APK مخصص:
# يمكنك استخدام أداة Bubblewrap CLI لتحويل رابط الـ PWA إلى APK رسمي وموقع خلال دقيقة واحدة:
npm i -g @bubblewrap/cli
bubblewrap init --manifest="${currentUrl}manifest.webmanifest"
bubblewrap build
adb install app-release-signed.apk`;
    navigator.clipboard?.writeText(cmd);
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-slate-100" dir="rtl">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>تثبيت وتشغيل PartyLive على Android</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  APK / ADB
                </span>
              </h2>
              <p className="text-xs text-slate-400">تثبيت فوري كتطبيق كامل بدون شريط متصفح</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'apk' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>تثبيت APK مباشر</span>
          </button>
          <button
            onClick={() => setActiveTab('adb')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'adb' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>عبر أداة ADB</span>
          </button>
          <button
            onClick={() => setActiveTab('twa')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'twa' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>بناء باقة APK مستقلة</span>
          </button>
        </div>

        {/* Body content based on tab */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 text-xs leading-relaxed text-slate-300">
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-800/40">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center text-2xl shrink-0">
                    📱
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">تثبيت التطبيق على هاتفك المحمول (PWA / WebAPK)</h3>
                    <p className="text-[11px] text-slate-300 mt-1">
                      نظام Android يقوم تلقائياً بإنشاء حزمة <strong>WebAPK</strong> رسمية وموقّعة من نظام Google Play Services، لتظهر أيقونة التطبيق في شاشة التطبيقات الرئيسية ويعمل بدون إطار المتصفح كأي تطبيق أصلي مع دعم المايك والكاميرا في الخلفية.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-800/30 flex flex-col gap-2">
                  {isInstallable ? (
                    <button
                      onClick={async () => {
                        await install();
                        onClose();
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 active:scale-98 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>تثبيت التطبيق الآن على الهاتف</span>
                    </button>
                  ) : (
                    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700 text-center">
                      <p className="text-white font-semibold mb-1">طريقة التثبيت السريع عبر متصفح الهاتف:</p>
                      <ol className="text-right text-[11px] text-slate-300 space-y-1 list-decimal list-inside pr-1">
                        <li>افتح هذا الرابط على هاتف أندرويد في متصفح <strong>Google Chrome</strong>.</li>
                        <li>اضغط على القائمة العلوية ذات الثلاث نقاط <strong>(⋮)</strong>.</li>
                        <li>اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</li>
                        <li>سيقوم أندرويد بتحميل ملف WebAPK وتثبيته مباشرة بأيقونة التطبيق الملكية!</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code link to open on phone */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="font-bold text-white text-[11px]">رابط التطبيق للهاتف:</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[240px]">
                      {currentUrl}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(currentUrl);
                    alert('تم نسخ الرابط! يمكنك إرساله لهاتفك لفتحه في كروم.');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition"
                >
                  نسخ الرابط
                </button>
              </div>
            </div>
          )}

          {activeTab === 'adb' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                    <Terminal className="w-4 h-4" />
                    <span>أوامر الاختبار والتثبيت عبر ADB للمطورين:</span>
                  </span>
                  <button
                    onClick={copyAdbCommand}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition"
                  >
                    {copiedAdb ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Terminal className="w-3.5 h-3.5" />}
                    <span>{copiedAdb ? 'تم النسخ' : 'نسخ الأوامر'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[10px] text-emerald-400 bg-black/60 p-2.5 rounded-lg overflow-x-auto leading-relaxed" dir="ltr">
                  <code>{`# 1. فحص اتصال الهاتف عبر USB
adb devices

# 2. تشغيل التطبيق في وضع الـ Standalone فوراً على الهاتف:
adb shell am start -a android.intent.action.VIEW -d "${currentUrl}" com.android.chrome`}</code>
                </pre>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p>💡 <strong>خطوات ربط الهاتف مع ADB:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li>قم بتفعيل <strong>Developer Options</strong> في إعدادات الهاتف بالنقر 7 مرات على رقم الإصدار (Build Number).</li>
                  <li>فعّل <strong>USB Debugging</strong>، وصِل الكابل بجهاز الكمبيوتر.</li>
                  <li>نفّذ الأمر أعلاه ليفتح التطبيق في وضع الشاشة الكاملة فوراً على هاتفك.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'twa' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-xs mb-1">إنشاء ملف .APK حقيقي لرفعه على Google Play أو تثبيته يدوياً:</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  باستخدام أداة Google الرسمية <strong>Bubblewrap (TWA)</strong>، يمكنك تحويل هذا المشروع إلى ملف <code>app-release-signed.apk</code> أصلي متكامل وموقّع:
                </p>
                <pre className="font-mono text-[10px] text-pink-400 bg-black/60 p-2.5 rounded-lg overflow-x-auto leading-relaxed" dir="ltr">
                  <code>{`# 1. تثبيت أداة جوجل لتحويل PWA إلى APK
npm i -g @bubblewrap/cli

# 2. إنشاء مشروع أندرويد واستخراج المفاتيح
bubblewrap init --manifest="${currentUrl}manifest.webmanifest"

# 3. بناء ملف الـ APK النهائي الموقّع
bubblewrap build

# 4. تثبيت الـ APK على الهاتف المتصل عبر ADB
adb install app-release-signed.apk`}</code>
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300">
                ✅ <strong>المشروع جاهز 100%</strong>: تم ضبط ملف الـ Manifest وأيقونات الـ Maskable 512x512 وملفات الـ PWA، وجميع الشاشات والصلاحيات والكوينز متوافقة تماماً.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span>العملة الوحيدة:</span>
            <span className="font-bold text-amber-400">10,000,000 Coins 🪙</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
