// Translations for Login System
const translations = {
    ar: {
        // Login Page
        loginTitle: "تسجيل الدخول",
        loginSubtitle: "مرحباً بك في لوحة تحكم SkylineWeb",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        rememberMe: "تذكرني",
        loginButton: "تسجيل الدخول",
        loginSuccess: "تم تسجيل الدخول بنجاح!",
        
        // Demo Credentials
        demoCredentials: "بيانات تجريبية",
        adminCredentials: "مدير: admin / admin123",
        userCredentials: "مستخدم: user / user123",
        
        // Error Messages
        fillAllFields: "يرجى ملء جميع الحقول المطلوبة",
        invalidCredentials: "اسم المستخدم أو كلمة المرور غير صحيحة",
        
        // Dashboard
        dashboard: "الرئيسية",
        users: "المستخدمين",
        pages: "الصفحات",
        analytics: "التحليلات",
        calendar: "التقويم",
        payments: "المدفوعات",
        settings: "الإعدادات",
        
        // User Menu
        logout: "تسجيل الخروج",
        systemAdmin: "مدير النظام",
        regularUser: "مستخدم",
        
        // Permission Messages
        noPermission: "ليس لديك صلاحية للوصول إلى هذا القسم",
        
        // Language Switcher
        language: "اللغة",
        arabic: "العربية",
        english: "English"
    },
    en: {
        // Login Page
        loginTitle: "Login",
        loginSubtitle: "Welcome to SkylineWeb Dashboard",
        username: "Username",
        password: "Password",
        rememberMe: "Remember me",
        loginButton: "Login",
        loginSuccess: "Login successful!",
        
        // Demo Credentials
        demoCredentials: "Demo Credentials",
        adminCredentials: "Admin: admin / admin123",
        userCredentials: "User: user / user123",
        
        // Error Messages
        fillAllFields: "Please fill in all required fields",
        invalidCredentials: "Invalid username or password",
        
        // Dashboard
        dashboard: "Dashboard",
        users: "Users",
        pages: "Pages",
        analytics: "Analytics",
        calendar: "Calendar",
        payments: "Payments",
        settings: "Settings",
        
        // User Menu
        logout: "Logout",
        systemAdmin: "System Admin",
        regularUser: "User",
        
        // Permission Messages
        noPermission: "You don't have permission to access this section",
        
        // Language Switcher
        language: "Language",
        arabic: "العربية",
        english: "English"
    }
};

// Language management
let currentLanguage = localStorage.getItem('skylineLanguage') || 'ar';

// Function to get translation
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Function to change language
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('skylineLanguage', lang);
    updatePageLanguage();
}

// Function to update page language
function updatePageLanguage() {
    const html = document.documentElement;
    html.setAttribute('lang', currentLanguage);
    html.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    
    // Update all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = t(key);
    });
    
    // Update placeholders
    const placeholders = document.querySelectorAll('[data-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-placeholder');
        element.placeholder = t(key);
    });
    
    // Update titles
    const titles = document.querySelectorAll('[data-title]');
    titles.forEach(element => {
        const key = element.getAttribute('data-title');
        element.title = t(key);
    });
    
    // Update language buttons if they exist
    if (typeof updateLanguageButtons === 'function') {
        updateLanguageButtons();
    }
}

// Export for use in other files
window.translations = {
    t,
    changeLanguage,
    updatePageLanguage,
    currentLanguage: () => currentLanguage
};
