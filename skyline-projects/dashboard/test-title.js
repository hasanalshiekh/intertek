// Unit Tests for Dynamic Title Functionality
// Run this in a browser environment with translations.js loaded

function testDynamicTitle() {
    console.log('🧪 Testing Dynamic Title Functionality...');
    
    let testsPassed = 0;
    let totalTests = 0;
    
    // Test 1: Check if translations object exists
    totalTests++;
    if (window.translations && window.translations.t) {
        console.log('✅ Test 1: Translations object exists');
        testsPassed++;
    } else {
        console.log('❌ Test 1: Translations object not found');
    }
    
    // Test 2: Check if pageTitle translation exists for Arabic
    totalTests++;
    const arabicTitle = window.translations.t('pageTitle');
    if (arabicTitle && arabicTitle.includes('لوحة تحكم')) {
        console.log('✅ Test 2: Arabic page title translation exists');
        testsPassed++;
    } else {
        console.log('❌ Test 2: Arabic page title translation missing or incorrect');
    }
    
    // Test 3: Check if pageTitle translation exists for English
    totalTests++;
    // Temporarily change language to English
    const originalLang = window.translations.currentLanguage();
    window.translations.changeLanguage('en');
    const englishTitle = window.translations.t('pageTitle');
    if (englishTitle && englishTitle.includes('Dashboard')) {
        console.log('✅ Test 3: English page title translation exists');
        testsPassed++;
    } else {
        console.log('❌ Test 3: English page title translation missing or incorrect');
    }
    
    // Test 4: Check if loginPageTitle translation exists
    totalTests++;
    const loginTitle = window.translations.t('loginPageTitle');
    if (loginTitle && loginTitle.includes('SkylineWeb')) {
        console.log('✅ Test 4: Login page title translation exists');
        testsPassed++;
    } else {
        console.log('❌ Test 4: Login page title translation missing or incorrect');
    }
    
    // Test 5: Check if document title changes when language changes
    totalTests++;
    const originalTitle = document.title;
    window.translations.changeLanguage('ar');
    const arabicDocTitle = document.title;
    window.translations.changeLanguage('en');
    const englishDocTitle = document.title;
    
    if (arabicDocTitle !== englishDocTitle && 
        arabicDocTitle.includes('لوحة تحكم') && 
        englishDocTitle.includes('Dashboard')) {
        console.log('✅ Test 5: Document title changes with language');
        testsPassed++;
    } else {
        console.log('❌ Test 5: Document title does not change with language');
    }
    
    // Restore original language
    window.translations.changeLanguage(originalLang);
    
    // Test 6: Check if updatePageLanguage function exists
    totalTests++;
    if (typeof window.translations.updatePageLanguage === 'function') {
        console.log('✅ Test 6: updatePageLanguage function exists');
        testsPassed++;
    } else {
        console.log('❌ Test 6: updatePageLanguage function not found');
    }
    
    // Test Results
    console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 All tests passed! Dynamic title functionality is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the implementation.');
    }
    
    return testsPassed === totalTests;
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testDynamicTitle };
}

// Auto-run tests if this file is loaded in browser
if (typeof window !== 'undefined') {
    // Wait for translations to load
    setTimeout(() => {
        if (window.translations) {
            testDynamicTitle();
        } else {
            console.log('⚠️  Translations not loaded yet. Please run testDynamicTitle() manually.');
        }
    }, 1000);
}
