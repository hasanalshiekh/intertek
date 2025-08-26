@echo off
echo ========================================
echo    SkylineWeb CMS Dashboard
echo ========================================
echo.
echo بدء تشغيل الداش بورد...
echo.

REM التحقق من وجود الملفات
if not exist "dashboard.html" (
    echo خطأ: ملف dashboard.html غير موجود!
    echo تأكد من وجود جميع الملفات المطلوبة:
    echo - dashboard.html
    echo - dashboard.css
    echo - dashboard.js
    pause
    exit /b 1
)

if not exist "dashboard.css" (
    echo خطأ: ملف dashboard.css غير موجود!
    pause
    exit /b 1
)

if not exist "dashboard.js" (
    echo خطأ: ملف dashboard.js غير موجود!
    pause
    exit /b 1
)

echo ✓ تم العثور على جميع الملفات المطلوبة
echo.

REM محاولة فتح الداش بورد في المتصفح الافتراضي
echo جاري فتح الداش بورد في المتصفح...
start "" "dashboard.html"

echo.
echo ========================================
echo تم فتح الداش بورد بنجاح!
echo ========================================
echo.
echo المميزات المتاحة:
echo - تبديل الثيمات (فاتح/داكن)
echo - الوضع التجريبي
echo - المساعد الذكي
echo - جميع الأقسام التفاعلية
echo.
echo للخروج، اضغط أي مفتاح...
pause >nul

