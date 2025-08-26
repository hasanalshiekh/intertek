// Dashboard JavaScript
let currentTheme = 'light';
let demoMode = false;
let currentSection = 'dashboard';
let charts = {};
let currentUser = null;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAuthentication()) {
        window.location.href = 'login.html';
        return;
    }
    
    initializeDashboard();
    loadDemoData();
    initializeCharts();
    setupEventListeners();
    setupUserInterface();
});

// Check user authentication
function checkAuthentication() {
    const localSession = localStorage.getItem('skylineSession');
    const sessionSession = sessionStorage.getItem('skylineSession');
    
    if (localSession) {
        currentUser = JSON.parse(localSession);
        return true;
    } else if (sessionSession) {
        currentUser = JSON.parse(sessionSession);
        return true;
    }
    
    return false;
}

// Get current session
function getSession() {
    const localSession = localStorage.getItem('skylineSession');
    const sessionSession = sessionStorage.getItem('skylineSession');
    
    if (localSession) {
        return JSON.parse(localSession);
    } else if (sessionSession) {
        return JSON.parse(sessionSession);
    }
    
    return null;
}

// Check if user has permission
function hasPermission(permission) {
    return currentUser && currentUser.permissions.includes(permission);
}

// Get translated text
function getTranslatedText(key) {
    return window.translations ? window.translations.t(key) : key;
}

// Clear session and logout
function logout() {
    localStorage.removeItem('skylineSession');
    sessionStorage.removeItem('skylineSession');
    window.location.href = 'login.html';
}

// Setup user interface based on permissions
function setupUserInterface() {
    if (!currentUser) return;
    
    // Update user name in header
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }
    
    // Hide menu items based on permissions
    const menuItems = {
        'users': 'users',
        'analytics': 'analytics', 
        'payments': 'payments',
        'settings': 'settings'
    };
    
    Object.keys(menuItems).forEach(menuKey => {
        const permission = menuItems[menuKey];
        const menuItem = document.querySelector(`[onclick="showSection('${menuKey}')"]`).parentElement;
        
        if (!hasPermission(permission)) {
            menuItem.style.display = 'none';
        }
    });
    
    // Add logout functionality to user menu
    setupLogoutMenu();
    
    // Setup permission-based UI elements
    setupPermissionBasedUI();
}

// Setup permission-based UI elements
function setupPermissionBasedUI() {
    // Hide add user button for non-admin users
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn && !hasPermission('users')) {
        addUserBtn.style.display = 'none';
    }
    
    // Add permission checks to section navigation
    const originalShowSection = window.showSection;
    window.showSection = function(sectionName) {
        // Check if user has permission to access this section
        if (!hasPermission(sectionName)) {
            alert(getTranslatedText('noPermission'));
            return;
        }
        
        // Call original function
        originalShowSection(sectionName);
    };
}

// Initialize Dashboard
function initializeDashboard() {
    // Set initial theme
    setTheme(currentTheme);
    
    // Load initial data
    loadUsersData();
    loadPagesData();
    loadPaymentsData();
    loadActivityData();
    generateCalendar();
    
    // Initialize chatbot
    initializeChatbot();
}

// Theme Management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
    
    // Update chart colors for theme
    updateChartColors();
}

// Sidebar Management
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Section Navigation
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`).parentElement;
    activeNavItem.classList.add('active');
    
    // Update breadcrumb
    updateBreadcrumb(sectionName);
    
    currentSection = sectionName;
}

function updateBreadcrumb(sectionName) {
    const breadcrumb = document.getElementById('current-page');
    const sectionNames = {
        'dashboard': 'الرئيسية',
        'users': 'المستخدمين',
        'pages': 'الصفحات',
        'analytics': 'التحليلات',
        'calendar': 'التقويم',
        'payments': 'المدفوعات',
        'settings': 'الإعدادات'
    };
    
    breadcrumb.textContent = sectionNames[sectionName] || sectionName;
}

// Demo Mode Toggle
function toggleDemoMode() {
    demoMode = !demoMode;
    updateDemoData();
    showNotification(demoMode ? 'تم تفعيل الوضع التجريبي' : 'تم إلغاء الوضع التجريبي', 'info');
}

function updateDemoData() {
    if (demoMode) {
        // Demo data
        document.getElementById('users-count').textContent = '5,234';
        document.getElementById('revenue-count').textContent = '$67,890';
        document.getElementById('views-count').textContent = '156,789';
        document.getElementById('growth-count').textContent = '34.2%';
    } else {
        // Real data
        document.getElementById('users-count').textContent = '2,847';
        document.getElementById('revenue-count').textContent = '$45,231';
        document.getElementById('views-count').textContent = '89,234';
        document.getElementById('growth-count').textContent = '23.5%';
    }
    
    // Update charts
    updateCharts();
}

// Charts Management
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'الإيرادات',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Users Chart
    const usersCtx = document.getElementById('usersChart');
    if (usersCtx) {
        charts.users = new Chart(usersCtx, {
            type: 'doughnut',
            data: {
                labels: ['مستخدمين نشطين', 'مستخدمين جدد', 'مستخدمين غير نشطين'],
                datasets: [{
                    data: [65, 20, 15],
                    backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Analytics Charts
    initializeAnalyticsCharts();
}

function initializeAnalyticsCharts() {
    // Visits Chart
    const visitsCtx = document.getElementById('visitsChart');
    if (visitsCtx) {
        charts.visits = new Chart(visitsCtx, {
            type: 'bar',
            data: {
                labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
                datasets: [{
                    label: 'الزيارات',
                    data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
                    backgroundColor: '#0ea5e9'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Sources Chart
    const sourcesCtx = document.getElementById('sourcesChart');
    if (sourcesCtx) {
        charts.sources = new Chart(sourcesCtx, {
            type: 'pie',
            data: {
                labels: ['Google', 'Facebook', 'Twitter', 'Direct'],
                datasets: [{
                    data: [40, 25, 20, 15],
                    backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

function updateCharts() {
    if (demoMode) {
        // Demo data for charts
        if (charts.revenue) {
            charts.revenue.data.datasets[0].data = [15000, 25000, 20000, 35000, 30000, 45000];
            charts.revenue.update();
        }
    } else {
        // Real data for charts
        if (charts.revenue) {
            charts.revenue.data.datasets[0].data = [12000, 19000, 15000, 25000, 22000, 30000];
            charts.revenue.update();
        }
    }
}

function updateChartColors() {
    // Update chart colors based on theme
    const isDark = currentTheme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    Object.values(charts).forEach(chart => {
        if (chart.options.scales) {
            chart.options.scales.y.grid.color = gridColor;
        }
        chart.update();
    });
}

// Data Loading Functions
function loadUsersData() {
    const usersData = [
        { name: 'أحمد محمد', email: 'ahmed@example.com', role: 'مدير', status: 'نشط', date: '2024-01-15' },
        { name: 'فاطمة علي', email: 'fatima@example.com', role: 'محرر', status: 'نشط', date: '2024-02-20' },
        { name: 'محمد حسن', email: 'mohamed@example.com', role: 'مستخدم', status: 'غير نشط', date: '2024-03-10' },
        { name: 'سارة أحمد', email: 'sara@example.com', role: 'محرر', status: 'نشط', date: '2024-04-05' }
    ];
    
    const tbody = document.getElementById('usersTableBody');
    if (tbody) {
        tbody.innerHTML = usersData.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${user.role}">${user.role}</span></td>
                <td><span class="status-badge ${user.status === 'نشط' ? 'active' : 'inactive'}">${user.status}</span></td>
                <td>${user.date}</td>
                <td>
                    <button class="action-btn" onclick="editUser('${user.email}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteUser('${user.email}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function loadPagesData() {
    const pagesData = [
        { title: 'الصفحة الرئيسية', status: 'منشور', views: 1250, date: '2024-01-15' },
        { title: 'من نحن', status: 'مسودة', views: 0, date: '2024-02-20' },
        { title: 'خدماتنا', status: 'منشور', views: 890, date: '2024-03-10' },
        { title: 'اتصل بنا', status: 'منشور', views: 567, date: '2024-04-05' }
    ];
    
    const grid = document.getElementById('pagesGrid');
    if (grid) {
        grid.innerHTML = pagesData.map(page => `
            <div class="page-card">
                <div class="page-header">
                    <h3>${page.title}</h3>
                    <span class="status-badge ${page.status === 'منشور' ? 'published' : 'draft'}">${page.status}</span>
                </div>
                <div class="page-stats">
                    <span><i class="fas fa-eye"></i> ${page.views} مشاهدة</span>
                    <span><i class="fas fa-calendar"></i> ${page.date}</span>
                </div>
                <div class="page-actions">
                    <button class="action-btn" onclick="editPage('${page.title}')">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="action-btn" onclick="viewPage('${page.title}')">
                        <i class="fas fa-external-link-alt"></i> عرض
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function loadPaymentsData() {
    const paymentsData = [
        { id: 'PAY-001', customer: 'أحمد محمد', amount: 1500, status: 'مكتمل', date: '2024-01-15' },
        { id: 'PAY-002', customer: 'فاطمة علي', amount: 2300, status: 'معلق', date: '2024-02-20' },
        { id: 'PAY-003', customer: 'محمد حسن', amount: 800, status: 'مكتمل', date: '2024-03-10' },
        { id: 'PAY-004', customer: 'سارة أحمد', amount: 3200, status: 'معلق', date: '2024-04-05' }
    ];
    
    const tbody = document.getElementById('paymentsTableBody');
    if (tbody) {
        tbody.innerHTML = paymentsData.map(payment => `
            <tr>
                <td>${payment.id}</td>
                <td>${payment.customer}</td>
                <td>$${payment.amount}</td>
                <td><span class="status-badge ${payment.status === 'مكتمل' ? 'completed' : 'pending'}">${payment.status}</span></td>
                <td>${payment.date}</td>
                <td>
                    <button class="action-btn" onclick="viewPayment('${payment.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="processPayment('${payment.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function loadActivityData() {
    const activities = [
        { type: 'user', message: 'تم إضافة مستخدم جديد', user: 'أحمد محمد', time: 'منذ 5 دقائق' },
        { type: 'page', message: 'تم تحديث الصفحة الرئيسية', user: 'فاطمة علي', time: 'منذ 15 دقيقة' },
        { type: 'payment', message: 'تم استلام دفعة جديدة', user: 'محمد حسن', time: 'منذ ساعة' },
        { type: 'analytics', message: 'تم تحديث التحليلات', user: 'سارة أحمد', time: 'منذ ساعتين' }
    ];
    
    const activityList = document.getElementById('activityList');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <span class="activity-meta">بواسطة ${activity.user} • ${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

function getActivityIcon(type) {
    const icons = {
        'user': 'user-plus',
        'page': 'file-edit',
        'payment': 'credit-card',
        'analytics': 'chart-line'
    };
    return icons[type] || 'info-circle';
}

// Calendar Functions
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getYear();
    
    // Update month display
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                       'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear + 1900}`;
    
    // Generate calendar days
    const daysInMonth = new Date(currentYear + 1900, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear + 1900, currentMonth, 1).getDay();
    
    let calendarHTML = `
        <div class="calendar-weekdays">
            <div>الأحد</div>
            <div>الاثنين</div>
            <div>الثلاثاء</div>
            <div>الأربعاء</div>
            <div>الخميس</div>
            <div>الجمعة</div>
            <div>السبت</div>
        </div>
        <div class="calendar-days">
    `;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDate.getDate();
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''}" onclick="selectDate(${day})">
                <span class="day-number">${day}</span>
                ${day === 15 ? '<div class="event-dot"></div>' : ''}
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    calendarGrid.innerHTML = calendarHTML;
}

function previousMonth() {
    // Implementation for previous month
    showNotification('الشهر السابق', 'info');
}

function nextMonth() {
    // Implementation for next month
    showNotification('الشهر التالي', 'info');
}

function selectDate(day) {
    showNotification(`تم اختيار اليوم ${day}`, 'info');
}

// AI Chatbot Functions
function initializeChatbot() {
    // Initial chatbot setup
}

function toggleChatbot() {
    const chatbotBody = document.getElementById('chatbotBody');
    const toggleIcon = document.getElementById('chatbotToggleIcon');
    
    if (chatbotBody.style.display === 'none') {
        chatbotBody.style.display = 'flex';
        toggleIcon.className = 'fas fa-chevron-up';
    } else {
        chatbotBody.style.display = 'none';
        toggleIcon.className = 'fas fa-chevron-down';
    }
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000);
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
        <span class="message-time">${timeString}</span>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateBotResponse(message) {
    const responses = [
        'أفهم سؤالك، كيف يمكنني مساعدتك أكثر؟',
        'هذا سؤال ممتاز! دعني أبحث عن الإجابة لك.',
        'شكراً لسؤالك، سأقوم بمعالجة طلبك الآن.',
        'أحتاج إلى مزيد من المعلومات لمساعدتك بشكل أفضل.',
        'هذا شيء يمكنني مساعدتك به، ما رأيك في...'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function openWhatsApp() {
    const phoneNumber = '+966501234567';
    const message = 'مرحباً، أحتاج مساعدة في لوحة التحكم';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Modal Functions
function showAddUserModal() {
    showModal('addUserModal');
}

function showAddPageModal() {
    showNotification('سيتم إضافة هذه الميزة قريباً', 'info');
}

function showAddEventModal() {
    showNotification('سيتم إضافة هذه الميزة قريباً', 'info');
}

function showAddPaymentModal() {
    showNotification('سيتم إضافة هذه الميزة قريباً', 'info');
}

function showModal(modalId) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId);
    
    if (modalOverlay && modal) {
        modalOverlay.classList.add('active');
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId);
    
    if (modalOverlay && modal) {
        modalOverlay.classList.remove('active');
        modal.style.display = 'none';
    }
}

function closeAllModals() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modals = document.querySelectorAll('.modal');
    
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
    
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#22c55e',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#0ea5e9'
    };
    return colors[type] || '#0ea5e9';
}

// Event Listeners Setup
function setupEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'k') {
            event.preventDefault();
            document.querySelector('.search-box input').focus();
        }
        
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(event) {
            const searchTerm = event.target.value.toLowerCase();
            // Implement search functionality
        });
    }
}

// Demo Data Loading
function loadDemoData() {
    // Load initial demo data
    updateDemoData();
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-right: auto;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-content button:hover {
        opacity: 1;
    }
    
    .role-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
    }
    
    .role-badge.مدير { background: #0ea5e9; color: white; }
    .role-badge.محرر { background: #22c55e; color: white; }
    .role-badge.مستخدم { background: #f59e0b; color: white; }
    
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
    }
    
    .status-badge.active,
    .status-badge.published,
    .status-badge.completed { background: #22c55e; color: white; }
    
    .status-badge.inactive,
    .status-badge.draft,
    .status-badge.pending { background: #f59e0b; color: white; }
    
    .action-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .action-btn:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }
    
    .action-btn.delete:hover {
        background: var(--danger-color);
        color: white;
    }
    
    .page-card {
        background: var(--bg-primary);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-sm);
    }
    
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .page-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .page-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-secondary);
        border-radius: var(--border-radius-sm);
    }
    
    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
    
    .activity-icon.user { background: #0ea5e9; }
    .activity-icon.page { background: #22c55e; }
    .activity-icon.payment { background: #f59e0b; }
    .activity-icon.analytics { background: #8b5cf6; }
    
    .activity-meta {
        font-size: 0.875rem;
        color: var(--text-muted);
    }
    
    .calendar-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: var(--border-color);
        border-radius: var(--border-radius-sm);
        overflow: hidden;
    }
    
    .calendar-weekdays > div {
        background: var(--bg-primary);
        padding: 1rem;
        text-align: center;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: var(--border-color);
        border-radius: var(--border-radius-sm);
        overflow: hidden;
        margin-top: 1px;
    }
    
    .calendar-day {
        background: var(--bg-primary);
        padding: 1rem;
        text-align: center;
        cursor: pointer;
        position: relative;
        transition: background 0.3s ease;
    }
    
    .calendar-day:hover {
        background: var(--bg-tertiary);
    }
    
    .calendar-day.today {
        background: var(--primary-color);
        color: white;
    }
    
    .calendar-day.empty {
        background: var(--bg-secondary);
        cursor: default;
    }
    
    .event-dot {
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background: var(--danger-color);
        border-radius: 50%;
    }
`;
document.head.appendChild(notificationStyles);

// Setup logout menu functionality
function setupLogoutMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;
    
    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'user-dropdown';
    dropdownMenu.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-sm);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 200px;
        z-index: 1000;
        display: none;
        margin-top: 0.5rem;
    `;
    
    dropdownMenu.innerHTML = `
        <div class="dropdown-header" style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
            <div style="font-weight: 600; color: var(--text-primary);">${currentUser.name}</div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">${currentUser.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</div>
        </div>
        <div class="dropdown-item" onclick="logout()" style="padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); transition: background 0.3s ease;">
            <i class="fas fa-sign-out-alt"></i>
            <span>${getTranslatedText('logout')}</span>
        </div>
    `;
    
    userMenu.style.position = 'relative';
    userMenu.appendChild(dropdownMenu);
    
    // Toggle dropdown on click
    userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownMenu.style.display = 'none';
    });
}

