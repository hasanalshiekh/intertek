#!/bin/bash

echo "========================================"
echo "    SkylineWeb CMS Dashboard"
echo "========================================"
echo ""
echo "بدء تشغيل الداش بورد..."
echo ""

# التحقق من وجود الملفات
if [ ! -f "dashboard.html" ]; then
    echo "خطأ: ملف dashboard.html غير موجود!"
    echo "تأكد من وجود جميع الملفات المطلوبة:"
    echo "- dashboard.html"
    echo "- dashboard.css"
    echo "- dashboard.js"
    read -p "اضغط Enter للخروج..."
    exit 1
fi

if [ ! -f "dashboard.css" ]; then
    echo "خطأ: ملف dashboard.css غير موجود!"
    read -p "اضغط Enter للخروج..."
    exit 1
fi

if [ ! -f "dashboard.js" ]; then
    echo "خطأ: ملف dashboard.js غير موجود!"
    read -p "اضغط Enter للخروج..."
    exit 1
fi

echo "✓ تم العثور على جميع الملفات المطلوبة"
echo ""

# محاولة فتح الداش بورد في المتصفح
echo "جاري فتح الداش بورد في المتصفح..."

# تحديد المتصفح المناسب
if command -v google-chrome &> /dev/null; then
    google-chrome dashboard.html
elif command -v firefox &> /dev/null; then
    firefox dashboard.html
elif command -v safari &> /dev/null; then
    open -a Safari dashboard.html
elif command -v xdg-open &> /dev/null; then
    xdg-open dashboard.html
elif command -v open &> /dev/null; then
    open dashboard.html
else
    echo "تحذير: لم يتم العثور على متصفح مناسب"
    echo "يرجى فتح ملف dashboard.html يدوياً في المتصفح"
fi

echo ""
echo "========================================"
echo "تم فتح الداش بورد بنجاح!"
echo "========================================"
echo ""
echo "المميزات المتاحة:"
echo "- تبديل الثيمات (فاتح/داكن)"
echo "- الوضع التجريبي"
echo "- المساعد الذكي"
echo "- جميع الأقسام التفاعلية"
echo ""
read -p "اضغط Enter للخروج..."

