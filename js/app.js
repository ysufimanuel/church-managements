/**
 * Church Management System V5
 * Complete JavaScript Application with Role-Based Access Control
 * Features: Multi-language, Export formats, Privacy controls, Enhanced volunteer management
 */

// ========================================
// LANGUAGE SYSTEM
// ========================================

const translations = {
    id: {
        'app-title': 'Church Management System',
        'app-subtitle': 'Sistem Manajemen Gereja Digital',
        'username': 'Username',
        'password': 'Password',
        'remember-me': 'Ingat saya',
        'forgot-password': 'Lupa password?',
        'login': 'Login',
        'default-login': 'Default: admin / admin123',
        'lang-id': 'Bahasa Indonesia',
        'lang-en': 'English',
        'cms-title': 'CMS Gereja',
        'dashboard': 'Dashboard',
        'members': 'Members',
        'families': 'Families',
        'groups': 'Groups / Ministry',
        'events': 'Events',
        'attendance': 'Attendance',
        'donations': 'Donations',
        'volunteers': 'Volunteers',
        'communication': 'Communication',
        'reports': 'Reports',
        'user-management': 'User Management',
        'logout': 'Logout',
        'welcome-back': 'Selamat datang kembali',
        'total-members': 'Total Jemaat',
        'attendance-this-week': 'Kehadiran Minggu Ini',
        'donations-this-month': 'Donasi Bulan Ini',
        'active-events': 'Event Aktif',
        'total-groups': 'Total Groups',
        'active-volunteers': 'Relawan Aktif',
        'recent-activity': 'Aktivitas Terbaru',
        'view-all': 'Lihat Semua',
        'upcoming-events': 'Event Mendatang',
        'attendance-stats': 'Statistik Kehadiran',
        'this-week': 'Minggu Ini',
        'this-month': 'Bulan Ini',
        'this-year': 'Tahun Ini',
        'member-distribution': 'Distribusi Jemaat',
        'recent-donations': 'Donasi Terbaru',
        'notifications': 'Notifikasi',
        'mark-read': 'Tandai dibaca',
        'manage-members': 'Kelola data jemaat gereja',
        'search-members': 'Cari jemaat...',
        'all-status': 'Semua Status',
        'active': 'Aktif',
        'inactive': 'Tidak Aktif',
        'all-gender': 'Semua Gender',
        'male': 'Laki-laki',
        'female': 'Perempuan',
        'export': 'Export',
        'add-member': 'Tambah Member',
        'photo': 'Foto',
        'name': 'Nama',
        'email': 'Email',
        'phone': 'Telepon',
        'gender': 'Gender',
        'status': 'Status',
        'group': 'Group',
        'action': 'Aksi',
        'manage-families': 'Kelola data keluarga jemaat',
        'search-families': 'Cari keluarga...',
        'add-family': 'Tambah Keluarga',
        'manage-groups': 'Kelola group dan pelayanan',
        'search-groups': 'Cari group...',
        'add-group': 'Tambah Group',
        'manage-events': 'Kelola event dan kegiatan gereja',
        'search-events': 'Cari event...',
        'add-event': 'Tambah Event',
        'upcoming': 'Mendatang',
        'ongoing': 'Sedang Berlangsung',
        'completed': 'Selesai',
        'attendance-system': 'Sistem check-in dan data kehadiran',
        'checkin': 'Check-in',
        'attendance-data': 'Data Kehadiran',
        'report': 'Laporan',
        'checkin-attendance': 'Check-in Kehadiran',
        'select-event': 'Pilih Event',
        'search-member': 'Cari Jemaat',
        'today-attendance': 'Kehadiran Hari Ini',
        'all-events': 'Semua Event',
        'date': 'Tanggal',
        'event': 'Event',
        'checkin-time': 'Waktu Check-in',
        'total-attendance': 'Total Kehadiran',
        'average': 'Rata-rata',
        'top-event': 'Event Terbanyak',
        'manage-donations': 'Kelola donasi dan keuangan gereja',
        'total-donations': 'Total Donasi',
        'total-donors': 'Total Donor',
        'average-donation': 'Rata-rata Donasi',
        'all-types': 'Semua Tipe',
        'tithe': 'Perpuluhan',
        'offering': 'Persembahan',
        'building': 'Pembangunan',
        'social': 'Sosial',
        'add-donation': 'Tambah Donasi',
        'donor': 'Donatur',
        'type': 'Tipe',
        'description': 'Keterangan',
        'amount': 'Jumlah',
        'manage-volunteers': 'Kelola relawan dan jadwal pelayanan',
        'volunteer-list': 'Daftar Relawan',
        'service-schedule': 'Jadwal Pelayanan',
        'assignments': 'Penugasan',
        'search-volunteers': 'Cari relawan...',
        'add-volunteer': 'Tambah Relawan',
        'add-assignment': 'Tambah Penugasan',
        'communication-system': 'Sistem komunikasi dan broadcast',
        'email-broadcast': 'Email Broadcast',
        'send-message': 'Kirim Pesan',
        'announcements-tab': 'Pengumuman',
        'recipients': 'Penerima',
        'all-members': 'Semua Jemaat',
        'active-members': 'Members Aktif',
        'by-groups': 'By Groups',
        'custom': 'Custom',
        'subject': 'Subjek',
        'message': 'Pesan',
        'save-draft': 'Simpan Draft',
        'send-broadcast': 'Kirim Broadcast',
        'contacts': 'Kontak',
        'search-contacts': 'Cari kontak...',
        'select-contact': 'Pilih kontak untuk memulai percakapan',
        'type-message': 'Tulis pesan...',
        'create-announcement': 'Buat Pengumuman',
        'reports-system': 'Laporan dan statistik sistem',
        'members-report': 'Laporan Jemaat',
        'members-stats': 'Statistik dan data jemaat',
        'attendance-report': 'Laporan Kehadiran',
        'attendance-data-report': 'Data kehadiran event',
        'donations-report': 'Laporan Donasi',
        'donations-summary': 'Ringkasan donasi dan keuangan',
        'system-stats': 'Statistik Sistem',
        'system-overview': 'Overview keseluruhan sistem',
        'save-as': 'Save As',
        'print': 'Cetak',
        'manage-users': 'Kelola pengguna dan akses sistem',
        'search-users': 'Cari user...',
        'add-user': 'Tambah User',
        'add-new-member': 'Tambah Member Baru',
        'personal-info': 'Informasi Pribadi',
        'full-name': 'Nama Lengkap',
        'birth-place': 'Tempat Lahir',
        'birth-date': 'Tanggal Lahir',
        'address-info': 'Informasi Alamat',
        'full-address': 'Alamat Lengkap',
        'city': 'Kota',
        'postal-code': 'Kode Pos',
        'church-info': 'Informasi Gereja',
        'group-ministry': 'Group/Ministry',
        'join-date': 'Tanggal Bergabung',
        'cancel': 'Batal',
        'save': 'Simpan',
        'add-family': 'Tambah Keluarga',
        'family-name': 'Nama Keluarga',
        'head-family': 'Kepala Keluarga',
        'address': 'Alamat',
        'family-members': 'Anggota Keluarga',
        'group-name': 'Nama Group',
        'leader': 'Leader',
        'meeting-schedule': 'Jadwal Pertemuan',
        'show-phone-to-members': 'Tampilkan nomor telepon leader ke anggota',
        'add': 'Tambah',
        'select-member': 'Pilih Member',
        'current-members': 'Anggota Saat Ini',
        'close': 'Tutup',
        'event-name': 'Nama Event',
        'event-type': 'Tipe Event',
        'worship': 'Ibadah',
        'seminar': 'Seminar',
        'retreat': 'Retret',
        'social-activity': 'Kegiatan Sosial',
        'other': 'Lainnya',
        'custom-type': 'Tipe Lainnya',
        'start-date': 'Tanggal Mulai',
        'end-date': 'Tanggal Selesai',
        'location': 'Lokasi',
        'capacity': 'Kapasitas',
        'event-status': 'Status Event',
        'event-participants': 'Daftar Peserta Event',
        'search-participants': 'Cari peserta...',
        'add-participant': 'Tambah Peserta',
        'registration-date': 'Tanggal Daftar',
        'add-manual-participant': 'Tambah Peserta Manual',
        'select-donor': 'Pilih Donatur',
        'donation-type': 'Tipe Donasi',
        'volunteer-source': 'Sumber Relawan',
        'from-member': 'Dari Data Jemaat',
        'external': 'Luar Gereja (Manual)',
        'service-area': 'Area Pelayanan',
        'sunday-school-teacher': 'Guru Sekolah Minggu',
        'singer': 'Singer',
        'worship-leader': 'Worship Leader',
        'musician': 'Pemain Musik',
        'dancer': 'Penari',
        'collection': 'Kolektan/Perpuluhan',
        'intercession': 'Doa Syafaat',
        'speaker': 'Pembicara',
        'multimedia': 'Multimedia',
        'lighting-sound': 'Lighting & Sound System',
        'usher': 'Usher',
        'available-schedule': 'Jadwal Tersedia',
        'sunday-morning': 'Minggu Pagi',
        'sunday-evening': 'Minggu Sore',
        'saturday': 'Sabtu',
        'weekday': 'Hari Kerja',
        'volunteer': 'Relawan',
        'select-volunteer': 'Pilih Relawan',
        'assignment-date': 'Tanggal Penugasan',
        'assignment-time': 'Waktu',
        'notes': 'Catatan',
        'title': 'Judul',
        'content': 'Konten',
        'show-until': 'Tampilkan Sampai',
        'mark-important': 'Penting (tandai sebagai penting)',
        'publish': 'Publikasikan',
        'admin': 'Admin',
        'superadmin': 'Super Admin',
        'user-view-only': 'User (View Only)',
        'user-role-info': 'User hanya dapat melihat data tanpa bisa mengedit',
        'confirmation': 'Konfirmasi',
        'yes': 'Ya',
        'loading': 'Loading...',
        'select': 'Pilih',
        'none': 'Tidak ada',
        'task': 'Tugas',
        'finance': 'Keuangan',
        'manage-finance': 'Kelola keuangan gereja',
        'finance-dashboard': 'Dashboard Keuangan',
        'income': 'Pemasukan',
        'expense': 'Pengeluaran',
        'categories': 'Kategori',
        'finance-report': 'Laporan Keuangan',
        'approval': 'Approval',
        'current-balance': 'Saldo Saat Ini',
        'total-income': 'Total Pemasukan',
        'total-expense': 'Total Pengeluaran',
        'total-donors': 'Total Donatur',
        'income-expense-chart': 'Grafik Pemasukan & Pengeluaran',
        'income-by-category': 'Pemasukan per Kategori',
        'expense-by-category': 'Pengeluaran per Kategori',
        'add-income': 'Tambah Pemasukan',
        'add-expense': 'Tambah Pengeluaran',
        'add-category': 'Tambah Kategori',
        'all-categories': 'Semua Kategori',
        'category': 'Kategori',
        'category-name': 'Nama Kategori',
        'category-type': 'Tipe Kategori',
        'select-category': 'Pilih Kategori',
        'select-donor': 'Pilih Donatur',
        'daily': 'Harian',
        'monthly': 'Bulanan',
        'yearly': 'Tahunan',
        'select-date': 'Pilih Tanggal',
        'select-month': 'Pilih Bulan',
        'select-year': 'Pilih Tahun',
        'export-report': 'Export Laporan',
        'pending-approval': 'Menunggu Approval',
        'approval-history': 'Riwayat Approval',
        'approve': 'Setujui',
        'reject': 'Tolak',
        'approved': 'Disetujui',
        'rejected': 'Ditolak',
        'pending': 'Menunggu',
        'saldo-awal': 'Saldo Awal',
        'laporan-keuangan': 'Laporan Keuangan',
        'custom-category': 'Kategori Lainnya'
    },
    en: {
        'app-title': 'Church Management System',
        'app-subtitle': 'Digital Church Management System',
        'username': 'Username',
        'password': 'Password',
        'remember-me': 'Remember me',
        'forgot-password': 'Forgot password?',
        'login': 'Login',
        'default-login': 'Default: admin / admin123',
        'lang-id': 'Bahasa Indonesia',
        'lang-en': 'English',
        'cms-title': 'Church CMS',
        'dashboard': 'Dashboard',
        'members': 'Members',
        'families': 'Families',
        'groups': 'Groups / Ministry',
        'events': 'Events',
        'attendance': 'Attendance',
        'donations': 'Donations',
        'volunteers': 'Volunteers',
        'communication': 'Communication',
        'reports': 'Reports',
        'user-management': 'User Management',
        'logout': 'Logout',
        'welcome-back': 'Welcome back',
        'total-members': 'Total Members',
        'attendance-this-week': 'Attendance This Week',
        'donations-this-month': 'Donations This Month',
        'active-events': 'Active Events',
        'total-groups': 'Total Groups',
        'active-volunteers': 'Active Volunteers',
        'recent-activity': 'Recent Activity',
        'view-all': 'View All',
        'upcoming-events': 'Upcoming Events',
        'attendance-stats': 'Attendance Statistics',
        'this-week': 'This Week',
        'this-month': 'This Month',
        'this-year': 'This Year',
        'member-distribution': 'Member Distribution',
        'recent-donations': 'Recent Donations',
        'notifications': 'Notifications',
        'mark-read': 'Mark as read',
        'manage-members': 'Manage church member data',
        'search-members': 'Search members...',
        'all-status': 'All Status',
        'active': 'Active',
        'inactive': 'Inactive',
        'all-gender': 'All Gender',
        'male': 'Male',
        'female': 'Female',
        'export': 'Export',
        'add-member': 'Add Member',
        'photo': 'Photo',
        'name': 'Name',
        'email': 'Email',
        'phone': 'Phone',
        'gender': 'Gender',
        'status': 'Status',
        'group': 'Group',
        'action': 'Action',
        'manage-families': 'Manage family data',
        'search-families': 'Search families...',
        'add-family': 'Add Family',
        'manage-groups': 'Manage groups and ministry',
        'search-groups': 'Search groups...',
        'add-group': 'Add Group',
        'manage-events': 'Manage church events and activities',
        'search-events': 'Search events...',
        'add-event': 'Add Event',
        'upcoming': 'Upcoming',
        'ongoing': 'Ongoing',
        'completed': 'Completed',
        'attendance-system': 'Check-in system and attendance data',
        'checkin': 'Check-in',
        'attendance-data': 'Attendance Data',
        'report': 'Report',
        'checkin-attendance': 'Check-in Attendance',
        'select-event': 'Select Event',
        'search-member': 'Search Member',
        'today-attendance': 'Today\'s Attendance',
        'all-events': 'All Events',
        'date': 'Date',
        'event': 'Event',
        'checkin-time': 'Check-in Time',
        'total-attendance': 'Total Attendance',
        'average': 'Average',
        'top-event': 'Top Event',
        'manage-donations': 'Manage church donations and finances',
        'total-donations': 'Total Donations',
        'total-donors': 'Total Donors',
        'average-donation': 'Average Donation',
        'all-types': 'All Types',
        'tithe': 'Tithe',
        'offering': 'Offering',
        'building': 'Building',
        'social': 'Social',
        'add-donation': 'Add Donation',
        'donor': 'Donor',
        'type': 'Type',
        'description': 'Description',
        'amount': 'Amount',
        'manage-volunteers': 'Manage volunteers and service schedule',
        'volunteer-list': 'Volunteer List',
        'service-schedule': 'Service Schedule',
        'assignments': 'Assignments',
        'search-volunteers': 'Search volunteers...',
        'add-volunteer': 'Add Volunteer',
        'add-assignment': 'Add Assignment',
        'communication-system': 'Communication and broadcast system',
        'email-broadcast': 'Email Broadcast',
        'send-message': 'Send Message',
        'announcements-tab': 'Announcements',
        'recipients': 'Recipients',
        'all-members': 'All Members',
        'active-members': 'Active Members',
        'by-groups': 'By Groups',
        'custom': 'Custom',
        'subject': 'Subject',
        'message': 'Message',
        'save-draft': 'Save Draft',
        'send-broadcast': 'Send Broadcast',
        'contacts': 'Contacts',
        'search-contacts': 'Search contacts...',
        'select-contact': 'Select a contact to start conversation',
        'type-message': 'Type a message...',
        'create-announcement': 'Create Announcement',
        'reports-system': 'Reports and system statistics',
        'members-report': 'Members Report',
        'members-stats': 'Member statistics and data',
        'attendance-report': 'Attendance Report',
        'attendance-data-report': 'Event attendance data',
        'donations-report': 'Donations Report',
        'donations-summary': 'Donations and finance summary',
        'system-stats': 'System Statistics',
        'system-overview': 'Overall system overview',
        'save-as': 'Save As',
        'print': 'Print',
        'manage-users': 'Manage users and system access',
        'search-users': 'Search users...',
        'add-user': 'Add User',
        'add-new-member': 'Add New Member',
        'personal-info': 'Personal Information',
        'full-name': 'Full Name',
        'birth-place': 'Birth Place',
        'birth-date': 'Birth Date',
        'address-info': 'Address Information',
        'full-address': 'Full Address',
        'city': 'City',
        'postal-code': 'Postal Code',
        'church-info': 'Church Information',
        'group-ministry': 'Group/Ministry',
        'join-date': 'Join Date',
        'cancel': 'Cancel',
        'save': 'Save',
        'add-family': 'Add Family',
        'family-name': 'Family Name',
        'head-family': 'Head of Family',
        'address': 'Address',
        'family-members': 'Family Members',
        'group-name': 'Group Name',
        'leader': 'Leader',
        'meeting-schedule': 'Meeting Schedule',
        'show-phone-to-members': 'Show leader phone number to members',
        'add': 'Add',
        'select-member': 'Select Member',
        'current-members': 'Current Members',
        'close': 'Close',
        'event-name': 'Event Name',
        'event-type': 'Event Type',
        'worship': 'Worship',
        'seminar': 'Seminar',
        'retreat': 'Retreat',
        'social-activity': 'Social Activity',
        'other': 'Other',
        'custom-type': 'Custom Type',
        'start-date': 'Start Date',
        'end-date': 'End Date',
        'location': 'Location',
        'capacity': 'Capacity',
        'event-status': 'Event Status',
        'event-participants': 'Event Participants',
        'search-participants': 'Search participants...',
        'add-participant': 'Add Participant',
        'registration-date': 'Registration Date',
        'add-manual-participant': 'Add Manual Participant',
        'select-donor': 'Select Donor',
        'donation-type': 'Donation Type',
        'volunteer-source': 'Volunteer Source',
        'from-member': 'From Member Data',
        'external': 'External (Manual)',
        'service-area': 'Service Area',
        'sunday-school-teacher': 'Sunday School Teacher',
        'singer': 'Singer',
        'worship-leader': 'Worship Leader',
        'musician': 'Musician',
        'dancer': 'Dancer',
        'collection': 'Collection/Tithe',
        'intercession': 'Intercession',
        'speaker': 'Speaker',
        'multimedia': 'Multimedia',
        'lighting-sound': 'Lighting & Sound System',
        'usher': 'Usher',
        'available-schedule': 'Available Schedule',
        'sunday-morning': 'Sunday Morning',
        'sunday-evening': 'Sunday Evening',
        'saturday': 'Saturday',
        'weekday': 'Weekday',
        'volunteer': 'Volunteer',
        'select-volunteer': 'Select Volunteer',
        'assignment-date': 'Assignment Date',
        'assignment-time': 'Time',
        'notes': 'Notes',
        'title': 'Title',
        'content': 'Content',
        'show-until': 'Show Until',
        'mark-important': 'Important (mark as important)',
        'publish': 'Publish',
        'admin': 'Admin',
        'superadmin': 'Super Admin',
        'user-view-only': 'User (View Only)',
        'user-role-info': 'User can only view data without editing',
        'confirmation': 'Confirmation',
        'yes': 'Yes',
        'loading': 'Loading...',
        'select': 'Select',
        'none': 'None',
        'task': 'Task',
        'finance': 'Finance',
        'manage-finance': 'Manage church finances',
        'finance-dashboard': 'Finance Dashboard',
        'income': 'Income',
        'expense': 'Expense',
        'categories': 'Categories',
        'finance-report': 'Finance Report',
        'approval': 'Approval',
        'current-balance': 'Current Balance',
        'total-income': 'Total Income',
        'total-expense': 'Total Expense',
        'total-donors': 'Total Donors',
        'income-expense-chart': 'Income & Expense Chart',
        'income-by-category': 'Income by Category',
        'expense-by-category': 'Expense by Category',
        'add-income': 'Add Income',
        'add-expense': 'Add Expense',
        'add-category': 'Add Category',
        'all-categories': 'All Categories',
        'category': 'Category',
        'category-name': 'Category Name',
        'category-type': 'Category Type',
        'select-category': 'Select Category',
        'select-donor': 'Select Donor',
        'daily': 'Daily',
        'monthly': 'Monthly',
        'yearly': 'Yearly',
        'select-date': 'Select Date',
        'select-month': 'Select Month',
        'select-year': 'Select Year',
        'export-report': 'Export Report',
        'pending-approval': 'Pending Approval',
        'approval-history': 'Approval History',
        'approve': 'Approve',
        'reject': 'Reject',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'pending': 'Pending',
        'saldo-awal': 'Opening Balance',
        'laporan-keuangan': 'Financial Report',
        'custom-category': 'Custom Category'
    }
};

let currentLanguage = localStorage.getItem('cmsLanguage') || 'id';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('cmsLanguage', lang);
    applyLanguage();
    
    // Update active state on language buttons
    document.querySelectorAll('.lang-btn, .lang-btn-small').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(lang.toUpperCase()) || 
            (lang === 'id' && btn.textContent.includes('Indonesia')) ||
            (lang === 'en' && btn.textContent.includes('English'))) {
            btn.classList.add('active');
        }
    });
}

function applyLanguage() {
    const texts = translations[currentLanguage];
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (texts[key]) {
            // Preserve any child elements (like icons)
            const icon = el.querySelector('i');
            if (icon) {
                el.innerHTML = '';
                el.appendChild(icon);
                el.appendChild(document.createTextNode(' ' + texts[key]));
            } else {
                el.textContent = texts[key];
            }
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        if (texts[key]) {
            el.placeholder = texts[key];
        }
    });
}

function getLang(key) {
    return translations[currentLanguage][key] || key;
}

// ========================================
// DATA STORAGE & INITIALIZATION
// ========================================

const defaultData = {
    users: [
        { id: 1, nama: 'Administrator', username: 'admin', email: 'admin@gereja.com', password: 'admin123', role: 'superadmin', avatar: null, status: 'aktif', lastLogin: new Date().toISOString() },
        { id: 2, nama: 'User View', username: 'userview', email: 'user@gereja.com', password: 'user123', role: 'user', avatar: null, status: 'aktif', lastLogin: null }
    ],
    churchProfile: {
        nama: 'Gereja Kristen Indonesia',
        alamat: 'Jl. Gereja No. 123',
        kota: 'Jakarta',
        telepon: '021-12345678',
        email: 'info@gereja.com',
        website: 'www.gereja.com'
    },
    members: [
        { id: 1, nama: 'Budi Santoso', email: 'budi@email.com', telepon: '081234567890', jk: 'Laki-laki', tempatLahir: 'Jakarta', tglLahir: '1985-03-15', alamat: 'Jl. Mawar No. 1', kota: 'Jakarta', kodepos: '12345', status: 'aktif', groupId: 1, joinDate: '2020-01-15', avatar: null },
        { id: 2, nama: 'Siti Aminah', email: 'siti@email.com', telepon: '081234567891', jk: 'Perempuan', tempatLahir: 'Bandung', tglLahir: '1988-07-20', alamat: 'Jl. Melati No. 5', kota: 'Jakarta', kodepos: '12345', status: 'aktif', groupId: 2, joinDate: '2019-06-10', avatar: null },
        { id: 3, nama: 'Ahmad Hidayat', email: 'ahmad@email.com', telepon: '081234567892', jk: 'Laki-laki', tempatLahir: 'Surabaya', tglLahir: '1982-11-05', alamat: 'Jl. Anggrek No. 10', kota: 'Jakarta', kodepos: '12345', status: 'aktif', groupId: 1, joinDate: '2021-03-22', avatar: null },
        { id: 4, nama: 'Dewi Kusuma', email: 'dewi@email.com', telepon: '081234567893', jk: 'Perempuan', tempatLahir: 'Yogyakarta', tglLahir: '1990-01-30', alamat: 'Jl. Kenanga No. 8', kota: 'Jakarta', kodepos: '12345', status: 'aktif', groupId: null, joinDate: '2022-08-15', avatar: null },
        { id: 5, nama: 'Eko Prasetyo', email: 'eko@email.com', telepon: '081234567894', jk: 'Laki-laki', tempatLahir: 'Semarang', tglLahir: '1978-09-12', alamat: 'Jl. Cempaka No. 15', kota: 'Jakarta', kodepos: '12345', status: 'aktif', groupId: 3, joinDate: '2018-12-01', avatar: null }
    ],
    families: [
        { id: 1, nama: 'Keluarga Budi Santoso', kepalaId: 1, anggota: [1, 2], alamat: 'Jl. Mawar No. 1', kota: 'Jakarta' },
        { id: 2, nama: 'Keluarga Ahmad Hidayat', kepalaId: 3, anggota: [3, 4], alamat: 'Jl. Anggrek No. 10', kota: 'Jakarta' }
    ],
    groups: [
        { id: 1, nama: 'Youth Ministry', deskripsi: 'Pelayanan pemuda gereja', leaderId: 1, jadwal: 'Setiap Jumat, 19:00 WIB', anggota: [1, 3], createdAt: '2020-01-01', showPhone: true },
        { id: 2, nama: 'Worship Team', deskripsi: 'Tim pujian dan penyembahan', leaderId: 2, jadwal: 'Setiap Sabtu, 16:00 WIB', anggota: [2], createdAt: '2019-06-01', showPhone: true },
        { id: 3, nama: 'Prayer Team', deskripsi: 'Tim doa gereja', leaderId: 5, jadwal: 'Setiap Selasa, 18:00 WIB', anggota: [5], createdAt: '2018-12-01', showPhone: false }
    ],
    events: [
        { id: 1, nama: 'Ibadah Minggu Pagi', tipe: 'ibadah', customType: null, start: '2024-01-21T07:00', end: '2024-01-21T09:00', lokasi: 'Gedung Utama Gereja', deskripsi: 'Ibadah rutin minggu pagi', kapasitas: 200, status: 'upcoming', participants: [] },
        { id: 2, nama: 'Youth Fellowship', tipe: 'sosial', customType: null, start: '2024-01-26T19:00', end: '2024-01-26T21:00', lokasi: 'Ruang Youth', deskripsi: 'Persekutuan pemuda', kapasitas: 50, status: 'upcoming', participants: [] },
        { id: 3, nama: 'Seminar Pernikahan', tipe: 'seminar', customType: null, start: '2024-02-10T09:00', end: '2024-02-10T16:00', lokasi: 'Aula Gereja', deskripsi: 'Seminar untuk pasangan yang akan menikah', kapasitas: 30, status: 'upcoming', participants: [] }
    ],
    attendance: [
        { id: 1, eventId: 1, memberId: 1, tanggal: '2024-01-14', waktu: '07:15', status: 'hadir' },
        { id: 2, eventId: 1, memberId: 2, tanggal: '2024-01-14', waktu: '07:20', status: 'hadir' },
        { id: 3, eventId: 1, memberId: 3, tanggal: '2024-01-14', waktu: '07:30', status: 'hadir' }
    ],
    donations: [
        { id: 1, donorId: 1, tipe: 'perpuluhan', jumlah: 500000, tanggal: '2024-01-15', keterangan: 'Perpuluhan Januari' },
        { id: 2, donorId: 2, tipe: 'persembahan', jumlah: 250000, tanggal: '2024-01-15', keterangan: 'Persembahan Minggu' },
        { id: 3, donorId: 3, tipe: 'pembangunan', jumlah: 1000000, tanggal: '2024-01-10', keterangan: 'Donasi pembangunan' }
    ],
    volunteers: [
        { id: 1, memberId: 1, externalNama: null, externalEmail: null, externalTelepon: null, area: 'usher', jadwal: ['minggu-pagi', 'minggu-sore'], status: 'aktif' },
        { id: 2, memberId: 2, externalNama: null, externalEmail: null, externalTelepon: null, area: 'worship-leader', jadwal: ['minggu-pagi'], status: 'aktif' },
        { id: 3, memberId: null, externalNama: 'John Doe', externalEmail: 'john@email.com', externalTelepon: '081234567895', area: 'singer', jadwal: ['minggu-pagi', 'minggu-sore'], status: 'aktif' }
    ],
    assignments: [
        { id: 1, volunteerId: 1, eventId: 1, tanggal: '2024-01-21', waktu: '06:30', tempat: 'Gedung Utama Gereja', tugas: 'Menerima tamu di pintu masuk', catatan: '', status: 'assigned' },
        { id: 2, volunteerId: 2, eventId: 1, tanggal: '2024-01-21', waktu: '06:00', tempat: 'Ruang Worship', tugas: 'Lead worship', catatan: '', status: 'assigned' }
    ],
    announcements: [
        { id: 1, judul: 'Jadwal Ibadah Natal', konten: 'Ibadah Natal akan dilaksanakan pada tanggal 24 Desember 2024 pukul 18:00 WIB.', tanggal: '2024-12-20', expiry: '2024-12-25', important: true, authorId: 1 },
        { id: 2, judul: 'Perubahan Jadwal Youth', konten: 'Youth Fellowship pindah ke hari Sabtu jam 17:00 WIB.', tanggal: '2024-01-15', expiry: '2024-02-15', important: false, authorId: 1 }
    ],
    messages: [
        { id: 1, senderId: 1, receiverId: 2, content: 'Halo Siti, apakah besok bisa latihan worship?', timestamp: '2024-01-15T10:00:00', read: true },
        { id: 2, senderId: 2, receiverId: 1, content: 'Bisa Pak Budi, jam berapa?', timestamp: '2024-01-15T10:05:00', read: false }
    ],
    activities: [
        { id: 1, type: 'member', action: 'Member baru ditambahkan', detail: 'Eko Prasetyo', timestamp: '2024-01-15T09:00:00' },
        { id: 2, type: 'donation', action: 'Donasi diterima', detail: 'Rp 500.000 dari Budi Santoso', timestamp: '2024-01-15T08:30:00' },
        { id: 3, type: 'event', action: 'Event dibuat', detail: 'Seminar Pernikahan', timestamp: '2024-01-14T16:00:00' },
        { id: 4, type: 'attendance', action: 'Check-in', detail: 'Budi Santoso - Ibadah Minggu', timestamp: '2024-01-14T07:15:00' }
    ],
    notifications: [
        { id: 1, title: 'Event Mendatang', message: 'Youth Fellowship besok jam 19:00', type: 'event', read: false, timestamp: '2024-01-15T10:00:00' },
        { id: 2, title: 'Donasi Baru', message: 'Rp 1.000.000 dari Ahmad Hidayat', type: 'donation', read: false, timestamp: '2024-01-15T09:00:00' },
        { id: 3, title: 'Member Baru', message: 'Dewi Kusuma bergabung', type: 'member', read: false, timestamp: '2024-01-14T14:00:00' }
    ],
    // Finance Data
    finance: {
        saldoAwal: 5000000,
        saldoAkhir: 0
    },
    financeCategories: [
        { id: 1, nama: 'Persembahan', tipe: 'pemasukan', deskripsi: 'Persembahan jemaat' },
        { id: 2, nama: 'Perpuluhan', tipe: 'pemasukan', deskripsi: 'Perpuluhan jemaat' },
        { id: 3, nama: 'Donasi', tipe: 'pemasukan', deskripsi: 'Donasi dari jemaat' },
        { id: 4, nama: 'Lainnya (Pemasukan)', tipe: 'pemasukan', deskripsi: 'Pemasukan lainnya' },
        { id: 5, nama: 'Operasional', tipe: 'pengeluaran', deskripsi: 'Biaya operasional gereja' },
        { id: 6, nama: 'Kegiatan', tipe: 'pengeluaran', deskripsi: 'Biaya kegiatan gereja' },
        { id: 7, nama: 'Sosial', tipe: 'pengeluaran', deskripsi: 'Biaya sosial/misi' },
        { id: 8, nama: 'Lainnya (Pengeluaran)', tipe: 'pengeluaran', deskripsi: 'Pengeluaran lainnya' }
    ],
    pemasukan: [
        { id: 1, kategoriId: 1, jumlah: 2500000, tanggal: '2024-01-15', keterangan: 'Persembahan Minggu', donaturId: 1, status: 'approved', approvedBy: 1, approvedAt: '2024-01-15T10:00:00' },
        { id: 2, kategoriId: 2, jumlah: 1500000, tanggal: '2024-01-15', keterangan: 'Perpuluhan Januari', donaturId: 2, status: 'approved', approvedBy: 1, approvedAt: '2024-01-15T10:05:00' },
        { id: 3, kategoriId: 3, jumlah: 1000000, tanggal: '2024-01-10', keterangan: 'Donasi pembangunan', donaturId: 3, status: 'approved', approvedBy: 1, approvedAt: '2024-01-10T09:00:00' }
    ],
    pengeluaran: [
        { id: 1, kategoriId: 5, jumlah: 500000, tanggal: '2024-01-16', keterangan: 'Beli ATK', status: 'approved', approvedBy: 1, approvedAt: '2024-01-16T14:00:00' },
        { id: 2, kategoriId: 6, jumlah: 1200000, tanggal: '2024-01-14', keterangan: 'Biaya Youth Fellowship', status: 'approved', approvedBy: 1, approvedAt: '2024-01-14T16:00:00' },
        { id: 3, kategoriId: 7, jumlah: 800000, tanggal: '2024-01-12', keterangan: 'Bantuan sosial warga', status: 'approved', approvedBy: 1, approvedAt: '2024-01-12T10:00:00' }
    ],
    approvalHistory: [
        { id: 1, tipe: 'pemasukan', itemId: 1, action: 'approved', by: 1, timestamp: '2024-01-15T10:00:00' },
        { id: 2, tipe: 'pengeluaran', itemId: 1, action: 'approved', by: 1, timestamp: '2024-01-16T14:00:00' }
    ],
    donatur: [
        { id: 1, nama: 'Budi Santoso', email: 'budi@email.com', telepon: '081234567890', totalDonasi: 2500000, terakhirDonasi: '2024-01-15' },
        { id: 2, nama: 'Siti Aminah', email: 'siti@email.com', telepon: '081234567891', totalDonasi: 1500000, terakhirDonasi: '2024-01-15' },
        { id: 3, nama: 'Ahmad Hidayat', email: 'ahmad@email.com', telepon: '081234567892', totalDonasi: 1000000, terakhirDonasi: '2024-01-10' }
    ]
};

// Initialize data
function initData() {
    // Force reset untuk v5 - hapus data lama
    const v5Initialized = localStorage.getItem('cmsV5Initialized');
    if (!v5Initialized) {
        localStorage.removeItem('cmsV2Data');
        localStorage.removeItem('cmsV3Initialized');
        localStorage.setItem('cmsV5Initialized', 'true');
    }
    
    const stored = localStorage.getItem('cmsV2Data');
    if (!stored) {
        localStorage.setItem('cmsV2Data', JSON.stringify(defaultData));
    } else {
        // Merge dengan default users untuk memastikan user default selalu ada
        const existing = JSON.parse(stored);
        let updated = false;
        
        defaultData.users.forEach(defaultUser => {
            const exists = existing.users.find(u => u.username === defaultUser.username);
            if (!exists) {
                existing.users.push(defaultUser);
                updated = true;
            }
        });
        
        // Ensure groups have showPhone property
        if (existing.groups) {
            existing.groups.forEach(g => {
                if (g.showPhone === undefined) {
                    g.showPhone = true;
                    updated = true;
                }
            });
        }
        
        // Ensure events have status property
        if (existing.events) {
            existing.events.forEach(e => {
                if (!e.status) {
                    e.status = 'upcoming';
                    updated = true;
                }
            });
        }
        
        // Ensure volunteers have external data properties
        if (existing.volunteers) {
            existing.volunteers.forEach(v => {
                if (v.externalNama === undefined) {
                    v.externalNama = null;
                    v.externalEmail = null;
                    v.externalTelepon = null;
                    updated = true;
                }
            });
        }
        
        // Ensure assignments have new properties
        if (existing.assignments) {
            existing.assignments.forEach(a => {
                if (!a.tanggal) {
                    a.tanggal = new Date().toISOString().split('T')[0];
                    a.waktu = '08:00';
                    a.tempat = 'Gedung Utama';
                    updated = true;
                }
            });
        }
        
        // Ensure Finance data exists
        if (!existing.finance) {
            existing.finance = { saldoAwal: 5000000, saldoAkhir: 0 };
            updated = true;
        }
        if (!existing.financeCategories) {
            existing.financeCategories = defaultData.financeCategories;
            updated = true;
        }
        if (!existing.pemasukan) {
            existing.pemasukan = defaultData.pemasukan;
            updated = true;
        }
        if (!existing.pengeluaran) {
            existing.pengeluaran = defaultData.pengeluaran;
            updated = true;
        }
        if (!existing.approvalHistory) {
            existing.approvalHistory = defaultData.approvalHistory;
            updated = true;
        }
        if (!existing.donatur) {
            existing.donatur = defaultData.donatur;
            updated = true;
        }
        
        if (updated) {
            localStorage.setItem('cmsV2Data', JSON.stringify(existing));
        }
    }
    return JSON.parse(localStorage.getItem('cmsV2Data'));
}

// ========================================
// FIREBASE DATA CACHE
// ========================================

let dataCache = null;
let dataListeners = [];

// Initialize data cache from Firestore
async function initDataCache() {
    console.log('[APP] initDataCache START');
    
    // Wait for Firebase to initialize
    let attempts = 0;
    while (!isFirebaseReady() && attempts < 10) {
        console.log(`[APP] Waiting for Firebase... attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
    }
    
    if (!isFirebaseReady()) {
        console.log('[APP] Firebase not ready after waiting, using localStorage fallback');
        showToast('Mode offline aktif - data tersimpan lokal', 'warning');
        return initDataLocal();
    }
    
    console.log('[APP] Firebase ready, initializing...');
    showLoading(true);
    
    try {
        // Initialize default data in Firestore if needed
        console.log('[APP] Initializing Firestore data...');
        await window.initializeFirestoreData();
        
        // Migrate from localStorage if exists
        console.log('[APP] Checking localStorage migration...');
        await window.migrateFromLocalStorage();
        
        // Load all data from Firestore
        console.log('[APP] Loading data from Firestore...');
        dataCache = await loadAllDataFromFirestore();
        
        if (dataCache) {
            console.log('[APP] Data loaded successfully from Firestore');
            showToast('Terhubung ke database', 'success');
        } else {
            console.log('[APP] Failed to load from Firestore, using localStorage');
            dataCache = initDataLocal();
        }
        
        showLoading(false);
        return dataCache;
    } catch (error) {
        console.error('[APP] Error initializing data cache:', error);
        showLoading(false);
        showToast('Error koneksi - mode offline', 'error');
        // Fallback to localStorage
        return initDataLocal();
    }
}

// Load all data from Firestore
async function loadAllDataFromFirestore() {
    console.log('[APP] loadAllDataFromFirestore START');
    
    if (!isFirebaseReady()) {
        console.log('[APP] Firebase not ready, returning null');
        return null;
    }
    
    try {
        console.log('[APP] Fetching all collections...');
        
        const [
            members,
            families,
            groups,
            events,
            attendance,
            donations,
            donors,
            volunteers,
            assignments,
            users,
            announcements,
            pemasukan,
            pengeluaran,
            financeCategories,
            financeConfig,
            approvalHistory
        ] = await Promise.all([
            window.getAllDocuments(window.DB_COLLECTIONS.MEMBERS),
            window.getAllDocuments(window.DB_COLLECTIONS.FAMILIES),
            window.getAllDocuments(window.DB_COLLECTIONS.GROUPS),
            window.getAllDocuments(window.DB_COLLECTIONS.EVENTS),
            window.getAllDocuments(window.DB_COLLECTIONS.ATTENDANCE),
            window.getAllDocuments(window.DB_COLLECTIONS.DONATIONS),
            window.getAllDocuments(window.DB_COLLECTIONS.DONORS),
            window.getAllDocuments(window.DB_COLLECTIONS.VOLUNTEERS),
            window.getAllDocuments(window.DB_COLLECTIONS.ASSIGNMENTS),
            window.getAllDocuments(window.DB_COLLECTIONS.USERS),
            window.getAllDocuments(window.DB_COLLECTIONS.ANNOUNCEMENTS),
            window.getAllDocuments(window.DB_COLLECTIONS.PEMASUKAN),
            window.getAllDocuments(window.DB_COLLECTIONS.PENGELUARAN),
            window.getAllDocuments(window.DB_COLLECTIONS.FINANCE_CATEGORIES),
            window.getDocumentById(window.DB_COLLECTIONS.FINANCE_CONFIG, 'config'),
            window.getAllDocuments(window.DB_COLLECTIONS.APPROVAL_HISTORY)
        ]);
        
        console.log('[APP] All collections fetched successfully');
        
        return {
            members: members || [],
            families: families || [],
            groups: groups || [],
            events: events || [],
            attendance: attendance || [],
            donations: donations || [],
            donors: donors || [],
            volunteers: volunteers || [],
            assignments: assignments || [],
            users: users || [],
            announcements: announcements || [],
            pemasukan: pemasukan || [],
            pengeluaran: pengeluaran || [],
            financeCategories: financeCategories || [],
            finance: financeConfig || { saldoAwal: 0 },
            approvalHistory: approvalHistory || []
        };
    } catch (error) {
        console.error('[APP] Error loading data from Firestore:', error);
        return null;
    }
}

// Refresh data cache
async function refreshDataCache() {
    dataCache = await loadAllDataFromFirestore();
    return dataCache;
}

// Check if Firebase is ready
function isFirebaseReady() {
    const ready = typeof window.db !== 'undefined' && window.db !== null;
    return ready;
}

// Legacy localStorage fallback
function initDataLocal() {
    // Force reset untuk v6 - hapus data lama
    const v6Initialized = localStorage.getItem('cmsV6Initialized');
    if (!v6Initialized) {
        localStorage.removeItem('cmsV2Data');
        localStorage.removeItem('cmsV5Initialized');
        localStorage.setItem('cmsV6Initialized', 'true');
    }
    
    const stored = localStorage.getItem('cmsV2Data');
    if (!stored) {
        localStorage.setItem('cmsV2Data', JSON.stringify(defaultData));
    } else {
        // Merge dengan default users untuk memastikan user default selalu ada
        const existing = JSON.parse(stored);
        let updated = false;
        
        defaultData.users.forEach(defaultUser => {
            const exists = existing.users.find(u => u.username === defaultUser.username);
            if (!exists) {
                existing.users.push(defaultUser);
                updated = true;
            }
        });
        
        if (updated) {
            localStorage.setItem('cmsV2Data', JSON.stringify(existing));
        }
    }
    dataCache = JSON.parse(localStorage.getItem('cmsV2Data'));
    return dataCache;
}

// Save data to Firestore or localStorage
async function saveData(data) {
    // Update cache
    dataCache = data;
    
    if (isFirebaseReady()) {
        // Firestore saves are handled per-collection in specific functions
        return true;
    }
    
    // Fallback to localStorage
    try {
        localStorage.setItem('cmsV2Data', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        showToast(currentLanguage === 'id' ? 'Gagal menyimpan data' : 'Failed to save data', 'error');
        return false;
    }
}

// Get data from cache or load from Firestore
function getData() {
    if (dataCache) {
        return dataCache;
    }
    
    // Fallback to localStorage
    try {
        const data = localStorage.getItem('cmsV2Data');
        return data ? JSON.parse(data) : defaultData;
    } catch (e) {
        console.error('Error loading data:', e);
        return defaultData;
    }
}

// Show/hide loading overlay
function showLoading(show) {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }
}

// Backup data to file
function backupData() {
    const data = getData();
    if (!data) {
        showToast(currentLanguage === 'id' ? 'Tidak ada data untuk backup' : 'No data to backup', 'warning');
        return;
    }
    
    const backup = {
        version: 'v5',
        timestamp: new Date().toISOString(),
        data: data
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cms-gereja-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast(currentLanguage === 'id' ? 'Backup berhasil diunduh' : 'Backup downloaded successfully', 'success');
}

// Restore data from file
function restoreData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            if (!backup.data) {
                showToast(currentLanguage === 'id' ? 'File backup tidak valid' : 'Invalid backup file', 'error');
                return;
            }
            
            showConfirm(
                currentLanguage === 'id' 
                    ? 'Data saat ini akan diganti dengan data backup. Lanjutkan?' 
                    : 'Current data will be replaced with backup data. Continue?',
                () => {
                    saveData(backup.data);
                    showToast(currentLanguage === 'id' ? 'Data berhasil direstore' : 'Data restored successfully', 'success');
                    location.reload();
                }
            );
        } catch (err) {
            showToast(currentLanguage === 'id' ? 'Gagal membaca file backup' : 'Failed to read backup file', 'error');
        }
    };
    reader.readAsText(file);
}

// Clear all data
function clearAllData() {
    showConfirm(
        currentLanguage === 'id' 
            ? 'PERINGATAN: Semua data akan dihapus permanen! Lanjutkan?' 
            : 'WARNING: All data will be permanently deleted! Continue?',
        () => {
            localStorage.removeItem('cmsV2Data');
            localStorage.removeItem('cmsV5Initialized');
            showToast(currentLanguage === 'id' ? 'Semua data telah dihapus' : 'All data has been deleted', 'success');
            location.reload();
        }
    );
}

let currentUser = null;
let currentChatId = null;
let attendanceChart = null;
let memberChart = null;
let currentGroupId = null;
let currentEventId = null;
let currentVolunteerIdForAssignment = null;
let editingMemberId = null;
let editingFamilyId = null;
let editingGroupId = null;
let editingEventId = null;
let editingDonationId = null;
let editingVolunteerId = null;
let editingUserId = null;
let editingAssignmentId = null;

// ========================================
// PERMISSION HELPERS
// ========================================

function isViewOnly() {
    return currentUser && currentUser.role === 'user';
}

function canEdit() {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');
}

function canDelete() {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');
}

function canAdd() {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');
}

function isSuperAdmin() {
    return currentUser && currentUser.role === 'superadmin';
}

function canManageUsers() {
    return currentUser && currentUser.role === 'superadmin';
}

function canApprove() {
    return currentUser && currentUser.role === 'superadmin';
}

// ========================================
// AUTHENTICATION
// ========================================

async function login(username, password) {
    // Try Firebase login first
    if (isFirebaseReady()) {
        const user = await window.loginWithFirebase(username, password);
        if (user) {
            currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update last login in Firestore
            await window.updateDocument(window.DB_COLLECTIONS.USERS, user.id, {
                lastLogin: new Date().toISOString()
            });
            
            // Refresh data cache after login
            await refreshDataCache();
            
            return { success: true, user };
        }
    }
    
    // Fallback to localStorage
    const data = getData();
    const user = data.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update last login
        const index = data.users.findIndex(u => u.id === user.id);
        data.users[index].lastLogin = new Date().toISOString();
        saveData(data);
        
        return { success: true, user };
    }
    return { success: false, message: getLang(currentLanguage === 'id' ? 'Username atau password salah!' : 'Username or password is incorrect!') };
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-form').reset();
    showToast(getLang('logout-success') || 'Berhasil logout', 'success');
}

function checkSession() {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('user-name').textContent = currentUser.nama;
        document.getElementById('user-role').textContent = getRoleLabel(currentUser.role);
        document.getElementById('welcome-name').textContent = currentUser.nama;
        
        // Apply UI restrictions for view-only users
        applyViewOnlyRestrictions();
        
        initDashboard();
        
        // Load notifications
        loadNotifications();
    }
}

function applyViewOnlyRestrictions() {
    const isUser = isViewOnly();
    const isAdmin = currentUser && currentUser.role === 'admin';
    const isSuperAdmin = currentUser && currentUser.role === 'superadmin';
    
    // Hide User Management menu for regular users AND admin (only Super Admin can see)
    const userManagementMenu = document.getElementById('menu-users');
    if (userManagementMenu) {
        userManagementMenu.style.display = isSuperAdmin ? 'block' : 'none';
    }
    
    // Hide Families menu for regular users
    const familiesMenu = document.getElementById('menu-families');
    if (familiesMenu) {
        familiesMenu.style.display = isUser ? 'none' : 'block';
    }
    
    // Hide quick actions for view-only users
    const quickActions = document.getElementById('quick-actions');
    if (quickActions) {
        quickActions.style.display = isUser ? 'none' : 'flex';
    }
    
    // Hide admin-only columns in tables
    document.querySelectorAll('.admin-only-col').forEach(col => {
        col.style.display = isUser ? 'none' : '';
    });
}

function getRoleLabel(role) {
    switch(role) {
        case 'superadmin': return 'Super Admin';
        case 'admin': return 'Admin';
        case 'user': return currentLanguage === 'id' ? 'User (Hanya Lihat)' : 'User (View Only)';
        default: return role;
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Login form handler
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize data (Firebase or localStorage)
    await initDataCache();
    applyLanguage();
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const notification = document.getElementById('login-notification');
            
            notification.className = 'login-notification processing';
            notification.textContent = currentLanguage === 'id' ? 'Sedang memproses...' : 'Processing...';
            notification.style.display = 'block';
            
            const result = await login(username, password);
            
            if (result.success) {
                notification.className = 'login-notification success';
                notification.textContent = currentLanguage === 'id' ? 'Login berhasil! Mengalihkan...' : 'Login successful! Redirecting...';
                
                setTimeout(() => {
                    document.getElementById('login-page').classList.add('hidden');
                    document.getElementById('main-app').classList.remove('hidden');
                    document.getElementById('user-name').textContent = result.user.nama;
                    document.getElementById('user-role').textContent = getRoleLabel(result.user.role);
                    document.getElementById('welcome-name').textContent = result.user.nama;
                    
                    applyViewOnlyRestrictions();
                    initDashboard();
                }, 800);
            } else {
                notification.className = 'login-notification error';
                notification.textContent = result.message;
            }
        });
    }
    
    checkSession();
    
    // Load notifications
    loadNotifications();
});

// ========================================
// NAVIGATION
// ========================================

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
        li.classList.remove('active');
    });
    
    const activeNav = document.querySelector(`.sidebar-nav li[onclick*="${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');
    
    // Close sidebar on mobile
    if (window.innerWidth <= 992) {
        document.getElementById('sidebar').classList.remove('active');
    }
    
    // Initialize page
    switch(pageId) {
        case 'dashboard': initDashboard(); break;
        case 'members': renderMembersTable(); break;
        case 'families': renderFamiliesGrid(); break;
        case 'groups': renderGroupsGrid(); break;
        case 'events': renderEventsGrid(); break;
        case 'attendance': initAttendance(); break;
        case 'donations': initDonations(); break;
        case 'finance': initFinance(); break;
        case 'volunteers': initVolunteers(); break;
        case 'communication': initCommunication(); break;
        case 'reports': initReports(); break;
        case 'users': renderUsersGrid(); break;
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// ========================================
// DASHBOARD
// ========================================

function initDashboard() {
    const data = getData();
    
    // Update stats
    document.getElementById('stat-total-members').textContent = data.members.filter(m => m.status === 'aktif').length;
    document.getElementById('stat-attendance').textContent = data.attendance.length;
    
    const totalDonations = data.donations.reduce((sum, d) => sum + d.jumlah, 0);
    document.getElementById('stat-donations').textContent = formatRupiah(totalDonations);
    
    document.getElementById('stat-events').textContent = data.events.filter(e => e.status === 'upcoming').length;
    document.getElementById('stat-groups').textContent = data.groups.length;
    document.getElementById('stat-volunteers').textContent = data.volunteers.filter(v => v.status === 'aktif').length;
    
    // Update church info
    document.getElementById('church-name-sidebar').textContent = data.churchProfile.nama;
    
    // Render activities
    renderActivityList();
    
    // Render upcoming events
    renderUpcomingEvents();
    
    // Render recent donations
    renderRecentDonations();
    
    // Initialize charts
    initCharts();
    
    // Render notifications
    renderNotifications();
}

function renderActivityList() {
    const data = getData();
    const container = document.getElementById('activity-list');
    const activities = [...data.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);
    
    const icons = {
        member: 'fa-user',
        donation: 'fa-hand-holding-heart',
        event: 'fa-calendar',
        attendance: 'fa-clipboard-check'
    };
    
    container.innerHTML = activities.map(a => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${icons[a.type]}"></i>
            </div>
            <div class="activity-content">
                <p><strong>${a.action}</strong></p>
                <span>${a.detail} • ${timeAgo(a.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

function renderUpcomingEvents() {
    const data = getData();
    const container = document.getElementById('upcoming-events');
    const upcoming = data.events
        .filter(e => e.status === 'upcoming' || e.status === 'ongoing')
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 4);
    
    container.innerHTML = upcoming.map(e => {
        const date = new Date(e.start);
        return `
            <div class="event-item">
                <div class="event-date">
                    <span class="day">${date.getDate()}</span>
                    <span class="month">${date.toLocaleString(currentLanguage === 'id' ? 'id-ID' : 'en-US', { month: 'short' })}</span>
                </div>
                <div class="event-info">
                    <h4>${e.nama}</h4>
                    <p><i class="fas fa-clock"></i> ${formatTime(e.start)} • <i class="fas fa-map-marker-alt"></i> ${e.lokasi}</p>
                </div>
            </div>
        `;
    }).join('') || `<p class="text-center" style="padding: 20px; color: var(--text-muted);">${getLang('no-upcoming-events') || 'Tidak ada event mendatang'}</p>`;
}

function renderRecentDonations() {
    const data = getData();
    const container = document.getElementById('recent-donations');
    const recent = [...data.donations].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 4);
    
    container.innerHTML = recent.map(d => {
        const donor = data.members.find(m => m.id === d.donorId);
        return `
            <div class="donation-item">
                <div class="donor-info">
                    <div class="donor-avatar">${donor ? donor.nama.charAt(0) : '?'}</div>
                    <div>
                        <h4>${donor ? donor.nama : 'Anonymous'}</h4>
                        <p>${d.tipe}</p>
                    </div>
                </div>
                <span class="donation-amount">${formatRupiah(d.jumlah)}</span>
            </div>
        `;
    }).join('');
}

function initCharts() {
    initAttendanceChart();
    initMemberChart();
}

function initAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    
    if (attendanceChart) attendanceChart.destroy();
    
    attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: currentLanguage === 'id' ? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: currentLanguage === 'id' ? 'Kehadiran' : 'Attendance',
                data: [45, 52, 38, 48, 55, 120, 180],
                borderColor: '#ff6b00',
                backgroundColor: 'rgba(255, 107, 0, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#666' } },
                x: { grid: { display: false }, ticks: { color: '#666' } }
            }
        }
    });
}

function initMemberChart() {
    const ctx = document.getElementById('memberChart');
    if (!ctx) return;
    
    if (memberChart) memberChart.destroy();
    
    const data = getData();
    const maleCount = data.members.filter(m => m.jk === 'Laki-laki').length;
    const femaleCount = data.members.filter(m => m.jk === 'Perempuan').length;
    
    memberChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: currentLanguage === 'id' ? ['Laki-laki', 'Perempuan'] : ['Male', 'Female'],
            datasets: [{
                data: [maleCount, femaleCount],
                backgroundColor: ['#ff6b00', '#ff9800'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#b0b0b0' } } }
        }
    });
}

function updateAttendanceChart() {
    initAttendanceChart();
}

// ========================================
// ATTENDANCE
// ========================================

function initAttendance() {
    const data = getData();
    
    // Populate event select
    const eventSelect = document.getElementById('attendance-event');
    if (eventSelect) {
        eventSelect.innerHTML = `<option value="">${getLang('select-event')}</option>` +
            data.events.filter(e => e.status === 'upcoming' || e.status === 'ongoing')
                .map(e => `<option value="${e.id}">${e.nama} - ${formatDate(e.start)}</option>`).join('');
    }
    
    // Populate filter event select
    const filterEventSelect = document.getElementById('attendance-filter-event');
    if (filterEventSelect) {
        filterEventSelect.innerHTML = `<option value="">${getLang('all-events')}</option>` +
            data.events.map(e => `<option value="${e.id}">${e.nama}</option>`).join('');
    }
    
    renderTodayCheckin();
    renderAttendanceTable();
    initAttendanceReportChart();
    
    // Hide check-in form for view-only users
    const checkinForm = document.querySelector('.checkin-form');
    if (checkinForm && isViewOnly()) {
        checkinForm.style.display = 'none';
    }
}

function showAttendanceTab(tab, clickedBtn) {
    document.querySelectorAll('.attendance-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.attendance-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`attendance-${tab}`).classList.add('active');
    
    // Find the clicked button and add active class
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    } else {
        // Fallback: find button by onclick attribute
        const buttons = document.querySelectorAll('.attendance-tabs .tab-btn');
        buttons.forEach(btn => {
            if (btn.getAttribute('onclick').includes(`'${tab}'`)) {
                btn.classList.add('active');
            }
        });
    }
}

function renderTodayCheckin() {
    const data = getData();
    const container = document.getElementById('today-checkin');
    if (!container) return;
    
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = data.attendance.filter(a => a.tanggal === today);
    
    container.innerHTML = todayAttendance.map(a => {
        const member = data.members.find(m => m.id === a.memberId);
        return `
            <div class="checkin-item">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member ? member.nama : '?')}&background=ff6b00&color=fff&size=40" alt="">
                <div class="checkin-item-info">
                    <h4>${member ? member.nama : 'Unknown'}</h4>
                    <p>${a.status}</p>
                </div>
                <span class="checkin-item-time">${a.waktu}</span>
            </div>
        `;
    }).join('') || `<p class="text-center" style="padding: 20px; color: var(--text-muted);">${currentLanguage === 'id' ? 'Belum ada check-in hari ini' : 'No check-ins today'}</p>`;
}

function renderAttendanceTable() {
    const data = getData();
    const container = document.getElementById('attendance-table-body');
    if (!container) return;
    
    const eventFilter = document.getElementById('attendance-filter-event')?.value || '';
    const dateFilter = document.getElementById('attendance-filter-date')?.value || '';
    
    let filtered = [...data.attendance];
    
    if (eventFilter) {
        filtered = filtered.filter(a => a.eventId === parseInt(eventFilter));
    }
    
    if (dateFilter) {
        filtered = filtered.filter(a => a.tanggal === dateFilter);
    }
    
    const sorted = filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    container.innerHTML = sorted.map(a => {
        const member = data.members.find(m => m.id === a.memberId);
        const event = data.events.find(e => e.id === a.eventId);
        return `
            <tr>
                <td>${formatDate(a.tanggal)}</td>
                <td>${event ? event.nama : '-'}</td>
                <td>${member ? member.nama : 'Unknown'}</td>
                <td>${a.waktu}</td>
                <td><span class="badge badge-success">${a.status}</span></td>
            </tr>
        `;
    }).join('') || `<tr><td colspan="5" class="text-center">${getLang('no-data') || 'Tidak ada data'}</td></tr>`;
}

function checkInMember() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk check-in' : 'You do not have permission to check-in', 'error');
        return;
    }
    
    const eventId = document.getElementById('attendance-event').value;
    const memberName = document.getElementById('checkin-member').value;
    
    if (!eventId || !memberName) {
        showToast(currentLanguage === 'id' ? 'Pilih event dan masukkan nama member' : 'Select event and enter member name', 'error');
        return;
    }
    
    const data = getData();
    const member = data.members.find(m => m.nama.toLowerCase() === memberName.toLowerCase());
    
    if (!member) {
        showToast(currentLanguage === 'id' ? 'Member tidak ditemukan' : 'Member not found', 'error');
        return;
    }
    
    const now = new Date();
    const newAttendance = {
        id: Date.now(),
        eventId: parseInt(eventId),
        memberId: member.id,
        tanggal: now.toISOString().split('T')[0],
        waktu: now.toTimeString().slice(0, 5),
        status: 'hadir'
    };
    
    data.attendance.push(newAttendance);
    saveData(data);
    
    document.getElementById('checkin-member').value = '';
    renderTodayCheckin();
    renderAttendanceTable();
    initDashboard();
    
    showToast(`${member.nama} ${currentLanguage === 'id' ? 'berhasil check-in' : 'checked in successfully'}`, 'success');
}

function filterAttendanceData() {
    renderAttendanceTable();
}

function initAttendanceReportChart() {
    const ctx = document.getElementById('attendanceReportChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: currentLanguage === 'id' ? ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: currentLanguage === 'id' ? 'Kehadiran' : 'Attendance',
                data: [150, 165, 142, 180],
                backgroundColor: '#ff6b00',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#666' } },
                x: { grid: { display: false }, ticks: { color: '#666' } }
            }
        }
    });
}

// ========================================
// DONATIONS
// ========================================

function initDonations() {
    renderDonationsTable();
    updateDonationSummary();
    initDonationChart();
    
    // Hide add button for view-only users
    const addButton = document.querySelector('#page-donations .action-buttons .btn-primary');
    if (addButton) {
        addButton.style.display = isViewOnly() ? 'none' : 'inline-flex';
    }
}

function updateDonationSummary() {
    const data = getData();
    const typeFilter = document.getElementById('donation-type')?.value || '';
    const monthFilter = document.getElementById('donation-month')?.value || '';
    
    let filtered = data.donations.filter(d => {
        const matchType = !typeFilter || d.tipe === typeFilter;
        const matchMonth = !monthFilter || d.tanggal.startsWith(monthFilter);
        return matchType && matchMonth;
    });
    
    const total = filtered.reduce((sum, d) => sum + d.jumlah, 0);
    const uniqueDonors = new Set(filtered.map(d => d.donorId)).size;
    const average = filtered.length > 0 ? Math.round(total / filtered.length) : 0;
    
    document.getElementById('donation-total').textContent = formatRupiah(total);
    document.getElementById('donation-donors').textContent = uniqueDonors;
    document.getElementById('donation-average').textContent = formatRupiah(average);
}

function renderDonationsTable() {
    const data = getData();
    const container = document.getElementById('donations-table-body');
    if (!container) return;
    
    const typeFilter = document.getElementById('donation-type')?.value || '';
    const monthFilter = document.getElementById('donation-month')?.value || '';
    
    let filtered = data.donations.filter(d => {
        const matchType = !typeFilter || d.tipe === typeFilter || (typeFilter === 'lainnya' && d.tipe === 'lainnya');
        const matchMonth = !monthFilter || d.tanggal.startsWith(monthFilter);
        return matchType && matchMonth;
    });
    
    container.innerHTML = filtered.map(d => {
        const donor = data.members.find(m => m.id === d.donorId);
        const editButtons = isViewOnly() ? '' : `
            <button class="btn-action btn-edit" onclick="editDonation(${d.id})" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-action btn-delete" onclick="deleteDonation(${d.id})" title="Hapus"><i class="fas fa-trash"></i></button>
        `;
        
        // Display custom type if "lainnya" is selected
        const tipeDisplay = d.tipe === 'lainnya' && d.customType ? d.customType : d.tipe;
        
        return `
            <tr>
                <td>${formatDate(d.tanggal)}</td>
                <td>${donor ? donor.nama : 'Anonymous'}</td>
                <td><span class="badge badge-primary">${tipeDisplay}</span></td>
                <td>${d.keterangan || '-'}</td>
                <td>${formatRupiah(d.jumlah)}</td>
                <td>
                    <div class="table-actions">
                        ${editButtons}
                    </div>
                </td>
            </tr>
        `;
    }).join('') || `<tr><td colspan="6" class="text-center">${getLang('no-data') || 'Tidak ada data'}</td></tr>`;
}

function filterDonations() {
    renderDonationsTable();
    updateDonationSummary();
}

function showAddDonationModal() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah data' : 'You do not have permission to add data', 'error');
        return;
    }
    editingDonationId = null;
    document.getElementById('modal-donation-title').textContent = getLang('add-donation');
    document.getElementById('form-donation').reset();
    document.getElementById('donation-id').value = '';
    populateDonorSelect();
    openModal('modal-donation');
}

function editDonation(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk mengedit data' : 'You do not have permission to edit data', 'error');
        return;
    }
    
    const data = getData();
    const donation = data.donations.find(d => d.id === id);
    
    if (donation) {
        editingDonationId = id;
        document.getElementById('modal-donation-title').textContent = currentLanguage === 'id' ? 'Edit Donasi' : 'Edit Donation';
        document.getElementById('donation-id').value = donation.id;
        populateDonorSelect(donation.donorId);
        document.getElementById('donation-tipe').value = donation.tipe;
        document.getElementById('donation-jumlah').value = donation.jumlah;
        document.getElementById('donation-tanggal').value = donation.tanggal;
        document.getElementById('donation-keterangan').value = donation.keterangan || '';
        
        // Handle custom type
        if (donation.tipe === 'lainnya' && donation.customType) {
            document.getElementById('donation-custom-type-container').style.display = 'block';
            document.getElementById('donation-custom-type').value = donation.customType;
            document.getElementById('donation-custom-type').required = true;
        } else {
            document.getElementById('donation-custom-type-container').style.display = 'none';
            document.getElementById('donation-custom-type').value = '';
            document.getElementById('donation-custom-type').required = false;
        }
        
        openModal('modal-donation');
    }
}

function saveDonation(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menyimpan data' : 'You do not have permission to save data', 'error');
        return;
    }
    
    const data = getData();
    const donationTipe = document.getElementById('donation-tipe').value;
    const customType = donationTipe === 'lainnya' ? document.getElementById('donation-custom-type').value : null;
    
    // Validate custom type if "lainnya" is selected
    if (donationTipe === 'lainnya' && !customType) {
        showToast(currentLanguage === 'id' ? 'Tipe donasi lainnya wajib diisi' : 'Custom donation type is required', 'error');
        return;
    }
    
    const donationData = {
        donorId: parseInt(document.getElementById('donation-donor').value),
        tipe: donationTipe,
        customType: customType,
        jumlah: parseInt(document.getElementById('donation-jumlah').value),
        tanggal: document.getElementById('donation-tanggal').value,
        keterangan: document.getElementById('donation-keterangan').value
    };
    
    if (editingDonationId) {
        const index = data.donations.findIndex(d => d.id === editingDonationId);
        if (index !== -1) {
            data.donations[index] = { ...data.donations[index], ...donationData };
            showToast(currentLanguage === 'id' ? 'Donasi berhasil diupdate' : 'Donation updated successfully', 'success');
        }
    } else {
        const newId = Math.max(...data.donations.map(d => d.id), 0) + 1;
        data.donations.push({ id: newId, ...donationData });
        
        const donor = data.members.find(m => m.id === donationData.donorId);
        const tipeDisplay = donationTipe === 'lainnya' && customType ? customType : donationTipe;
        data.activities.unshift({
            id: Date.now(),
            type: 'donation',
            action: currentLanguage === 'id' ? 'Donasi diterima' : 'Donation received',
            detail: `${formatRupiah(donationData.jumlah)} ${currentLanguage === 'id' ? 'dari' : 'from'} ${donor ? donor.nama : 'Anonymous'} (${tipeDisplay})`,
            timestamp: new Date().toISOString()
        });
        
        showToast(currentLanguage === 'id' ? 'Donasi berhasil ditambahkan' : 'Donation added successfully', 'success');
    }
    
    saveData(data);
    closeModal('modal-donation');
    renderDonationsTable();
    initDashboard();
}

function deleteDonation(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus data' : 'You do not have permission to delete data', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus donasi ini?' : 'Are you sure you want to delete this donation?', () => {
        const data = getData();
        const index = data.donations.findIndex(d => d.id === id);
        
        if (index !== -1) {
            data.donations.splice(index, 1);
            saveData(data);
            renderDonationsTable();
            initDashboard();
            showToast(currentLanguage === 'id' ? 'Donasi berhasil dihapus' : 'Donation deleted successfully', 'success');
        }
    });
}

function populateDonorSelect(selectedId = null) {
    const data = getData();
    const select = document.getElementById('donation-donor');
    select.innerHTML = `<option value="">${getLang('select-donor')}</option>` +
        data.members.filter(m => m.status === 'aktif').map(m => 
            `<option value="${m.id}" ${m.id == selectedId ? 'selected' : ''}>${m.nama}</option>`
        ).join('');
}

function initDonationChart() {
    const ctx = document.getElementById('donationChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            datasets: [{
                label: currentLanguage === 'id' ? 'Donasi' : 'Donations',
                data: [2500000, 3200000, 2800000, 3500000, 4200000, 3800000],
                borderColor: '#ff6b00',
                backgroundColor: 'rgba(255, 107, 0, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
                    ticks: { 
                        color: '#666',
                        callback: function(value) {
                            return formatRupiah(value);
                        }
                    } 
                },
                x: { grid: { display: false }, ticks: { color: '#666' } }
            }
        }
    });
}

// ========================================
// EVENTS
// ========================================

function renderEventsGrid() {
    const data = getData();
    const container = document.getElementById('events-grid');
    if (!container) return;
    
    const searchTerm = document.getElementById('search-events')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('filter-event-status')?.value || '';
    
    let filtered = data.events.filter(e => {
        const matchSearch = e.nama.toLowerCase().includes(searchTerm);
        const matchStatus = !statusFilter || e.status === statusFilter;
        return matchSearch && matchStatus;
    });
    
    const statusLabels = {
        'upcoming': currentLanguage === 'id' ? 'Mendatang' : 'Upcoming',
        'ongoing': currentLanguage === 'id' ? 'Berlangsung' : 'Ongoing',
        'completed': currentLanguage === 'id' ? 'Selesai' : 'Completed'
    };
    
    container.innerHTML = filtered.map(e => {
        const startDate = new Date(e.start);
        const participantCount = e.participants ? e.participants.length : 0;
        const editButtons = isViewOnly() ? '' : `
            <button class="btn btn-secondary btn-sm" onclick="editEvent(${e.id})"><i class="fas fa-edit"></i> ${getLang('edit') || 'Edit'}</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEvent(${e.id})"><i class="fas fa-trash"></i> ${getLang('delete') || 'Hapus'}</button>
        `;
        
        const eventType = e.tipe === 'lainnya' && e.customType ? e.customType : e.tipe;
        
        return `
            <div class="event-card">
                <span class="event-status ${e.status}">${statusLabels[e.status] || e.status}</span>
                <div class="card-header-section">
                    <div class="card-avatar"><i class="fas fa-calendar-alt"></i></div>
                    <div class="card-title">
                        <h4>${e.nama}</h4>
                        <p>${eventType}</p>
                    </div>
                </div>
                <div class="card-info">
                    <div class="info-row"><i class="fas fa-calendar"></i> ${formatDate(e.start)}</div>
                    <div class="info-row"><i class="fas fa-clock"></i> ${formatTime(e.start)} - ${formatTime(e.end)}</div>
                    <div class="info-row"><i class="fas fa-map-marker-alt"></i> ${e.lokasi}</div>
                    <div class="info-row"><i class="fas fa-users"></i> ${participantCount} ${currentLanguage === 'id' ? 'peserta' : 'participants'}</div>
                </div>
                <div class="card-footer-actions">
                    ${editButtons}
                    <button class="btn btn-primary btn-sm" onclick="showEventParticipants(${e.id})"><i class="fas fa-users"></i> ${getLang('participants') || 'Peserta'}</button>
                </div>
            </div>
        `;
    }).join('') || `<p class="text-center" style="grid-column: 1/-1; color: var(--text-muted);">${getLang('no-data') || 'Tidak ada data'}</p>`;
    
    // Hide add button for view-only users
    const addButton = document.querySelector('#page-events .action-buttons .btn-primary');
    if (addButton) {
        addButton.style.display = isViewOnly() ? 'none' : 'inline-flex';
    }
}

function searchEvents() {
    renderEventsGrid();
}

function filterEvents() {
    renderEventsGrid();
}

function handleEventTypeChange() {
    const eventType = document.getElementById('event-tipe').value;
    const customTypeContainer = document.getElementById('event-custom-type-container');
    const customTypeInput = document.getElementById('event-custom-type');
    
    if (eventType === 'lainnya') {
        customTypeContainer.style.display = 'block';
        customTypeInput.required = true;
    } else {
        customTypeContainer.style.display = 'none';
        customTypeInput.required = false;
        customTypeInput.value = '';
    }
}

function handleDonationTypeChange() {
    const donationType = document.getElementById('donation-tipe').value;
    const customTypeContainer = document.getElementById('donation-custom-type-container');
    const customTypeInput = document.getElementById('donation-custom-type');
    
    if (donationType === 'lainnya') {
        customTypeContainer.style.display = 'block';
        customTypeInput.required = true;
    } else {
        customTypeContainer.style.display = 'none';
        customTypeInput.required = false;
        customTypeInput.value = '';
    }
}

function handleVolunteerAreaChange() {
    const volunteerArea = document.getElementById('volunteer-area').value;
    const customAreaContainer = document.getElementById('volunteer-custom-area-container');
    const customAreaInput = document.getElementById('volunteer-custom-area');
    
    if (volunteerArea === 'lainnya') {
        customAreaContainer.style.display = 'block';
        customAreaInput.required = true;
    } else {
        customAreaContainer.style.display = 'none';
        customAreaInput.required = false;
        customAreaInput.value = '';
    }
}

function showAddEventModal() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah data' : 'You do not have permission to add data', 'error');
        return;
    }
    editingEventId = null;
    document.getElementById('modal-event-title').textContent = getLang('add-event');
    document.getElementById('form-event').reset();
    document.getElementById('event-id').value = '';
    document.getElementById('event-custom-type-container').style.display = 'none';
    openModal('modal-event');
}

function editEvent(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk mengedit data' : 'You do not have permission to edit data', 'error');
        return;
    }
    
    const data = getData();
    const event = data.events.find(e => e.id === id);
    
    if (event) {
        editingEventId = id;
        document.getElementById('modal-event-title').textContent = currentLanguage === 'id' ? 'Edit Event' : 'Edit Event';
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-nama').value = event.nama;
        document.getElementById('event-tipe').value = event.tipe;
        document.getElementById('event-start').value = event.start;
        document.getElementById('event-end').value = event.end;
        document.getElementById('event-lokasi').value = event.lokasi;
        document.getElementById('event-deskripsi').value = event.deskripsi;
        document.getElementById('event-kapasitas').value = event.kapasitas;
        document.getElementById('event-status').value = event.status || 'upcoming';
        
        // Handle custom type
        if (event.tipe === 'lainnya' && event.customType) {
            document.getElementById('event-custom-type-container').style.display = 'block';
            document.getElementById('event-custom-type').value = event.customType;
        } else {
            document.getElementById('event-custom-type-container').style.display = 'none';
            document.getElementById('event-custom-type').value = '';
        }
        
        openModal('modal-event');
    }
}

function saveEvent(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menyimpan data' : 'You do not have permission to save data', 'error');
        return;
    }
    
    const data = getData();
    const eventTipe = document.getElementById('event-tipe').value;
    const customType = eventTipe === 'lainnya' ? document.getElementById('event-custom-type').value : null;
    
    const eventData = {
        nama: document.getElementById('event-nama').value,
        tipe: eventTipe,
        customType: customType,
        start: document.getElementById('event-start').value,
        end: document.getElementById('event-end').value,
        lokasi: document.getElementById('event-lokasi').value,
        deskripsi: document.getElementById('event-deskripsi').value,
        kapasitas: parseInt(document.getElementById('event-kapasitas').value) || 0,
        status: document.getElementById('event-status').value
    };
    
    if (editingEventId) {
        const index = data.events.findIndex(ev => ev.id === editingEventId);
        if (index !== -1) {
            data.events[index] = { ...data.events[index], ...eventData };
            showToast(currentLanguage === 'id' ? 'Event berhasil diupdate' : 'Event updated successfully', 'success');
        }
    } else {
        const newId = Math.max(...data.events.map(ev => ev.id), 0) + 1;
        data.events.push({ id: newId, ...eventData, participants: [] });
        
        data.activities.unshift({
            id: Date.now(),
            type: 'event',
            action: currentLanguage === 'id' ? 'Event dibuat' : 'Event created',
            detail: eventData.nama,
            timestamp: new Date().toISOString()
        });
        
        showToast(currentLanguage === 'id' ? 'Event berhasil ditambahkan' : 'Event added successfully', 'success');
    }
    
    saveData(data);
    closeModal('modal-event');
    renderEventsGrid();
    initDashboard();
}

function deleteEvent(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus data' : 'You do not have permission to delete data', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus event ini?' : 'Are you sure you want to delete this event?', () => {
        const data = getData();
        const index = data.events.findIndex(e => e.id === id);
        
        if (index !== -1) {
            data.events.splice(index, 1);
            saveData(data);
            renderEventsGrid();
            initDashboard();
            showToast(currentLanguage === 'id' ? 'Event berhasil dihapus' : 'Event deleted successfully', 'success');
        }
    });
}

function showEventParticipants(eventId) {
    currentEventId = eventId;
    const data = getData();
    const event = data.events.find(e => e.id === eventId);
    
    if (!event) return;
    
    renderParticipantsTable();
    openModal('modal-participants');
}

function renderParticipantsTable() {
    const data = getData();
    const event = data.events.find(e => e.id === currentEventId);
    const container = document.getElementById('participants-table-body');
    if (!container) return;
    
    if (!event || !event.participants) {
        container.innerHTML = `<tr><td colspan="6" class="text-center">${getLang('no-data') || 'Tidak ada data'}</td></tr>`;
        return;
    }
    
    container.innerHTML = event.participants.map((p, i) => {
        let nama, email, telepon;
        
        if (p.isManual || !p.memberId) {
            nama = p.nama || 'Unknown';
            email = p.email || '-';
            telepon = p.telepon || '-';
        } else {
            const member = data.members.find(m => m.id === p.memberId);
            nama = member ? member.nama : 'Unknown';
            email = member ? member.email : '-';
            telepon = member ? member.telepon : '-';
        }
        
        const deleteButton = isViewOnly() ? '' : `<button class="btn-action btn-delete" onclick="removeParticipant(${i})"><i class="fas fa-trash"></i></button>`;
        
        return `
            <tr>
                <td>${nama}</td>
                <td>${email}</td>
                <td>${telepon}</td>
                <td>${formatDate(p.tanggalDaftar)}</td>
                <td><span class="badge badge-success">${currentLanguage === 'id' ? 'Terdaftar' : 'Registered'}</span></td>
                <td>${deleteButton}</td>
            </tr>
        `;
    }).join('') || `<tr><td colspan="6" class="text-center">${getLang('no-data') || 'Tidak ada data'}</td></tr>`;
}

function addParticipant() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah peserta' : 'You do not have permission to add participants', 'error');
        return;
    }
    
    document.getElementById('form-manual-participant').reset();
    openModal('modal-manual-participant');
}

function saveManualParticipant(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah peserta' : 'You do not have permission to add participants', 'error');
        return;
    }
    
    const data = getData();
    const event = data.events.find(e => e.id === currentEventId);
    
    if (!event) {
        showToast(currentLanguage === 'id' ? 'Event tidak ditemukan' : 'Event not found', 'error');
        return;
    }
    
    const participantData = {
        nama: document.getElementById('participant-nama').value,
        email: document.getElementById('participant-email').value,
        telepon: document.getElementById('participant-telepon').value,
        alamat: document.getElementById('participant-alamat').value,
        tanggalDaftar: new Date().toISOString().split('T')[0],
        isManual: true
    };
    
    if (!event.participants) {
        event.participants = [];
    }
    
    event.participants.push(participantData);
    saveData(data);
    
    closeModal('modal-manual-participant');
    renderParticipantsTable();
    renderEventsGrid();
    showToast(currentLanguage === 'id' ? 'Peserta berhasil ditambahkan' : 'Participant added successfully', 'success');
}

function removeParticipant(index) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus peserta' : 'You do not have permission to remove participants', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Hapus peserta ini?' : 'Remove this participant?', () => {
        const data = getData();
        const event = data.events.find(e => e.id === currentEventId);
        if (event && event.participants) {
            event.participants.splice(index, 1);
            saveData(data);
            renderParticipantsTable();
            renderEventsGrid();
            showToast(currentLanguage === 'id' ? 'Peserta berhasil dihapus' : 'Participant removed successfully', 'success');
        }
    });
}

// ========================================
// VOLUNTEERS
// ========================================

function initVolunteers() {
    renderVolunteersGrid();
    renderAssignmentsList();
    
    // Hide add button for view-only users
    const addButton = document.querySelector('#page-volunteers .action-buttons .btn-primary');
    if (addButton) {
        addButton.style.display = isViewOnly() ? 'none' : 'inline-flex';
    }
}

function renderVolunteersGrid() {
    const data = getData();
    const container = document.getElementById('volunteers-grid');
    if (!container) return;
    
    const searchTerm = document.getElementById('search-volunteers')?.value?.toLowerCase() || '';
    
    let filtered = data.volunteers.filter(v => {
        let nama = '';
        if (v.memberId) {
            const member = data.members.find(m => m.id === v.memberId);
            nama = member ? member.nama.toLowerCase() : '';
        } else {
            nama = v.externalNama ? v.externalNama.toLowerCase() : '';
        }
        return nama.includes(searchTerm);
    });
    
    const areaLabels = {
        'guru-sekolah-minggu': currentLanguage === 'id' ? 'Guru Sekolah Minggu' : 'Sunday School Teacher',
        'singer': 'Singer',
        'worship-leader': currentLanguage === 'id' ? 'Worship Leader' : 'Worship Leader',
        'pemain-musik': currentLanguage === 'id' ? 'Pemain Musik' : 'Musician',
        'penari': currentLanguage === 'id' ? 'Penari' : 'Dancer',
        'kolektan': currentLanguage === 'id' ? 'Kolektan/Perpuluhan' : 'Collection/Tithe',
        'doa-syafaat': currentLanguage === 'id' ? 'Doa Syafaat' : 'Intercession',
        'pembicara': currentLanguage === 'id' ? 'Pembicara' : 'Speaker',
        'multimedia': 'Multimedia',
        'lighting-sound': currentLanguage === 'id' ? 'Lighting & Sound System' : 'Lighting & Sound System',
        'usher': 'Usher'
    };
    
    container.innerHTML = filtered.map(v => {
        let nama, email, telepon;
        
        if (v.memberId) {
            const member = data.members.find(m => m.id === v.memberId);
            nama = member ? member.nama : 'Unknown';
            email = member ? member.email : '-';
            telepon = member ? member.telepon : '-';
        } else {
            nama = v.externalNama || 'Unknown';
            email = v.externalEmail || '-';
            telepon = v.externalTelepon || '-';
        }
        
        const editButtons = isViewOnly() ? '' : `
            <button class="btn btn-secondary btn-sm" onclick="editVolunteer(${v.id})"><i class="fas fa-edit"></i> ${getLang('edit') || 'Edit'}</button>
            <button class="btn btn-danger btn-sm" onclick="deleteVolunteer(${v.id})"><i class="fas fa-trash"></i> ${getLang('delete') || 'Hapus'}</button>
        `;
        
        // Display custom area if "lainnya" is selected
        const areaDisplay = v.area === 'lainnya' && v.customArea ? v.customArea : (areaLabels[v.area] || v.area);
        
        return `
            <div class="volunteer-card">
                <div class="card-header-section">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=ff6b00&color=fff&size=50" class="card-avatar-img" alt="">
                    <div class="card-title">
                        <h4>${nama}</h4>
                        <p>${areaDisplay}</p>
                    </div>
                </div>
                <div class="card-info">
                    <div class="info-row"><i class="fas fa-envelope"></i> ${email}</div>
                    <div class="info-row"><i class="fas fa-phone"></i> ${telepon}</div>
                    <div class="info-row"><i class="fas fa-clock"></i> ${v.jadwal && Array.isArray(v.jadwal) ? v.jadwal.join(', ') : '-'}</div>
                    ${v.serviceDate ? `<div class="info-row"><i class="fas fa-calendar-alt"></i> ${formatDate(v.serviceDate)}${v.serviceTime ? ' - ' + v.serviceTime : ''}</div>` : ''}
                </div>
                <div class="card-footer-actions">
                    ${editButtons}
                    <button class="btn btn-primary btn-sm" onclick="showAssignments(${v.id})"><i class="fas fa-tasks"></i> ${getLang('assignments') || 'Tugas'}</button>
                </div>
            </div>
        `;
    }).join('') || `<p class="text-center" style="grid-column: 1/-1; color: var(--text-muted);">${getLang('no-data') || 'Tidak ada data'}</p>`;
}

function searchVolunteers() {
    renderVolunteersGrid();
}

function toggleVolunteerSource() {
    const source = document.getElementById('volunteer-source').value;
    const memberSection = document.getElementById('volunteer-member-section');
    const externalSection = document.getElementById('volunteer-external-section');
    
    if (source === 'member') {
        memberSection.style.display = 'block';
        externalSection.style.display = 'none';
        document.getElementById('volunteer-member').required = true;
        document.getElementById('volunteer-external-nama').required = false;
        document.getElementById('volunteer-external-email').required = false;
        document.getElementById('volunteer-external-telepon').required = false;
    } else {
        memberSection.style.display = 'none';
        externalSection.style.display = 'block';
        document.getElementById('volunteer-member').required = false;
        document.getElementById('volunteer-external-nama').required = true;
        document.getElementById('volunteer-external-email').required = true;
        document.getElementById('volunteer-external-telepon').required = true;
    }
}

function showAddVolunteerModal() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah data' : 'You do not have permission to add data', 'error');
        return;
    }
    editingVolunteerId = null;
    document.getElementById('modal-volunteer-title').textContent = getLang('add-volunteer');
    document.getElementById('form-volunteer').reset();
    document.getElementById('volunteer-id').value = '';
    
    document.getElementById('volunteer-member-section').style.display = 'block';
    document.getElementById('volunteer-external-section').style.display = 'none';
    
    document.querySelectorAll('input[name="jadwal"]').forEach(cb => cb.checked = false);
    
    populateVolunteerMemberSelect();
    openModal('modal-volunteer');
}

function editVolunteer(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk mengedit data' : 'You do not have permission to edit data', 'error');
        return;
    }
    
    const data = getData();
    const volunteer = data.volunteers.find(v => v.id === id);
    
    if (volunteer) {
        editingVolunteerId = id;
        document.getElementById('modal-volunteer-title').textContent = currentLanguage === 'id' ? 'Edit Relawan' : 'Edit Volunteer';
        document.getElementById('volunteer-id').value = volunteer.id;
        document.getElementById('volunteer-area').value = volunteer.area;
        
        // Handle custom area
        if (volunteer.area === 'lainnya' && volunteer.customArea) {
            document.getElementById('volunteer-custom-area-container').style.display = 'block';
            document.getElementById('volunteer-custom-area').value = volunteer.customArea;
            document.getElementById('volunteer-custom-area').required = true;
        } else {
            document.getElementById('volunteer-custom-area-container').style.display = 'none';
            document.getElementById('volunteer-custom-area').value = '';
            document.getElementById('volunteer-custom-area').required = false;
        }
        
        if (volunteer.memberId) {
            document.getElementById('volunteer-source').value = 'member';
            document.getElementById('volunteer-member-section').style.display = 'block';
            document.getElementById('volunteer-external-section').style.display = 'none';
            populateVolunteerMemberSelect(volunteer.memberId);
        } else {
            document.getElementById('volunteer-source').value = 'external';
            document.getElementById('volunteer-member-section').style.display = 'none';
            document.getElementById('volunteer-external-section').style.display = 'block';
            document.getElementById('volunteer-external-nama').value = volunteer.externalNama || '';
            document.getElementById('volunteer-external-email').value = volunteer.externalEmail || '';
            document.getElementById('volunteer-external-telepon').value = volunteer.externalTelepon || '';
        }
        
        document.querySelectorAll('input[name="jadwal"]').forEach(cb => cb.checked = false);
        
        if (volunteer.jadwal && Array.isArray(volunteer.jadwal)) {
            volunteer.jadwal.forEach(schedule => {
                const checkbox = document.querySelector(`input[name="jadwal"][value="${schedule}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Load service date and time
        document.getElementById('volunteer-service-date').value = volunteer.serviceDate || '';
        document.getElementById('volunteer-service-time').value = volunteer.serviceTime || '';
        
        openModal('modal-volunteer');
    }
}

function saveVolunteer(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menyimpan data' : 'You do not have permission to save data', 'error');
        return;
    }
    
    const data = getData();
    const source = document.getElementById('volunteer-source').value;
    const volunteerArea = document.getElementById('volunteer-area').value;
    const customArea = volunteerArea === 'lainnya' ? document.getElementById('volunteer-custom-area').value : null;
    
    // Validate custom area if "lainnya" is selected
    if (volunteerArea === 'lainnya' && !customArea) {
        showToast(currentLanguage === 'id' ? 'Area pelayanan lainnya wajib diisi' : 'Custom service area is required', 'error');
        return;
    }
    
    const scheduleCheckboxes = document.querySelectorAll('input[name="jadwal"]:checked');
    const jadwal = Array.from(scheduleCheckboxes).map(cb => cb.value);
    
    // Get service date and time
    const serviceDate = document.getElementById('volunteer-service-date').value;
    const serviceTime = document.getElementById('volunteer-service-time').value;
    
    let volunteerData = {
        area: volunteerArea,
        customArea: customArea,
        jadwal: jadwal.length > 0 ? jadwal : ['minggu-pagi'],
        serviceDate: serviceDate || null,
        serviceTime: serviceTime || null,
        status: 'aktif'
    };
    
    if (source === 'member') {
        volunteerData.memberId = parseInt(document.getElementById('volunteer-member').value);
        volunteerData.externalNama = null;
        volunteerData.externalEmail = null;
        volunteerData.externalTelepon = null;
    } else {
        volunteerData.memberId = null;
        volunteerData.externalNama = document.getElementById('volunteer-external-nama').value;
        volunteerData.externalEmail = document.getElementById('volunteer-external-email').value;
        volunteerData.externalTelepon = document.getElementById('volunteer-external-telepon').value;
    }
    
    if (editingVolunteerId) {
        const index = data.volunteers.findIndex(v => v.id === editingVolunteerId);
        if (index !== -1) {
            data.volunteers[index] = { ...data.volunteers[index], ...volunteerData };
            showToast(currentLanguage === 'id' ? 'Relawan berhasil diupdate' : 'Volunteer updated successfully', 'success');
        }
    } else {
        const newId = Math.max(...data.volunteers.map(v => v.id), 0) + 1;
        data.volunteers.push({ id: newId, ...volunteerData });
        showToast(currentLanguage === 'id' ? 'Relawan berhasil ditambahkan' : 'Volunteer added successfully', 'success');
    }
    
    saveData(data);
    closeModal('modal-volunteer');
    renderVolunteersGrid();
    initDashboard();
}

function deleteVolunteer(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus data' : 'You do not have permission to delete data', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus relawan ini?' : 'Are you sure you want to delete this volunteer?', () => {
        const data = getData();
        const index = data.volunteers.findIndex(v => v.id === id);
        
        if (index !== -1) {
            data.volunteers.splice(index, 1);
            saveData(data);
            renderVolunteersGrid();
            initDashboard();
            showToast(currentLanguage === 'id' ? 'Relawan berhasil dihapus' : 'Volunteer deleted successfully', 'success');
        }
    });
}

function populateVolunteerMemberSelect(selectedId = null) {
    const data = getData();
    const select = document.getElementById('volunteer-member');
    select.innerHTML = `<option value="">${getLang('select-member')}</option>` +
        data.members.filter(m => m.status === 'aktif').map(m => 
            `<option value="${m.id}" ${m.id == selectedId ? 'selected' : ''}>${m.nama}</option>`
        ).join('');
}

function showAssignments(volunteerId) {
    currentVolunteerIdForAssignment = volunteerId;
    const data = getData();
    const volunteer = data.volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;
    
    let nama;
    if (volunteer.memberId) {
        const member = data.members.find(m => m.id === volunteer.memberId);
        nama = member ? member.nama : 'Unknown';
    } else {
        nama = volunteer.externalNama || 'Unknown';
    }
    
    const assignments = data.assignments.filter(a => a.volunteerId === volunteerId);
    
    const areaLabels = {
        'guru-sekolah-minggu': currentLanguage === 'id' ? 'Guru Sekolah Minggu' : 'Sunday School Teacher',
        'singer': 'Singer',
        'worship-leader': currentLanguage === 'id' ? 'Worship Leader' : 'Worship Leader',
        'pemain-musik': currentLanguage === 'id' ? 'Pemain Musik' : 'Musician',
        'penari': currentLanguage === 'id' ? 'Penari' : 'Dancer',
        'kolektan': currentLanguage === 'id' ? 'Kolektan/Perpuluhan' : 'Collection/Tithe',
        'doa-syafaat': currentLanguage === 'id' ? 'Doa Syafaat' : 'Intercession',
        'pembicara': currentLanguage === 'id' ? 'Pembicara' : 'Speaker',
        'multimedia': 'Multimedia',
        'lighting-sound': currentLanguage === 'id' ? 'Lighting & Sound System' : 'Lighting & Sound System',
        'usher': 'Usher'
    };
    
    const addButton = isViewOnly() ? '' : `
        <button class="btn btn-primary btn-sm" onclick="showAddAssignmentModal()" style="margin-bottom: 15px;">
            <i class="fas fa-plus"></i> ${getLang('add-assignment')}
        </button>
    `;
    
    // Display custom area if "lainnya" is selected
    const areaDisplay = volunteer.area === 'lainnya' && volunteer.customArea ? volunteer.customArea : (areaLabels[volunteer.area] || volunteer.area);
    
    document.getElementById('detail-title').textContent = `${getLang('assignments') || 'Tugas'}: ${nama}`;
    // Format service date and time for display
    const serviceDateDisplay = volunteer.serviceDate ? formatDate(volunteer.serviceDate) : null;
    const serviceTimeDisplay = volunteer.serviceTime || null;
    
    document.getElementById('detail-content').innerHTML = `
        <div class="detail-section">
            <div class="volunteer-info" style="margin-bottom: 20px; padding: 15px; background: var(--dark-bg); border-radius: var(--radius-sm);">
                <p><strong>${getLang('service-area')}:</strong> ${areaDisplay}</p>
                <p><strong>${getLang('schedule')}:</strong> ${volunteer.jadwal && Array.isArray(volunteer.jadwal) ? volunteer.jadwal.join(', ') : '-'}</p>
                ${serviceDateDisplay ? `<p><strong>${getLang('service-date')}:</strong> ${serviceDateDisplay}${serviceTimeDisplay ? ' - ' + serviceTimeDisplay : ''}</p>` : ''}
                <p><strong>${getLang('status')}:</strong> <span class="badge badge-${volunteer.status === 'aktif' ? 'success' : 'secondary'}">${volunteer.status}</span></p>
            </div>
            ${addButton}
            <h4 style="margin: 20px 0 15px;"><i class="fas fa-tasks" style="color: var(--primary-color);"></i> ${getLang('assignments-list') || 'Daftar Tugas'}</h4>
            ${assignments.length > 0 ? assignments.map((a, index) => {
                const event = data.events.find(e => e.id === a.eventId);
                return `
                    <div class="assignment-item" style="padding: 15px; background: var(--dark-bg); border-radius: var(--radius-sm); margin-bottom: 10px; border-left: 3px solid var(--primary-color);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <p style="font-weight: 600; margin-bottom: 5px;">${event ? event.nama : 'Unknown Event'}</p>
                                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">
                                    <i class="fas fa-calendar"></i> ${formatDate(a.tanggal)} | 
                                    <i class="fas fa-clock"></i> ${a.waktu} | 
                                    <i class="fas fa-map-marker-alt"></i> ${a.tempat}
                                </p>
                                <p style="font-size: 13px; margin-bottom: 8px;">${a.tugas || 'Tidak ada deskripsi'}</p>
                                <span class="badge badge-${a.status === 'completed' ? 'success' : a.status === 'assigned' ? 'warning' : 'secondary'}">${a.status || 'pending'}</span>
                            </div>
                            ${isViewOnly() ? '' : `
                                <button class="btn-action btn-delete" onclick="deleteAssignment(${a.id})" title="Hapus">
                                    <i class="fas fa-trash"></i>
                                </button>
                            `}
                        </div>
                    </div>
                `;
            }).join('') : `<p style="color: var(--text-muted); text-align: center; padding: 20px;">${currentLanguage === 'id' ? 'Belum ada tugas yang ditugaskan' : 'No assignments yet'}</p>`}
        </div>
    `;
    openModal('modal-detail');
}

// ========================================
// MEMBERS
// ========================================

function renderMembersTable() {
    const data = getData();
    const container = document.getElementById('members-table-body');
    const searchTerm = document.getElementById('search-members')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('filter-status')?.value || '';
    const genderFilter = document.getElementById('filter-gender')?.value || '';
    
    let filtered = data.members.filter(m => {
        const matchSearch = m.nama.toLowerCase().includes(searchTerm) || 
                           m.email.toLowerCase().includes(searchTerm) ||
                           m.telepon.includes(searchTerm);
        const matchStatus = !statusFilter || m.status === statusFilter;
        const matchGender = !genderFilter || m.jk === genderFilter;
        return matchSearch && matchStatus && matchGender;
    });
    
    const isUser = isViewOnly();
    
    container.innerHTML = filtered.map(m => {
        const group = data.groups.find(g => g.id == m.groupId);
        
        // For view-only users, hide sensitive info
        const emailDisplay = isUser ? '***@***.com' : m.email;
        const phoneDisplay = isUser ? '************' : m.telepon;
        
        const editButtons = isUser ? '' : `
            <button class="btn-action btn-edit" onclick="editMember(${m.id})" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-action btn-delete" onclick="deleteMember(${m.id})" title="Hapus"><i class="fas fa-trash"></i></button>
        `;
        
        const adminCols = isUser ? '' : `
            <td>${emailDisplay}</td>
            <td>${phoneDisplay}</td>
        `;
        
        // Status badge with responsive styling
        const statusBadge = m.status === 'aktif' 
            ? `<span class="badge badge-success"><i class="fas fa-check-circle"></i> ${currentLanguage === 'id' ? 'Aktif' : 'Active'}</span>`
            : `<span class="badge badge-inactive"><i class="fas fa-times-circle"></i> ${currentLanguage === 'id' ? 'Nonaktif' : 'Inactive'}</span>`;
        
        // Group display with better styling
        const groupDisplay = group 
            ? `<span class="group-tag"><i class="fas fa-users"></i> ${group.nama}</span>` 
            : '<span class="text-muted">-</span>';
        
        return `
            <tr class="${m.status !== 'aktif' ? 'row-inactive' : ''}">
                <td><img src="https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama)}&background=ff6b00&color=fff" class="table-avatar" alt="${m.nama}"></td>
                <td><strong>${m.nama}</strong></td>
                ${adminCols}
                <td>${m.jk}</td>
                <td>${statusBadge}</td>
                <td>${groupDisplay}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-action btn-view" onclick="viewMemberDetail(${m.id})" title="Detail"><i class="fas fa-eye"></i></button>
                        ${editButtons}
                    </div>
                </td>
            </tr>
        `;
    }).join('') || `<tr><td colspan="${isUser ? 6 : 8}" class="text-center">${getLang('no-data') || 'Tidak ada data'}</td></tr>`;
    
    // Update action bar visibility
    const addButton = document.querySelector('#page-members .action-buttons .btn-primary');
    if (addButton) {
        addButton.style.display = isUser ? 'none' : 'inline-flex';
    }
}

function searchMembers() {
    renderMembersTable();
}

function filterMembers() {
    renderMembersTable();
}

function showAddMemberModal() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah data' : 'You do not have permission to add data', 'error');
        return;
    }
    editingMemberId = null;
    document.getElementById('modal-member-title').textContent = currentLanguage === 'id' ? 'Tambah Member Baru' : 'Add New Member';
    document.getElementById('form-member').reset();
    document.getElementById('member-id').value = '';
    
    // Set default join date to today
    document.getElementById('member-join-date').value = new Date().toISOString().split('T')[0];
    
    // Populate group select with no selection
    populateGroupSelect(null);
    
    openModal('modal-member');
}

function editMember(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk mengedit data' : 'You do not have permission to edit data', 'error');
        return;
    }
    
    const data = getData();
    const member = data.members.find(m => m.id === id);
    
    if (!member) {
        showToast(currentLanguage === 'id' ? 'Member tidak ditemukan' : 'Member not found', 'error');
        return;
    }
    
    editingMemberId = id;
    document.getElementById('modal-member-title').textContent = currentLanguage === 'id' ? 'Edit Member: ' + member.nama : 'Edit Member: ' + member.nama;
    document.getElementById('member-id').value = member.id;
    document.getElementById('member-nama').value = member.nama;
    document.getElementById('member-email').value = member.email;
    document.getElementById('member-telepon').value = member.telepon || '';
    document.getElementById('member-jk').value = member.jk;
    document.getElementById('member-tempat-lahir').value = member.tempatLahir || '';
    document.getElementById('member-tgl-lahir').value = member.tglLahir || '';
    document.getElementById('member-alamat').value = member.alamat || '';
    document.getElementById('member-kota').value = member.kota || '';
    document.getElementById('member-kodepos').value = member.kodepos || '';
    document.getElementById('member-status').value = member.status;
    document.getElementById('member-join-date').value = member.joinDate || '';
    
    // Populate group select with member's current group
    populateGroupSelect(member.groupId);
    
    openModal('modal-member');
}

async function saveMember(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menyimpan data' : 'You do not have permission to save data', 'error');
        return;
    }
    
    showLoading(true);
    
    const data = getData();
    
    // Get groupId and convert to integer or null
    const groupSelect = document.getElementById('member-group');
    const groupIdValue = groupSelect ? groupSelect.value : '';
    const groupId = groupIdValue ? parseInt(groupIdValue) : null;
    
    const memberData = {
        nama: document.getElementById('member-nama').value.trim(),
        email: document.getElementById('member-email').value.trim(),
        telepon: document.getElementById('member-telepon').value.trim(),
        jk: document.getElementById('member-jk').value,
        tempatLahir: document.getElementById('member-tempat-lahir').value.trim(),
        tglLahir: document.getElementById('member-tgl-lahir').value,
        alamat: document.getElementById('member-alamat').value.trim(),
        kota: document.getElementById('member-kota').value.trim(),
        kodepos: document.getElementById('member-kodepos').value.trim(),
        status: document.getElementById('member-status').value,
        groupId: groupId,
        joinDate: document.getElementById('member-join-date').value || new Date().toISOString().split('T')[0]
    };
    
    if (editingMemberId) {
        const index = data.members.findIndex(m => m.id === editingMemberId);
        if (index !== -1) {
            const updatedMember = { ...data.members[index], ...memberData };
            data.members[index] = updatedMember;
            
            // Save to Firebase
            if (isFirebaseReady()) {
                await window.setDocument(window.DB_COLLECTIONS.MEMBERS, String(editingMemberId), updatedMember);
            }
            
            showToast(currentLanguage === 'id' ? 'Member berhasil diupdate' : 'Member updated successfully', 'success');
        }
    } else {
        const newId = Math.max(...data.members.map(m => m.id), 0) + 1;
        const newMember = { id: newId, ...memberData, avatar: null };
        data.members.push(newMember);
        
        // Save to Firebase
        if (isFirebaseReady()) {
            await window.setDocument(window.DB_COLLECTIONS.MEMBERS, String(newId), newMember);
        }
        
        data.activities.unshift({
            id: Date.now(),
            type: 'member',
            action: currentLanguage === 'id' ? 'Member baru ditambahkan' : 'New member added',
            detail: memberData.nama,
            timestamp: new Date().toISOString()
        });
        
        showToast(currentLanguage === 'id' ? 'Member berhasil ditambahkan' : 'Member added successfully', 'success');
    }
    
    saveData(data);
    closeModal('modal-member');
    renderMembersTable();
    initDashboard();
    showLoading(false);
}

function viewMemberDetail(id) {
    const data = getData();
    const member = data.members.find(m => m.id === id);
    if (!member) return;
    
    const isUser = isViewOnly();
    const group = data.groups.find(g => g.id == member.groupId);
    const family = data.families.find(f => f.anggota.includes(id));
    
    // Hide sensitive info for view-only users
    const emailDisplay = isUser ? '***@***.com' : member.email;
    const phoneDisplay = isUser ? '************' : member.telepon;
    const addressDisplay = isUser ? '************' : (member.alamat || '-');
    
    // Status badge with better styling
    const statusBadge = member.status === 'aktif' 
        ? `<span class="badge badge-success" style="font-size: 14px; padding: 8px 16px;"><i class="fas fa-check-circle"></i> ${currentLanguage === 'id' ? 'Aktif' : 'Active'}</span>`
        : `<span class="badge badge-inactive" style="font-size: 14px; padding: 8px 16px;"><i class="fas fa-times-circle"></i> ${currentLanguage === 'id' ? 'Nonaktif' : 'Inactive'}</span>`;
    
    // Group display with better styling
    const groupDisplay = group 
        ? `<span class="group-tag" style="font-size: 14px; padding: 6px 12px;"><i class="fas fa-users"></i> ${group.nama}</span>` 
        : '<span class="text-muted">-</span>';
    
    document.getElementById('detail-title').textContent = currentLanguage === 'id' ? 'Detail Member' : 'Member Detail';
    document.getElementById('detail-content').innerHTML = `
        <div class="detail-section">
            <div class="detail-avatar" style="text-align: center; margin-bottom: 20px;">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.nama)}&size=120&background=${member.status === 'aktif' ? 'ff6b00' : '9e9e9e'}&color=fff" style="border-radius: 50%;" alt="${member.nama}">
                <h3 style="margin-top: 15px;">${member.nama}</h3>
                ${statusBadge}
            </div>
            <div class="detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="detail-item"><label>${getLang('email')}</label><p>${emailDisplay}</p></div>
                <div class="detail-item"><label>${getLang('phone')}</label><p>${phoneDisplay}</p></div>
                <div class="detail-item"><label>${getLang('gender')}</label><p>${member.jk}</p></div>
                <div class="detail-item"><label>${getLang('birth-date')}</label><p>${formatDate(member.tglLahir)}</p></div>
                <div class="detail-item"><label>${getLang('address')}</label><p>${addressDisplay}</p></div>
                <div class="detail-item"><label>${getLang('city')}</label><p>${isUser ? '****' : (member.kota || '-')}</p></div>
                <div class="detail-item"><label>${getLang('group')}</label><p>${groupDisplay}</p></div>
                <div class="detail-item"><label>${getLang('family')}</label><p>${family ? family.nama : '-'}</p></div>
                <div class="detail-item"><label>${getLang('join-date')}</label><p>${formatDate(member.joinDate)}</p></div>
            </div>
        </div>
    `;
    openModal('modal-detail');
}

async function deleteMember(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus data' : 'You do not have permission to delete data', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus member ini?' : 'Are you sure you want to delete this member?', async () => {
        showLoading(true);
        
        const data = getData();
        const index = data.members.findIndex(m => m.id === id);
        
        if (index !== -1) {
            data.members.splice(index, 1);
            
            // Delete from Firebase
            if (isFirebaseReady()) {
                await window.deleteDocument(window.DB_COLLECTIONS.MEMBERS, String(id));
            }
            
            saveData(data);
            renderMembersTable();
            initDashboard();
            showToast(currentLanguage === 'id' ? 'Member berhasil dihapus' : 'Member deleted successfully', 'success');
        }
        
        showLoading(false);
    });
}

function populateGroupSelect(selectedId = null) {
    const data = getData();
    const select = document.getElementById('member-group');
    if (!select) return;
    
    // Convert selectedId to number for proper comparison
    const selectedGroupId = selectedId ? parseInt(selectedId) : null;
    
    let optionsHTML = `<option value="">${getLang('none')}</option>`;
    
    data.groups.forEach(g => {
        const isSelected = selectedGroupId && g.id === selectedGroupId ? 'selected' : '';
        optionsHTML += `<option value="${g.id}" ${isSelected}>${g.nama}</option>`;
    });
    
    select.innerHTML = optionsHTML;
}

// ========================================
// FAMILIES
// ========================================

function renderFamiliesGrid() {
    const data = getData();
    const container = document.getElementById('families-grid');
    const searchTerm = document.getElementById('search-families')?.value?.toLowerCase() || '';
    
    const filtered = data.families.filter(f => 
        f.nama.toLowerCase().includes(searchTerm) || 
        f.alamat.toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = filtered.map(f => {
        const kepala = data.members.find(m => m.id === f.kepalaId);
        const anggota = f.anggota.map(id => data.members.find(m => m.id === id)).filter(Boolean);
        const editButtons = isViewOnly() ? '' : `
            <button class="btn btn-secondary btn-sm" onclick="editFamily(${f.id})"><i class="fas fa-edit"></i> ${getLang('edit') || 'Edit'}</button>
            <button class="btn btn-danger btn-sm" onclick="deleteFamily(${f.id})"><i class="fas fa-trash"></i> ${getLang('delete') || 'Hapus'}</button>
        `;
        
        return `
            <div class="family-card">
                <div class="card-header-section">
                    <div class="card-avatar"><i class="fas fa-home"></i></div>
                    <div class="card-title">
                        <h4>${f.nama}</h4>
                        <p>${anggota.length} ${currentLanguage === 'id' ? 'anggota' : 'members'}</p>
                    </div>
                </div>
                <div class="card-info">
                    <div class="info-row"><i class="fas fa-user"></i> ${getLang('head-family')}: ${kepala ? kepala.nama : '-'}</div>
                    <div class="info-row"><i class="fas fa-map-marker-alt"></i> ${f.alamat}</div>
                    <div class="info-row"><i class="fas fa-city"></i> ${f.kota}</div>
                </div>
                <div class="card-footer-actions">
                    ${editButtons}
                    <button class="btn btn-primary btn-sm" onclick="viewFamilyDetail(${f.id})"><i class="fas fa-eye"></i> ${getLang('detail') || 'Detail'}</button>
                </div>
            </div>
        `;
    }).join('') || `<p class="text-center" style="grid-column: 1/-1; color: var(--text-muted);">${getLang('no-data') || 'Tidak ada data'}</p>`;
    
    // Hide add button for view-only users
    const addButton = document.querySelector('#page-families .action-buttons .btn-primary');
    if (addButton) {
        addButton.style.display = isViewOnly() ? 'none' : 'inline-flex';
    }
}

function searchFamilies() {
    renderFamiliesGrid();
}

function showAddFamilyModal() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah data' : 'You do not have permission to add data', 'error');
        return;
    }
    editingFamilyId = null;
    document.getElementById('modal-family-title').textContent = getLang('add-family');
    document.getElementById('form-family').reset();
    populateFamilyMemberSelects();
    openModal('modal-family');
}

function editFamily(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk mengedit data' : 'You do not have permission to edit data', 'error');
        return;
    }
    
    const data = getData();
    const family = data.families.find(f => f.id === id);
    
    if (family) {
        editingFamilyId = id;
        document.getElementById('modal-family-title').textContent = currentLanguage === 'id' ? 'Edit Keluarga' : 'Edit Family';
        document.getElementById('family-id').value = family.id;
        document.getElementById('family-nama').value = family.nama;
        document.getElementById('family-alamat').value = family.alamat;
        populateFamilyMemberSelects(family.kepalaId, family.anggota);
        openModal('modal-family');
    }
}

function saveFamily(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menyimpan data' : 'You do not have permission to save data', 'error');
        return;
    }
    
    const data = getData();
    const kepalaId = parseInt(document.getElementById('family-kepala').value);
    const selectedMembers = Array.from(document.querySelectorAll('#family-members input:checked')).map(cb => parseInt(cb.value));
    
    const familyData = {
        nama: document.getElementById('family-nama').value,
        kepalaId: kepalaId,
        anggota: [kepalaId, ...selectedMembers.filter(id => id !== kepalaId)],
        alamat: document.getElementById('family-alamat').value,
        kota: data.churchProfile.kota
    };
    
    if (editingFamilyId) {
        const index = data.families.findIndex(f => f.id === editingFamilyId);
        if (index !== -1) {
            data.families[index] = { ...data.families[index], ...familyData };
            showToast(currentLanguage === 'id' ? 'Keluarga berhasil diupdate' : 'Family updated successfully', 'success');
        }
    } else {
        const newId = Math.max(...data.families.map(f => f.id), 0) + 1;
        data.families.push({ id: newId, ...familyData });
        showToast(currentLanguage === 'id' ? 'Keluarga berhasil ditambahkan' : 'Family added successfully', 'success');
    }
    
    saveData(data);
    closeModal('modal-family');
    renderFamiliesGrid();
}

function deleteFamily(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus data' : 'You do not have permission to delete data', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus keluarga ini?' : 'Are you sure you want to delete this family?', () => {
        const data = getData();
        const index = data.families.findIndex(f => f.id === id);
        
        if (index !== -1) {
            data.families.splice(index, 1);
            saveData(data);
            renderFamiliesGrid();
            showToast(currentLanguage === 'id' ? 'Keluarga berhasil dihapus' : 'Family deleted successfully', 'success');
        }
    });
}

function viewFamilyDetail(id) {
    const data = getData();
    const family = data.families.find(f => f.id === id);
    if (!family) return;
    
    const kepala = data.members.find(m => m.id === family.kepalaId);
    const anggota = family.anggota.map(mid => data.members.find(m => m.id === mid)).filter(Boolean);
    
    document.getElementById('detail-title').textContent = currentLanguage === 'id' ? 'Detail Keluarga' : 'Family Detail';
    document.getElementById('detail-content').innerHTML = `
        <div class="detail-section">
            <h3 style="margin-bottom: 20px;">${family.nama}</h3>
            <div class="detail-item" style="margin-bottom: 15px;">
                <label>${getLang('head-family')}</label>
                <p>${kepala ? kepala.nama : '-'}</p>
            </div>
            <div class="detail-item" style="margin-bottom: 15px;">
                <label>${getLang('address')}</label>
                <p>${family.alamat}, ${family.kota}</p>
            </div>
            <h4 style="margin: 25px 0 15px;"><i class="fas fa-users" style="color: var(--primary-color);"></i> ${getLang('family-members')}</h4>
            <div class="anggota-list">
                ${anggota.map(a => `
                    <div class="anggota-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--dark-bg); border-radius: var(--radius-sm); margin-bottom: 8px;">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(a.nama)}&background=ff6b00&color=fff&size=40" style="border-radius: 50%;" alt="${a.nama}">
                        <div>
                            <p style="font-weight: 600;">${a.nama} ${a.id === family.kepalaId ? '<span class="badge badge-warning" style="font-size: 10px;">' + (getLang('head') || 'Kepala') + '</span>' : ''}</p>
                            <p style="font-size: 12px; color: var(--text-muted);">${a.jk} • ${calculateAge(a.tglLahir)} ${currentLanguage === 'id' ? 'tahun' : 'years'}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    openModal('modal-detail');
}

function populateFamilyMemberSelects(selectedKepala = null, selectedAnggota = []) {
    const data = getData();
    const kepalaSelect = document.getElementById('family-kepala');
    const membersContainer = document.getElementById('family-members');
    
    kepalaSelect.innerHTML = `<option value="">${getLang('select')}</option>` +
        data.members.filter(m => m.status === 'aktif').map(m => 
            `<option value="${m.id}" ${m.id == selectedKepala ? 'selected' : ''}>${m.nama}</option>`
        ).join('');
    
    membersContainer.innerHTML = data.members.filter(m => m.status === 'aktif').map(m => `
        <label class="member-checkbox">
            <input type="checkbox" value="${m.id}" ${selectedAnggota.includes(m.id) ? 'checked' : ''}>
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama)}&background=ff6b00&color=fff&size=30" style="border-radius: 50%;" alt="${m.nama}">
            <span>${m.nama}</span>
        </label>
    `).join('');
}

// ========================================
// GROUPS
// ========================================

function renderGroupsGrid() {
    const data = getData();
    const container = document.getElementById('groups-grid');
    const searchTerm = document.getElementById('search-groups')?.value?.toLowerCase() || '';
    const isUser = isViewOnly();
    
    const filtered = data.groups.filter(g => 
        g.nama.toLowerCase().includes(searchTerm) || 
        g.deskripsi.toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = filtered.map(g => {
        const leader = data.members.find(m => m.id === g.leaderId);
        
        // For view-only users, only show phone if group setting allows
        const showPhone = isUser ? g.showPhone !== false : true;
        const phoneDisplay = (showPhone && leader) ? leader.telepon : (isUser ? '************' : (leader ? leader.telepon : '-'));
        
        const editButtons = isUser ? '' : `
            <button class="btn btn-secondary btn-sm" onclick="editGroup(${g.id})"><i class="fas fa-edit"></i> ${getLang('edit') || 'Edit'}</button>
            <button class="btn btn-danger btn-sm" onclick="deleteGroup(${g.id})"><i class="fas fa-trash"></i> ${getLang('delete') || 'Hapus'}</button>
        `;
        
        return `
            <div class="group-card">
                <div class="card-header-section">
                    <div class="card-avatar"><i class="fas fa-object-group"></i></div>
                    <div class="card-title">
                        <h4>${g.nama}</h4>
                        <p>${g.anggota.length} ${currentLanguage === 'id' ? 'anggota' : 'members'}</p>
                    </div>
                </div>
                <div class="card-info">
                    <div class="info-row"><i class="fas fa-user-tie"></i> ${getLang('leader')}: ${leader ? leader.nama : '-'}</div>
                    <div class="info-row"><i class="fas fa-phone"></i> ${phoneDisplay}</div>
                    <div class="info-row"><i class="fas fa-clock"></i> ${g.jadwal}</div>
                    <div class="info-row"><i class="fas fa-align-left"></i> ${g.deskripsi}</div>
                </div>
                <div class="card-footer-actions">
                    ${editButtons}
                    <button class="btn btn-primary btn-sm" onclick="manageGroupMembers(${g.id})"><i class="fas fa-users"></i> ${getLang('members') || 'Anggota'}</button>
                </div>
            </div>
        `;
    }).join('') || `<p class="text-center" style="grid-column: 1/-1; color: var(--text-muted);">${getLang('no-data') || 'Tidak ada data'}</p>`;
    
    // Hide add button for view-only users
    const addButton = document.querySelector('#page-groups .action-buttons .btn-primary');
    if (addButton) {
        addButton.style.display = isUser ? 'none' : 'inline-flex';
    }
}

function searchGroups() {
    renderGroupsGrid();
}

function showAddGroupModal() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah data' : 'You do not have permission to add data', 'error');
        return;
    }
    editingGroupId = null;
    document.getElementById('modal-group-title').textContent = getLang('add-group');
    document.getElementById('form-group').reset();
    document.getElementById('group-id').value = '';
    populateLeaderSelect();
    openModal('modal-group');
}

function editGroup(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk mengedit data' : 'You do not have permission to edit data', 'error');
        return;
    }
    
    const data = getData();
    const group = data.groups.find(g => g.id === id);
    
    if (group) {
        editingGroupId = id;
        document.getElementById('modal-group-title').textContent = currentLanguage === 'id' ? 'Edit Group' : 'Edit Group';
        document.getElementById('group-id').value = group.id;
        document.getElementById('group-nama').value = group.nama;
        document.getElementById('group-deskripsi').value = group.deskripsi;
        document.getElementById('group-jadwal').value = group.jadwal;
        document.getElementById('group-show-phone').checked = group.showPhone !== false;
        populateLeaderSelect(group.leaderId);
        openModal('modal-group');
    }
}

function saveGroup(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menyimpan data' : 'You do not have permission to save data', 'error');
        return;
    }
    
    const data = getData();
    const groupData = {
        nama: document.getElementById('group-nama').value,
        deskripsi: document.getElementById('group-deskripsi').value,
        leaderId: parseInt(document.getElementById('group-leader').value),
        jadwal: document.getElementById('group-jadwal').value,
        showPhone: document.getElementById('group-show-phone').checked
    };
    
    if (editingGroupId) {
        const index = data.groups.findIndex(g => g.id === editingGroupId);
        if (index !== -1) {
            data.groups[index] = { ...data.groups[index], ...groupData };
            showToast(currentLanguage === 'id' ? 'Group berhasil diupdate' : 'Group updated successfully', 'success');
        }
    } else {
        const newId = Math.max(...data.groups.map(g => g.id), 0) + 1;
        data.groups.push({ id: newId, ...groupData, anggota: [], createdAt: new Date().toISOString() });
        showToast(currentLanguage === 'id' ? 'Group berhasil ditambahkan' : 'Group added successfully', 'success');
    }
    
    saveData(data);
    closeModal('modal-group');
    renderGroupsGrid();
    initDashboard();
}

function deleteGroup(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus data' : 'You do not have permission to delete data', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus group ini?' : 'Are you sure you want to delete this group?', () => {
        const data = getData();
        const index = data.groups.findIndex(g => g.id === id);
        
        if (index !== -1) {
            data.groups.splice(index, 1);
            saveData(data);
            renderGroupsGrid();
            initDashboard();
            showToast(currentLanguage === 'id' ? 'Group berhasil dihapus' : 'Group deleted successfully', 'success');
        }
    });
}

function manageGroupMembers(groupId) {
    currentGroupId = groupId;
    const data = getData();
    const group = data.groups.find(g => g.id === groupId);
    
    if (!group) return;
    
    // Update modal title
    document.getElementById('modal-group-members-title').textContent = `${currentLanguage === 'id' ? 'Kelola Anggota' : 'Manage Members'}: ${group.nama}`;
    
    // Render current members
    renderGroupMembersList();
    
    // Populate available members dropdown
    populateAvailableMembersSelect();
    
    // Hide add member section for view-only users
    const addMemberSection = document.getElementById('add-member-section');
    if (addMemberSection) {
        addMemberSection.style.display = isViewOnly() ? 'none' : 'block';
    }
    
    openModal('modal-group-members');
}

function renderGroupMembersList() {
    const data = getData();
    const group = data.groups.find(g => g.id === currentGroupId);
    const container = document.getElementById('group-members-list');
    
    if (!group || !group.anggota || group.anggota.length === 0) {
        container.innerHTML = `<p class="text-center" style="padding: 20px; color: var(--text-muted);">${currentLanguage === 'id' ? 'Belum ada anggota dalam group ini' : 'No members in this group yet'}</p>`;
        return;
    }
    
    // Clear container first
    container.innerHTML = '';
    
    // Render each member with proper event handling
    group.anggota.forEach(memberId => {
        const member = data.members.find(m => m.id === memberId);
        if (!member) return;
        
        const isLeader = group.leaderId === memberId;
        const memberItem = document.createElement('div');
        memberItem.className = 'group-member-item';
        memberItem.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--dark-bg); border-radius: var(--radius-sm); margin-bottom: 8px;';
        
        let html = `
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.nama)}&background=ff6b00&color=fff&size=40" style="border-radius: 50%;" alt="${member.nama}">
            <div style="flex: 1;">
                <p style="font-weight: 600;">${member.nama} ${isLeader ? '<span class="badge badge-warning" style="font-size: 10px;">' + (getLang('leader') || 'Leader') + '</span>' : ''}</p>
                <p style="font-size: 12px; color: var(--text-muted);">${member.email}</p>
            </div>
        `;
        
        if (!isViewOnly()) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-action btn-delete';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.onclick = function() { removeMemberFromGroup(memberId); };
            
            memberItem.innerHTML = html;
            memberItem.appendChild(deleteBtn);
        } else {
            memberItem.innerHTML = html;
        }
        
        container.appendChild(memberItem);
    });
}

function populateAvailableMembersSelect() {
    const data = getData();
    const group = data.groups.find(g => g.id === currentGroupId);
    const select = document.getElementById('new-member-select');
    
    if (!group) return;
    
    // Get members not in group
    const availableMembers = data.members.filter(m => 
        m.status === 'aktif' && !group.anggota.includes(m.id)
    );
    
    if (availableMembers.length === 0) {
        select.innerHTML = `<option value="">${currentLanguage === 'id' ? 'Tidak ada member tersedia' : 'No members available'}</option>`;
        return;
    }
    
    select.innerHTML = `<option value="">${getLang('select-member')}</option>` +
        availableMembers.map(m => `<option value="${m.id}">${m.nama}</option>`).join('');
}

function addMemberToGroup() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah anggota' : 'You do not have permission to add members', 'error');
        return;
    }
    
    const select = document.getElementById('new-member-select');
    const memberId = parseInt(select.value);
    
    if (!memberId) {
        showToast(currentLanguage === 'id' ? 'Pilih member terlebih dahulu' : 'Please select a member', 'warning');
        return;
    }
    
    const data = getData();
    const group = data.groups.find(g => g.id === currentGroupId);
    
    if (group) {
        if (!group.anggota.includes(memberId)) {
            group.anggota.push(memberId);
            saveData(data);
            renderGroupMembersList();
            populateAvailableMembersSelect();
            renderGroupsGrid();
            initDashboard();
            showToast(currentLanguage === 'id' ? 'Anggota berhasil ditambahkan ke group' : 'Member added to group successfully', 'success');
        } else {
            showToast(currentLanguage === 'id' ? 'Member sudah ada dalam group ini' : 'Member already in this group', 'warning');
        }
    }
}

function removeMemberFromGroup(memberId) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus anggota' : 'You do not have permission to remove members', 'error');
        return;
    }
    
    if (!confirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus anggota ini dari group?' : 'Are you sure you want to remove this member from the group?')) {
        return;
    }
    
    const data = getData();
    const group = data.groups.find(g => g.id === currentGroupId);
    
    if (group) {
        const targetId = parseInt(memberId);
        const index = group.anggota.indexOf(targetId);
        
        if (index > -1) {
            group.anggota.splice(index, 1);
            
            // If removed member was leader, clear leader
            if (group.leaderId === targetId) {
                group.leaderId = null;
            }
            
            saveData(data);
            renderGroupMembersList();
            populateAvailableMembersSelect();
            renderGroupsGrid();
            initDashboard();
            showToast(currentLanguage === 'id' ? 'Anggota berhasil dihapus dari group' : 'Member removed from group successfully', 'success');
        } else {
            showToast(currentLanguage === 'id' ? 'Anggota tidak ditemukan dalam group' : 'Member not found in group', 'error');
        }
    }
}

function populateLeaderSelect(selectedId = null) {
    const data = getData();
    const select = document.getElementById('group-leader');
    select.innerHTML = `<option value="">${getLang('select')}</option>` +
        data.members.filter(m => m.status === 'aktif').map(m => 
            `<option value="${m.id}" ${m.id == selectedId ? 'selected' : ''}>${m.nama}</option>`
        ).join('');
}

function renderAssignmentsList() {
    const data = getData();
    const container = document.getElementById('assignments-list');
    
    if (!container) return;
    
    const areaLabels = {
        'guru-sekolah-minggu': currentLanguage === 'id' ? 'Guru Sekolah Minggu' : 'Sunday School Teacher',
        'singer': 'Singer',
        'worship-leader': currentLanguage === 'id' ? 'Worship Leader' : 'Worship Leader',
        'pemain-musik': currentLanguage === 'id' ? 'Pemain Musik' : 'Musician',
        'penari': currentLanguage === 'id' ? 'Penari' : 'Dancer',
        'kolektan': currentLanguage === 'id' ? 'Kolektan/Perpuluhan' : 'Collection/Tithe',
        'doa-syafaat': currentLanguage === 'id' ? 'Doa Syafaat' : 'Intercession',
        'pembicara': currentLanguage === 'id' ? 'Pembicara' : 'Speaker',
        'multimedia': 'Multimedia',
        'lighting-sound': currentLanguage === 'id' ? 'Lighting & Sound System' : 'Lighting & Sound System',
        'usher': 'Usher'
    };
    
    container.innerHTML = data.assignments.map(a => {
        const volunteer = data.volunteers.find(v => v.id === a.volunteerId);
        const event = data.events.find(e => e.id === a.eventId);
        
        let volunteerName;
        let volunteerArea;
        if (volunteer) {
            if (volunteer.memberId) {
                const member = data.members.find(m => m.id === volunteer.memberId);
                volunteerName = member ? member.nama : 'Unknown';
            } else {
                volunteerName = volunteer.externalNama || 'Unknown';
            }
            // Display custom area if "lainnya" is selected
            volunteerArea = volunteer.area === 'lainnya' && volunteer.customArea ? volunteer.customArea : (areaLabels[volunteer.area] || volunteer.area);
        } else {
            volunteerName = 'Unknown';
            volunteerArea = '-';
        }
        
        return `
            <div class="assignment-item" style="padding: 15px; background: var(--card-bg); border-radius: var(--radius-sm); margin-bottom: 10px; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <p style="font-weight: 600; margin-bottom: 5px;">${volunteerName}</p>
                        <p style="font-size: 12px; color: var(--primary-color); margin-bottom: 5px;">${volunteerArea}</p>
                        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 5px;">${event ? event.nama : 'Unknown Event'}</p>
                        <p style="font-size: 13px;">
                            <i class="fas fa-calendar"></i> ${formatDate(a.tanggal)} | 
                            <i class="fas fa-clock"></i> ${a.waktu} | 
                            <i class="fas fa-map-marker-alt"></i> ${a.tempat}
                        </p>
                        <p style="font-size: 13px; margin-top: 8px; padding: 8px; background: var(--dark-bg); border-radius: var(--radius-sm);">${a.tugas || 'Tidak ada deskripsi'}</p>
                    </div>
                    ${isViewOnly() ? '' : `
                        <button class="btn-action btn-delete" onclick="deleteAssignment(${a.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('') || `<p class="text-center" style="padding: 20px; color: var(--text-muted);">${getLang('no-data') || 'Tidak ada data'}</p>`;
}

function showAddAssignmentModal() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah penugasan' : 'You do not have permission to add assignments', 'error');
        return;
    }
    
    editingAssignmentId = null;
    document.getElementById('form-assignment').reset();
    document.getElementById('assignment-id').value = '';
    
    // Populate volunteer select
    populateAssignmentVolunteerSelect();
    
    // Populate event select
    populateAssignmentEventSelect();
    
    openModal('modal-assignment');
}

function editAssignment(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk mengedit data' : 'You do not have permission to edit data', 'error');
        return;
    }
    
    const data = getData();
    const assignment = data.assignments.find(a => a.id === id);
    
    if (assignment) {
        editingAssignmentId = id;
        document.getElementById('assignment-id').value = assignment.id;
        populateAssignmentVolunteerSelect(assignment.volunteerId);
        populateAssignmentEventSelect(assignment.eventId);
        document.getElementById('assignment-tanggal').value = assignment.tanggal;
        document.getElementById('assignment-waktu').value = assignment.waktu;
        document.getElementById('assignment-tempat').value = assignment.tempat;
        document.getElementById('assignment-tugas').value = assignment.tugas || '';
        document.getElementById('assignment-catatan').value = assignment.catatan || '';
        openModal('modal-assignment');
    }
}

function saveAssignment(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menyimpan data' : 'You do not have permission to save data', 'error');
        return;
    }
    
    const data = getData();
    const assignmentData = {
        volunteerId: parseInt(document.getElementById('assignment-volunteer').value),
        eventId: parseInt(document.getElementById('assignment-event').value),
        tanggal: document.getElementById('assignment-tanggal').value,
        waktu: document.getElementById('assignment-waktu').value,
        tempat: document.getElementById('assignment-tempat').value,
        tugas: document.getElementById('assignment-tugas').value,
        catatan: document.getElementById('assignment-catatan').value,
        status: 'assigned'
    };
    
    if (editingAssignmentId) {
        const index = data.assignments.findIndex(a => a.id === editingAssignmentId);
        if (index !== -1) {
            data.assignments[index] = { ...data.assignments[index], ...assignmentData };
            showToast(currentLanguage === 'id' ? 'Penugasan berhasil diupdate' : 'Assignment updated successfully', 'success');
        }
    } else {
        const newId = Math.max(...data.assignments.map(a => a.id), 0) + 1;
        data.assignments.push({ id: newId, ...assignmentData });
        showToast(currentLanguage === 'id' ? 'Penugasan berhasil ditambahkan' : 'Assignment added successfully', 'success');
    }
    
    saveData(data);
    closeModal('modal-assignment');
    renderAssignmentsList();
    initDashboard();
}

function deleteAssignment(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus data' : 'You do not have permission to delete data', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus penugasan ini?' : 'Are you sure you want to delete this assignment?', () => {
        const data = getData();
        const index = data.assignments.findIndex(a => a.id === id);
        
        if (index !== -1) {
            data.assignments.splice(index, 1);
            saveData(data);
            renderAssignmentsList();
            showToast(currentLanguage === 'id' ? 'Penugasan berhasil dihapus' : 'Assignment deleted successfully', 'success');
        }
    });
}

function populateAssignmentVolunteerSelect(selectedId = null) {
    const data = getData();
    const select = document.getElementById('assignment-volunteer');
    
    const areaLabels = {
        'guru-sekolah-minggu': currentLanguage === 'id' ? 'Guru Sekolah Minggu' : 'Sunday School Teacher',
        'singer': 'Singer',
        'worship-leader': currentLanguage === 'id' ? 'Worship Leader' : 'Worship Leader',
        'pemain-musik': currentLanguage === 'id' ? 'Pemain Musik' : 'Musician',
        'penari': currentLanguage === 'id' ? 'Penari' : 'Dancer',
        'kolektan': currentLanguage === 'id' ? 'Kolektan/Perpuluhan' : 'Collection/Tithe',
        'doa-syafaat': currentLanguage === 'id' ? 'Doa Syafaat' : 'Intercession',
        'pembicara': currentLanguage === 'id' ? 'Pembicara' : 'Speaker',
        'multimedia': 'Multimedia',
        'lighting-sound': currentLanguage === 'id' ? 'Lighting & Sound System' : 'Lighting & Sound System',
        'usher': 'Usher'
    };
    
    select.innerHTML = `<option value="">${getLang('select-volunteer')}</option>` +
        data.volunteers.filter(v => v.status === 'aktif').map(v => {
            let nama;
            if (v.memberId) {
                const member = data.members.find(m => m.id === v.memberId);
                nama = member ? member.nama : 'Unknown';
            } else {
                nama = v.externalNama || 'Unknown';
            }
            // Display custom area if "lainnya" is selected
            const areaDisplay = v.area === 'lainnya' && v.customArea ? v.customArea : (areaLabels[v.area] || v.area);
            return `<option value="${v.id}" ${v.id == selectedId ? 'selected' : ''}>${nama} - ${areaDisplay}</option>`;
        }).join('');
}

function populateAssignmentEventSelect(selectedId = null) {
    const data = getData();
    const select = document.getElementById('assignment-event');
    
    select.innerHTML = `<option value="">${getLang('select-event')}</option>` +
        data.events.filter(e => e.status === 'upcoming' || e.status === 'ongoing').map(e => 
            `<option value="${e.id}" ${e.id == selectedId ? 'selected' : ''}>${e.nama} - ${formatDate(e.start)}</option>`
        ).join('');
}

// ========================================
// COMMUNICATION
// ========================================

function initCommunication() {
    renderContactsList();
    renderAnnouncementsList();
}

function showVolunteersTab(tab, clickedBtn) {
    document.querySelectorAll('.volunteers-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.volunteers-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`volunteers-${tab}`).classList.add('active');
    
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    } else {
        const buttons = document.querySelectorAll('.volunteers-tabs .tab-btn');
        buttons.forEach(btn => {
            if (btn.getAttribute('onclick').includes(`'${tab}'`)) {
                btn.classList.add('active');
            }
        });
    }
}

function showCommunicationTab(tab, clickedBtn) {
    document.querySelectorAll('.communication-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.communication-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`communication-${tab}`).classList.add('active');
    
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    } else {
        const buttons = document.querySelectorAll('.communication-tabs .tab-btn');
        buttons.forEach(btn => {
            if (btn.getAttribute('onclick').includes(`'${tab}'`)) {
                btn.classList.add('active');
            }
        });
    }
}

function renderContactsList() {
    const data = getData();
    const container = document.getElementById('contacts-list');
    
    container.innerHTML = data.members.filter(m => m.status === 'aktif').map(m => `
        <div class="contact-item" onclick="openChat(${m.id})">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama)}&background=ff6b00&color=fff&size=40" alt="">
            <div class="contact-info">
                <h4>${m.nama}</h4>
                <p>${m.email}</p>
            </div>
        </div>
    `).join('') || `<p class="text-center" style="padding: 20px; color: var(--text-muted);">${getLang('no-data') || 'Tidak ada data'}</p>`;
}

function openChat(memberId) {
    currentChatId = memberId;
    const data = getData();
    const member = data.members.find(m => m.id === memberId);
    
    if (!member) return;
    
    document.getElementById('chat-header').innerHTML = `
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.nama)}&background=ff6b00&color=fff&size=40" alt="">
        <div>
            <h4>${member.nama}</h4>
            <p class="status online">Online</p>
        </div>
    `;
    
    document.getElementById('chat-input').style.display = 'flex';
    renderChatMessages();
}

function renderChatMessages() {
    const data = getData();
    const container = document.getElementById('chat-messages');
    
    if (!currentChatId) return;
    
    const messages = data.messages.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === currentChatId) ||
        (m.senderId === currentChatId && m.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    container.innerHTML = messages.map(m => {
        const isMe = m.senderId === currentUser.id;
        return `
            <div class="message ${isMe ? 'sent' : 'received'}">
                <p>${m.content}</p>
                <span class="message-time">${formatTime(m.timestamp)}</span>
            </div>
        `;
    }).join('') || `<p class="text-center" style="padding: 20px; color: var(--text-muted);">${currentLanguage === 'id' ? 'Mulai percakapan' : 'Start a conversation'}</p>`;
    
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('message-text');
    const content = input.value.trim();
    
    if (!content || !currentChatId) return;
    
    const data = getData();
    data.messages.push({
        id: Date.now(),
        senderId: currentUser.id,
        receiverId: currentChatId,
        content: content,
        timestamp: new Date().toISOString(),
        read: false
    });
    
    saveData(data);
    input.value = '';
    renderChatMessages();
}

function renderAnnouncementsList() {
    const data = getData();
    const container = document.getElementById('announcements-list');
    
    const sorted = [...data.announcements].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    container.innerHTML = sorted.map(a => {
        const deleteButton = isViewOnly() ? '' : `<button class="btn-action btn-delete" onclick="deleteAnnouncement(${a.id})"><i class="fas fa-trash"></i></button>`;
        
        return `
            <div class="announcement-item ${a.important ? 'important' : ''}">
                <div class="announcement-header">
                    <h4>${a.judul} ${a.important ? '<span class="badge badge-danger">Important</span>' : ''}</h4>
                    <span class="announcement-date">${formatDate(a.tanggal)}</span>
                </div>
                <p>${a.konten}</p>
                <div class="announcement-footer">
                    <span>${currentLanguage === 'id' ? 'Valid sampai' : 'Valid until'}: ${formatDate(a.expiry)}</span>
                    ${deleteButton}
                </div>
            </div>
        `;
    }).join('') || `<p class="text-center" style="padding: 20px; color: var(--text-muted);">${getLang('no-data') || 'Tidak ada data'}</p>`;
    
    // Hide add button for view-only users
    const addButton = document.querySelector('#communication-announcements .action-buttons .btn-primary');
    if (addButton) {
        addButton.style.display = isViewOnly() ? 'none' : 'inline-flex';
    }
}

function showAddAnnouncementModal() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah pengumuman' : 'You do not have permission to add announcements', 'error');
        return;
    }
    document.getElementById('form-announcement').reset();
    openModal('modal-announcement');
}

function saveAnnouncement(e) {
    e.preventDefault();
    
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menyimpan data' : 'You do not have permission to save data', 'error');
        return;
    }
    
    const data = getData();
    const newAnnouncement = {
        id: Date.now(),
        judul: document.getElementById('announcement-judul').value,
        konten: document.getElementById('announcement-konten').value,
        tanggal: new Date().toISOString().split('T')[0],
        expiry: document.getElementById('announcement-expiry').value,
        important: document.getElementById('announcement-important').checked,
        authorId: currentUser.id
    };
    
    data.announcements.push(newAnnouncement);
    saveData(data);
    
    closeModal('modal-announcement');
    renderAnnouncementsList();
    showToast(currentLanguage === 'id' ? 'Pengumuman berhasil dipublikasikan' : 'Announcement published successfully', 'success');
}

function deleteAnnouncement(id) {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menghapus data' : 'You do not have permission to delete data', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus pengumuman ini?' : 'Are you sure you want to delete this announcement?', () => {
        const data = getData();
        const index = data.announcements.findIndex(a => a.id === id);
        
        if (index !== -1) {
            data.announcements.splice(index, 1);
            saveData(data);
            renderAnnouncementsList();
            showToast(currentLanguage === 'id' ? 'Pengumuman berhasil dihapus' : 'Announcement deleted successfully', 'success');
        }
    });
}

function sendBroadcast() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk mengirim broadcast' : 'You do not have permission to send broadcast', 'error');
        return;
    }
    
    const subject = document.getElementById('broadcast-subject').value;
    const message = document.getElementById('broadcast-message').value;
    
    if (!subject || !message) {
        showToast(currentLanguage === 'id' ? 'Isi subjek dan pesan' : 'Fill in subject and message', 'error');
        return;
    }
    
    showToast(currentLanguage === 'id' ? 'Broadcast berhasil dikirim!' : 'Broadcast sent successfully!', 'success');
    document.getElementById('broadcast-subject').value = '';
    document.getElementById('broadcast-message').value = '';
}

function saveBroadcastDraft() {
    showToast(currentLanguage === 'id' ? 'Draft disimpan' : 'Draft saved', 'success');
}

function refreshContacts() {
    renderContactsList();
    showToast(currentLanguage === 'id' ? 'Kontak diperbarui' : 'Contacts updated', 'success');
}

function searchContacts(query) {
    const data = getData();
    const container = document.getElementById('contacts-list');
    
    const filtered = data.members.filter(m => 
        m.status === 'aktif' && 
        (m.nama.toLowerCase().includes(query.toLowerCase()) || 
         m.email.toLowerCase().includes(query.toLowerCase()))
    );
    
    container.innerHTML = filtered.map(m => `
        <div class="contact-item" onclick="openChat(${m.id})">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama)}&background=ff6b00&color=fff&size=40" alt="">
            <div class="contact-info">
                <h4>${m.nama}</h4>
                <p>${m.email}</p>
            </div>
        </div>
    `).join('');
}

// ========================================
// REPORTS
// ========================================

function initReports() {
    document.getElementById('report-preview').classList.add('hidden');
}

function generateReport(type) {
    const data = getData();
    const preview = document.getElementById('report-preview');
    const content = document.getElementById('preview-content');
    const title = document.getElementById('preview-title');
    
    let reportHTML = '';
    
    switch(type) {
        case 'members':
            title.textContent = currentLanguage === 'id' ? 'Laporan Jemaat' : 'Members Report';
            reportHTML = generateMembersReport(data);
            break;
        case 'attendance':
            title.textContent = currentLanguage === 'id' ? 'Laporan Kehadiran' : 'Attendance Report';
            reportHTML = generateAttendanceReport(data);
            break;
        case 'donations':
            title.textContent = currentLanguage === 'id' ? 'Laporan Donasi' : 'Donations Report';
            reportHTML = generateDonationsReport(data);
            break;
        case 'system':
            title.textContent = currentLanguage === 'id' ? 'Statistik Sistem' : 'System Statistics';
            reportHTML = generateSystemReport(data);
            break;
    }
    
    content.innerHTML = reportHTML;
    preview.classList.remove('hidden');
}

function generateMembersReport(data) {
    const activeMembers = data.members.filter(m => m.status === 'aktif').length;
    const inactiveMembers = data.members.filter(m => m.status === 'tidak-aktif').length;
    const maleMembers = data.members.filter(m => m.jk === 'Laki-laki').length;
    const femaleMembers = data.members.filter(m => m.jk === 'Perempuan').length;
    
    // Hide personal data for view-only users
    const isUser = isViewOnly();
    
    return `
        <div class="report-section">
            <h3>${currentLanguage === 'id' ? 'Ringkasan Jemaat' : 'Members Summary'}</h3>
            <div class="report-stats">
                <div class="stat-box"><h4>${data.members.length}</h4><p>${currentLanguage === 'id' ? 'Total Jemaat' : 'Total Members'}</p></div>
                <div class="stat-box"><h4>${activeMembers}</h4><p>${currentLanguage === 'id' ? 'Aktif' : 'Active'}</p></div>
                <div class="stat-box"><h4>${inactiveMembers}</h4><p>${currentLanguage === 'id' ? 'Tidak Aktif' : 'Inactive'}</p></div>
                <div class="stat-box"><h4>${maleMembers}</h4><p>${currentLanguage === 'id' ? 'Laki-laki' : 'Male'}</p></div>
                <div class="stat-box"><h4>${femaleMembers}</h4><p>${currentLanguage === 'id' ? 'Perempuan' : 'Female'}</p></div>
            </div>
        </div>
        <div class="report-section">
            <h3>${currentLanguage === 'id' ? 'Daftar Jemaat' : 'Members List'}</h3>
            <table class="report-table">
                <thead>
                    <tr><th>${getLang('name')}</th>${isUser ? '' : `<th>${getLang('email')}</th><th>${getLang('phone')}</th>`}<th>${getLang('gender')}</th><th>${getLang('status')}</th></tr>
                </thead>
                <tbody>
                    ${data.members.map(m => `
                        <tr><td>${m.nama}</td>${isUser ? '' : `<td>${m.email}</td><td>${m.telepon}</td>`}<td>${m.jk}</td><td>${m.status}</td></tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generateAttendanceReport(data) {
    const totalAttendance = data.attendance.length;
    const uniqueEvents = new Set(data.attendance.map(a => a.eventId)).size;
    const averagePerEvent = uniqueEvents > 0 ? Math.round(totalAttendance / uniqueEvents) : 0;
    
    return `
        <div class="report-section">
            <h3>${currentLanguage === 'id' ? 'Ringkasan Kehadiran' : 'Attendance Summary'}</h3>
            <div class="report-stats">
                <div class="stat-box"><h4>${totalAttendance}</h4><p>${currentLanguage === 'id' ? 'Total Kehadiran' : 'Total Attendance'}</p></div>
                <div class="stat-box"><h4>${uniqueEvents}</h4><p>${currentLanguage === 'id' ? 'Event' : 'Events'}</p></div>
                <div class="stat-box"><h4>${averagePerEvent}</h4><p>${currentLanguage === 'id' ? 'Rata-rata/Event' : 'Average/Event'}</p></div>
            </div>
        </div>
        <div class="report-section">
            <h3>${currentLanguage === 'id' ? 'Data Kehadiran' : 'Attendance Data'}</h3>
            <table class="report-table">
                <thead>
                    <tr><th>${getLang('date')}</th><th>${getLang('event')}</th><th>${getLang('name')}</th><th>${getLang('checkin-time')}</th></tr>
                </thead>
                <tbody>
                    ${data.attendance.map(a => {
                        const member = data.members.find(m => m.id === a.memberId);
                        const event = data.events.find(e => e.id === a.eventId);
                        return `<tr><td>${a.tanggal}</td><td>${event ? event.nama : '-'}</td><td>${member ? member.nama : '-'}</td><td>${a.waktu}</td></tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generateDonationsReport(data) {
    const total = data.donations.reduce((sum, d) => sum + d.jumlah, 0);
    const uniqueDonors = new Set(data.donations.map(d => d.donorId)).size;
    const average = data.donations.length > 0 ? Math.round(total / data.donations.length) : 0;
    
    const byType = {};
    data.donations.forEach(d => {
        byType[d.tipe] = (byType[d.tipe] || 0) + d.jumlah;
    });
    
    return `
        <div class="report-section">
            <h3>${currentLanguage === 'id' ? 'Ringkasan Donasi' : 'Donations Summary'}</h3>
            <div class="report-stats">
                <div class="stat-box"><h4>${formatRupiah(total)}</h4><p>${currentLanguage === 'id' ? 'Total' : 'Total'}</p></div>
                <div class="stat-box"><h4>${uniqueDonors}</h4><p>${currentLanguage === 'id' ? 'Donor' : 'Donors'}</p></div>
                <div class="stat-box"><h4>${formatRupiah(average)}</h4><p>${currentLanguage === 'id' ? 'Rata-rata' : 'Average'}</p></div>
            </div>
        </div>
        <div class="report-section">
            <h3>${currentLanguage === 'id' ? 'Donasi per Tipe' : 'Donations by Type'}</h3>
            ${Object.entries(byType).map(([type, amount]) => `
                <div class="report-stat-row"><span>${type}</span><strong>${formatRupiah(amount)}</strong></div>
            `).join('')}
        </div>
        <div class="report-section">
            <h3>${currentLanguage === 'id' ? 'Daftar Donasi' : 'Donations List'}</h3>
            <table class="report-table">
                <thead>
                    <tr><th>${getLang('date')}</th><th>${getLang('donor')}</th><th>${getLang('type')}</th><th>${getLang('amount')}</th></tr>
                </thead>
                <tbody>
                    ${data.donations.map(d => {
                        const donor = data.members.find(m => m.id === d.donorId);
                        return `<tr><td>${d.tanggal}</td><td>${donor ? donor.nama : 'Anonymous'}</td><td>${d.tipe}</td><td>${formatRupiah(d.jumlah)}</td></tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generateSystemReport(data) {
    return `
        <div class="report-section">
            <h3>${currentLanguage === 'id' ? 'Overview Sistem' : 'System Overview'}</h3>
            <div class="report-stats">
                <div class="stat-box"><h4>${data.members.length}</h4><p>${currentLanguage === 'id' ? 'Jemaat' : 'Members'}</p></div>
                <div class="stat-box"><h4>${data.families.length}</h4><p>${currentLanguage === 'id' ? 'Keluarga' : 'Families'}</p></div>
                <div class="stat-box"><h4>${data.groups.length}</h4><p>${currentLanguage === 'id' ? 'Groups' : 'Groups'}</p></div>
                <div class="stat-box"><h4>${data.events.length}</h4><p>${currentLanguage === 'id' ? 'Events' : 'Events'}</p></div>
                <div class="stat-box"><h4>${data.volunteers.length}</h4><p>${currentLanguage === 'id' ? 'Relawan' : 'Volunteers'}</p></div>
                <div class="stat-box"><h4>${data.users.length}</h4><p>${currentLanguage === 'id' ? 'Users' : 'Users'}</p></div>
            </div>
        </div>
    `;
}

function closeReportPreview() {
    document.getElementById('report-preview').classList.add('hidden');
}

function printReport() {
    window.print();
}

// ========================================
// EXPORT SYSTEM
// ========================================

function toggleExportMenu(type) {
    const menu = document.getElementById(`export-menu-${type}`);
    if (menu) {
        menu.classList.toggle('show');
    }
}

function exportData(type, format) {
    const data = getData();
    let exportData = [];
    let filename = '';
    
    switch(type) {
        case 'members':
            exportData = data.members.map(m => ({
                'Nama': m.nama,
                'Email': m.email,
                'Telepon': m.telepon,
                'Gender': m.jk,
                'Status': m.status,
                'Alamat': m.alamat,
                'Kota': m.kota
            }));
            filename = 'members';
            break;
        case 'attendance':
            exportData = data.attendance.map(a => {
                const member = data.members.find(m => m.id === a.memberId);
                const event = data.events.find(e => e.id === a.eventId);
                return {
                    'Tanggal': a.tanggal,
                    'Event': event ? event.nama : '-',
                    'Nama': member ? member.nama : '-',
                    'Waktu': a.waktu
                };
            });
            filename = 'attendance';
            break;
        case 'donations':
            exportData = data.donations.map(d => {
                const donor = data.members.find(m => m.id === d.donorId);
                return {
                    'Tanggal': d.tanggal,
                    'Donatur': donor ? donor.nama : 'Anonymous',
                    'Tipe': d.tipe,
                    'Jumlah': d.jumlah,
                    'Keterangan': d.keterangan || '-'
                };
            });
            filename = 'donations';
            break;
    }
    
    switch(format) {
        case 'csv':
            exportToCSV(exportData, filename);
            break;
        case 'xls':
            exportToXLS(exportData, filename);
            break;
        case 'pdf':
            exportToPDF(exportData, filename);
            break;
        case 'docx':
            exportToDOCX(exportData, filename);
            break;
        case 'txt':
            exportToTXT(exportData, filename);
            break;
    }
    
    // Close export menu
    document.querySelectorAll('.export-menu').forEach(m => m.classList.remove('show'));
}

function saveReportAs(format) {
    const content = document.getElementById('preview-content').innerText;
    const title = document.getElementById('preview-title').textContent;
    const data = getData();
    
    // Determine report type from title
    let reportType = '';
    if (title.includes('Jemaat') || title.includes('Members')) reportType = 'members';
    else if (title.includes('Kehadiran') || title.includes('Attendance')) reportType = 'attendance';
    else if (title.includes('Donasi') || title.includes('Donations')) reportType = 'donations';
    
    switch(format) {
        case 'pdf':
            exportTextToPDF(content, title);
            break;
        case 'docx':
            exportTextToDOCX(content, title);
            break;
        case 'txt':
            downloadFile(content, `${title}.txt`, 'text/plain');
            break;
        case 'csv':
            exportReportCSV(reportType, data);
            break;
        case 'xls':
            exportReportXLS(reportType, data);
            break;
    }
}

function exportReportCSV(reportType, data) {
    let exportData = [];
    let filename = '';
    
    switch(reportType) {
        case 'members':
            exportData = data.members.map(m => ({
                'Nama': m.nama,
                'Email': m.email,
                'Telepon': m.telepon,
                'Gender': m.jk,
                'Status': m.status,
                'Alamat': m.alamat,
                'Kota': m.kota
            }));
            filename = 'laporan-jemaat';
            break;
        case 'attendance':
            exportData = data.attendance.map(a => {
                const member = data.members.find(m => m.id === a.memberId);
                const event = data.events.find(e => e.id === a.eventId);
                return {
                    'Tanggal': a.tanggal,
                    'Event': event ? event.nama : '-',
                    'Nama': member ? member.nama : '-',
                    'Waktu': a.waktu,
                    'Status': a.status
                };
            });
            filename = 'laporan-kehadiran';
            break;
        case 'donations':
            exportData = data.donations.map(d => {
                const donor = data.members.find(m => m.id === d.donorId);
                return {
                    'Tanggal': d.tanggal,
                    'Donatur': donor ? donor.nama : 'Anonymous',
                    'Tipe': d.tipe,
                    'Jumlah': d.jumlah,
                    'Keterangan': d.keterangan || '-'
                };
            });
            filename = 'laporan-donasi';
            break;
        default:
            showToast(currentLanguage === 'id' ? 'Tipe report tidak dikenali' : 'Unknown report type', 'warning');
            return;
    }
    
    exportToCSV(exportData, filename);
}

function exportReportXLS(reportType, data) {
    let exportData = [];
    let filename = '';
    
    switch(reportType) {
        case 'members':
            exportData = data.members.map(m => ({
                'Nama': m.nama,
                'Email': m.email,
                'Telepon': m.telepon,
                'Gender': m.jk,
                'Status': m.status,
                'Alamat': m.alamat,
                'Kota': m.kota
            }));
            filename = 'laporan-jemaat';
            break;
        case 'attendance':
            exportData = data.attendance.map(a => {
                const member = data.members.find(m => m.id === a.memberId);
                const event = data.events.find(e => e.id === a.eventId);
                return {
                    'Tanggal': a.tanggal,
                    'Event': event ? event.nama : '-',
                    'Nama': member ? member.nama : '-',
                    'Waktu': a.waktu,
                    'Status': a.status
                };
            });
            filename = 'laporan-kehadiran';
            break;
        case 'donations':
            exportData = data.donations.map(d => {
                const donor = data.members.find(m => m.id === d.donorId);
                return {
                    'Tanggal': d.tanggal,
                    'Donatur': donor ? donor.nama : 'Anonymous',
                    'Tipe': d.tipe,
                    'Jumlah': d.jumlah,
                    'Keterangan': d.keterangan || '-'
                };
            });
            filename = 'laporan-donasi';
            break;
        default:
            showToast(currentLanguage === 'id' ? 'Tipe report tidak dikenali' : 'Unknown report type', 'warning');
            return;
    }
    
    exportToXLS(exportData, filename);
}

function exportToCSV(data, filename) {
    if (data.length === 0) {
        showToast(currentLanguage === 'id' ? 'Tidak ada data untuk diexport' : 'No data to export', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    downloadFile('\uFEFF' + csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
    showToast(currentLanguage === 'id' ? 'CSV berhasil diunduh' : 'CSV downloaded successfully', 'success');
}

function exportToXLS(data, filename) {
    if (data.length === 0) {
        showToast(currentLanguage === 'id' ? 'Tidak ada data untuk diexport' : 'No data to export', 'warning');
        return;
    }
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
    showToast(currentLanguage === 'id' ? 'Excel berhasil diunduh' : 'Excel downloaded successfully', 'success');
}

function exportToPDF(data, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(filename.toUpperCase(), 14, 20);
    
    let y = 35;
    data.forEach((row, i) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(10);
        Object.entries(row).forEach(([key, value], j) => {
            doc.text(`${key}: ${value}`, 14, y + (i * 5) + (j * 5));
        });
        y += Object.keys(row).length * 5 + 5;
    });
    
    doc.save(`${filename}.pdf`);
    showToast(currentLanguage === 'id' ? 'PDF berhasil diunduh' : 'PDF downloaded successfully', 'success');
}

function exportTextToPDF(text, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(filename, 14, 20);
    
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 14, 35);
    
    doc.save(`${filename}.pdf`);
    showToast(currentLanguage === 'id' ? 'PDF berhasil diunduh' : 'PDF downloaded successfully', 'success');
}

function exportToDOCX(data, filename) {
    // Simple HTML-based DOCX export
    let html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${filename}</title></head>
        <body>
        <h1>${filename}</h1>
        <table border="1">
    `;
    
    if (data.length > 0) {
        html += '<tr>' + Object.keys(data[0]).map(h => `<th>${h}</th>`).join('') + '</tr>';
        html += data.map(row => '<tr>' + Object.values(row).map(v => `<td>${v}</td>`).join('') + '</tr>').join('');
    }
    
    html += '</table></body></html>';
    
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(currentLanguage === 'id' ? 'Word berhasil diunduh' : 'Word downloaded successfully', 'success');
}

function exportTextToDOCX(text, filename) {
    const html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${filename}</title></head>
        <body><h1>${filename}</h1><pre>${text}</pre></body></html>
    `;
    
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(currentLanguage === 'id' ? 'Word berhasil diunduh' : 'Word downloaded successfully', 'success');
}

function exportToTXT(data, filename) {
    if (data.length === 0) {
        showToast(currentLanguage === 'id' ? 'Tidak ada data untuk diexport' : 'No data to export', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const lines = [
        headers.join('\t'),
        ...data.map(row => headers.map(h => row[h] || '').join('\t'))
    ];
    
    downloadFile(lines.join('\n'), `${filename}.txt`, 'text/plain');
    showToast(currentLanguage === 'id' ? 'TXT berhasil diunduh' : 'TXT downloaded successfully', 'success');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ========================================
// USER MANAGEMENT
// ========================================

function renderUsersGrid() {
    const data = getData();
    const container = document.getElementById('users-grid');
    if (!container) return;
    
    const searchTerm = document.getElementById('search-users')?.value?.toLowerCase() || '';
    
    const filtered = data.users.filter(u => 
        u.nama.toLowerCase().includes(searchTerm) || 
        u.username.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
    );
    
    const roleLabels = {
        'superadmin': currentLanguage === 'id' ? 'Super Admin' : 'Super Admin',
        'admin': currentLanguage === 'id' ? 'Admin' : 'Admin',
        'user': currentLanguage === 'id' ? 'User (View Only)' : 'User (View Only)'
    };
    
    const roleColors = {
        'superadmin': 'danger',
        'admin': 'warning',
        'user': 'info'
    };
    
    container.innerHTML = filtered.map(u => `
        <div class="user-card">
            <div class="card-header-section">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(u.nama)}&background=ff6b00&color=fff&size=50" class="card-avatar-img" alt="">
                <div class="card-title">
                    <h4>${u.nama}</h4>
                    <p>@${u.username}</p>
                </div>
            </div>
            <div class="card-info">
                <div class="info-row"><i class="fas fa-envelope"></i> ${u.email}</div>
                <div class="info-row"><i class="fas fa-shield-alt"></i> <span class="badge badge-${roleColors[u.role] || 'secondary'}">${roleLabels[u.role] || u.role}</span></div>
                <div class="info-row"><i class="fas fa-circle"></i> <span class="badge badge-${u.status === 'aktif' ? 'success' : 'secondary'}">${u.status === 'aktif' ? (currentLanguage === 'id' ? 'Aktif' : 'Active') : (currentLanguage === 'id' ? 'Nonaktif' : 'Inactive')}</span></div>
            </div>
            <div class="card-footer-actions">
                <button class="btn btn-secondary btn-sm" onclick="editUser(${u.id})"><i class="fas fa-edit"></i> ${currentLanguage === 'id' ? 'Edit' : 'Edit'}</button>
                ${u.id !== 1 ? `<button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i> ${currentLanguage === 'id' ? 'Hapus' : 'Delete'}</button>` : ''}
            </div>
        </div>
    `).join('') || `<p class="text-center" style="grid-column: 1/-1; color: var(--text-muted); padding: 30px;">${currentLanguage === 'id' ? 'Belum ada user' : 'No users yet'}</p>`;
}

function searchUsers() {
    renderUsersGrid();
}

function showAddUserModal() {
    editingUserId = null;
    document.getElementById('modal-user-title').textContent = currentLanguage === 'id' ? 'Tambah User Baru' : 'Add New User';
    
    // Reset all form fields
    document.getElementById('user-id').value = '';
    document.getElementById('user-nama').value = '';
    document.getElementById('user-username').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-role').value = 'admin';
    
    // Show password required indicator
    const passwordRequired = document.getElementById('password-required');
    if (passwordRequired) {
        passwordRequired.style.display = 'inline';
    }
    
    // Make password required for new user
    document.getElementById('user-password').required = true;
    
    // Add placeholder hint
    document.getElementById('user-password').placeholder = currentLanguage === 'id' ? 'Masukkan password (min 4 karakter)' : 'Enter password (min 4 characters)';
    
    openModal('modal-user');
}

function editUser(id) {
    const data = getData();
    const user = data.users.find(u => u.id === id);
    
    if (!user) {
        showToast(currentLanguage === 'id' ? 'User tidak ditemukan' : 'User not found', 'error');
        return;
    }
    
    editingUserId = id;
    document.getElementById('modal-user-title').textContent = currentLanguage === 'id' ? 'Edit User: ' + user.nama : 'Edit User: ' + user.nama;
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-nama').value = user.nama;
    document.getElementById('user-username').value = user.username;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role').value = user.role;
    
    // Hide password required indicator for edit
    const passwordRequired = document.getElementById('password-required');
    if (passwordRequired) {
        passwordRequired.style.display = 'none';
    }
    
    // Password not required for edit
    document.getElementById('user-password').required = false;
    document.getElementById('user-password').value = '';
    document.getElementById('user-password').placeholder = currentLanguage === 'id' ? 'Kosongkan jika tidak ingin mengubah' : 'Leave blank to keep current password';
    
    openModal('modal-user');
}

function saveUser(e) {
    e.preventDefault();
    
    // Get form values
    const nama = document.getElementById('user-nama').value.trim();
    const username = document.getElementById('user-username').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const role = document.getElementById('user-role').value;
    const password = document.getElementById('user-password').value;
    
    // Validation
    if (!nama || !username || !email || !role) {
        showToast(currentLanguage === 'id' ? 'Semua field wajib diisi' : 'All fields are required', 'error');
        return;
    }
    
    const data = getData();
    
    // Check for duplicate username (only for new users)
    if (!editingUserId) {
        const existingUser = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            showToast(currentLanguage === 'id' ? 'Username sudah digunakan' : 'Username already exists', 'error');
            return;
        }
        
        // Check for duplicate email
        const existingEmail = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingEmail) {
            showToast(currentLanguage === 'id' ? 'Email sudah digunakan' : 'Email already exists', 'error');
            return;
        }
        
        // Password required for new user
        if (!password || password.length < 4) {
            showToast(currentLanguage === 'id' ? 'Password minimal 4 karakter' : 'Password must be at least 4 characters', 'error');
            return;
        }
    }
    
    const userData = {
        nama: nama,
        username: username,
        email: email,
        role: role,
        status: 'aktif'
    };
    
    if (editingUserId) {
        // Edit existing user
        const index = data.users.findIndex(u => u.id === editingUserId);
        if (index !== -1) {
            // Check if username changed and already exists
            if (username.toLowerCase() !== data.users[index].username.toLowerCase()) {
                const existingUser = data.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.id !== editingUserId);
                if (existingUser) {
                    showToast(currentLanguage === 'id' ? 'Username sudah digunakan' : 'Username already exists', 'error');
                    return;
                }
            }
            
            // Check if email changed and already exists
            if (email.toLowerCase() !== data.users[index].email.toLowerCase()) {
                const existingEmail = data.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== editingUserId);
                if (existingEmail) {
                    showToast(currentLanguage === 'id' ? 'Email sudah digunakan' : 'Email already exists', 'error');
                    return;
                }
            }
            
            // Update password only if provided
            if (password && password.length >= 4) {
                userData.password = password;
            } else if (password && password.length < 4) {
                showToast(currentLanguage === 'id' ? 'Password minimal 4 karakter' : 'Password must be at least 4 characters', 'error');
                return;
            } else {
                userData.password = data.users[index].password;
            }
            
            data.users[index] = { ...data.users[index], ...userData };
            saveData(data);
            closeModal('modal-user');
            renderUsersGrid();
            showToast(currentLanguage === 'id' ? 'User berhasil diupdate' : 'User updated successfully', 'success');
        }
    } else {
        // Add new user
        userData.password = password;
        const newId = Math.max(...data.users.map(u => u.id), 0) + 1;
        const newUser = { 
            id: newId, 
            ...userData, 
            avatar: null,
            lastLogin: null
        };
        data.users.push(newUser);
        saveData(data);
        closeModal('modal-user');
        renderUsersGrid();
        showToast(currentLanguage === 'id' ? 'User berhasil ditambahkan' : 'User added successfully', 'success');
    }
}

function deleteUser(id) {
    if (id === 1) {
        showToast(currentLanguage === 'id' ? 'Super Admin tidak dapat dihapus' : 'Super Admin cannot be deleted', 'error');
        return;
    }
    
    showConfirm(currentLanguage === 'id' ? 'Apakah Anda yakin ingin menghapus user ini?' : 'Are you sure you want to delete this user?', () => {
        const data = getData();
        const index = data.users.findIndex(u => u.id === id);
        
        if (index !== -1) {
            data.users.splice(index, 1);
            saveData(data);
            renderUsersGrid();
            showToast(currentLanguage === 'id' ? 'User berhasil dihapus' : 'User deleted successfully', 'success');
        }
    });
}

// ========================================
// NOTIFICATIONS
// ========================================

function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    dropdown.classList.toggle('show');
}

function renderNotifications() {
    const data = getData();
    const container = document.getElementById('notif-list');
    const badge = document.getElementById('notif-count');
    
    const unread = data.notifications.filter(n => !n.read);
    badge.textContent = unread.length;
    badge.style.display = unread.length > 0 ? 'flex' : 'none';
    
    const sorted = [...data.notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    container.innerHTML = sorted.map(n => `
        <div class="notif-item ${n.read ? 'read' : 'unread'}" onclick="markNotificationRead(${n.id})">
            <div class="notif-icon"><i class="fas fa-${getNotifIcon(n.type)}"></i></div>
            <div class="notif-content">
                <h4>${n.title}</h4>
                <p>${n.message}</p>
                <span>${timeAgo(n.timestamp)}</span>
            </div>
        </div>
    `).join('') || `<p class="text-center" style="padding: 20px; color: var(--text-muted);">${currentLanguage === 'id' ? 'Tidak ada notifikasi' : 'No notifications'}</p>`;
}

function getNotifIcon(type) {
    const icons = {
        member: 'user',
        donation: 'hand-holding-heart',
        event: 'calendar',
        attendance: 'clipboard-check',
        announcement: 'bullhorn',
        system: 'cog'
    };
    return icons[type] || 'bell';
}

function markNotificationRead(id) {
    const data = getData();
    const notif = data.notifications.find(n => n.id === id);
    if (notif) {
        notif.read = true;
        saveData(data);
        renderNotifications();
    }
}

function markAllRead() {
    const data = getData();
    data.notifications.forEach(n => n.read = true);
    saveData(data);
    renderNotifications();
}

// ========================================
// MODAL SYSTEM
// ========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Close export menus when clicking outside
    if (!event.target.closest('.export-dropdown')) {
        document.querySelectorAll('.export-menu').forEach(m => m.classList.remove('show'));
    }
    
    // Close notification dropdown
    if (!event.target.closest('.notifications')) {
        const notifDropdown = document.getElementById('notif-dropdown');
        if (notifDropdown) notifDropdown.classList.remove('show');
    }
};

// ========================================
// CONFIRM DIALOG
// ========================================

function showConfirm(message, onConfirm) {
    const modal = document.getElementById('modal-confirm');
    const messageEl = document.getElementById('confirm-message');
    const yesBtn = document.getElementById('confirm-yes');
    
    messageEl.textContent = message;
    
    // Remove old listeners
    const newYesBtn = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
    
    newYesBtn.onclick = function() {
        closeModal('modal-confirm');
        onConfirm();
    };
    
    openModal('modal-confirm');
}

// ========================================
// TOAST NOTIFICATION
// ========================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    
    icon.className = `fas ${icons[type]}`;
    icon.style.color = colors[type];
    msg.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

let notifications = [];
let unreadCount = 0;

// Load notifications from Firebase
async function loadNotifications() {
    console.log('[APP] loadNotifications START');
    
    try {
        if (isFirebaseReady() && window.getNotifications) {
            notifications = await window.getNotifications();
            unreadCount = notifications.filter(n => !n.read).length;
            updateNotificationBadge();
            renderNotifications();
            console.log(`[APP] Loaded ${notifications.length} notifications`);
        } else {
            // Fallback to localStorage
            const stored = localStorage.getItem('cmsNotifications');
            notifications = stored ? JSON.parse(stored) : [];
            unreadCount = notifications.filter(n => !n.read).length;
            updateNotificationBadge();
            renderNotifications();
        }
    } catch (error) {
        console.error('[APP] Error loading notifications:', error);
    }
}

// Add new notification
async function addNotification(title, message, type = 'info', userId = null) {
    console.log('[APP] addNotification START:', title);
    
    const notification = {
        title,
        message,
        type,
        userId,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    try {
        if (isFirebaseReady() && window.addNotification) {
            await window.addNotification(notification);
        } else {
            // Fallback to localStorage
            notifications.unshift(notification);
            localStorage.setItem('cmsNotifications', JSON.stringify(notifications));
        }
        
        // Reload notifications
        await loadNotifications();
        
        // Show toast
        showToast(message, type);
        
        return true;
    } catch (error) {
        console.error('[APP] Error adding notification:', error);
        return false;
    }
}

// Mark notification as read
async function markNotificationRead(notificationId) {
    console.log('[APP] markNotificationRead:', notificationId);
    
    try {
        if (isFirebaseReady() && window.markNotificationRead) {
            await window.markNotificationRead(notificationId);
        } else {
            // Fallback to localStorage
            const notif = notifications.find(n => n.id === notificationId || n.timestamp === notificationId);
            if (notif) {
                notif.read = true;
                localStorage.setItem('cmsNotifications', JSON.stringify(notifications));
            }
        }
        
        await loadNotifications();
        return true;
    } catch (error) {
        console.error('[APP] Error marking notification read:', error);
        return false;
    }
}

// Mark all notifications as read
async function markAllNotificationsRead() {
    console.log('[APP] markAllNotificationsRead');
    
    try {
        for (const notif of notifications) {
            if (!notif.read) {
                await markNotificationRead(notif.id || notif.timestamp);
            }
        }
        return true;
    } catch (error) {
        console.error('[APP] Error marking all notifications read:', error);
        return false;
    }
}

// Delete notification
async function deleteNotification(notificationId) {
    console.log('[APP] deleteNotification:', notificationId);
    
    try {
        if (isFirebaseReady() && window.deleteNotification) {
            await window.deleteNotification(notificationId);
        } else {
            // Fallback to localStorage
            notifications = notifications.filter(n => (n.id || n.timestamp) !== notificationId);
            localStorage.setItem('cmsNotifications', JSON.stringify(notifications));
        }
        
        await loadNotifications();
        return true;
    } catch (error) {
        console.error('[APP] Error deleting notification:', error);
        return false;
    }
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.getElementById('notif-count');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Render notifications in dropdown
function renderNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    if (!dropdown) return;
    
    if (notifications.length === 0) {
        dropdown.innerHTML = `
            <div class="notif-header">
                <span>${getLang('notifications') || 'Notifikasi'}</span>
            </div>
            <div class="notif-empty">
                <i class="fas fa-bell-slash"></i>
                <p>${currentLanguage === 'id' ? 'Tidak ada notifikasi' : 'No notifications'}</p>
            </div>
        `;
        return;
    }
    
    const notifHTML = notifications.slice(0, 10).map(n => {
        const isRead = n.read ? 'read' : 'unread';
        const icon = n.type === 'success' ? 'fa-check-circle' : 
                     n.type === 'error' ? 'fa-times-circle' : 
                     n.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        const time = formatTimeAgo(n.timestamp);
        
        return `
            <div class="notif-item ${isRead}" onclick="handleNotificationClick('${n.id || n.timestamp}')">
                <div class="notif-icon"><i class="fas ${icon}"></i></div>
                <div class="notif-content">
                    <div class="notif-title">${n.title}</div>
                    <div class="notif-message">${n.message}</div>
                    <div class="notif-time">${time}</div>
                </div>
                <button class="notif-delete" onclick="event.stopPropagation(); deleteNotification('${n.id || n.timestamp}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
    
    dropdown.innerHTML = `
        <div class="notif-header">
            <span>${getLang('notifications') || 'Notifikasi'}</span>
            ${unreadCount > 0 ? `<button class="notif-mark-all" onclick="markAllNotificationsRead()">${currentLanguage === 'id' ? 'Tandai dibaca' : 'Mark all read'}</button>` : ''}
        </div>
        <div class="notif-list">${notifHTML}</div>
    `;
}

// Handle notification click
async function handleNotificationClick(notificationId) {
    await markNotificationRead(notificationId);
}

// Toggle notification dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        if (dropdown.classList.contains('show')) {
            loadNotifications();
        }
    }
}

// Format time ago
function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000);
    
    if (diff < 60) return currentLanguage === 'id' ? 'Baru saja' : 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} ${currentLanguage === 'id' ? 'menit' : 'min'} ${currentLanguage === 'id' ? 'lalu' : 'ago'}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${currentLanguage === 'id' ? 'jam' : 'hr'} ${currentLanguage === 'id' ? 'lalu' : 'ago'}`;
    return `${Math.floor(diff / 86400)} ${currentLanguage === 'id' ? 'hari' : 'day'} ${currentLanguage === 'id' ? 'lalu' : 'ago'}`;
}

// ========================================
// QUICK ACTIONS
// ========================================

function quickAddMember() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah data' : 'You do not have permission to add data', 'error');
        return;
    }
    showPage('members');
    showAddMemberModal();
}

function quickAddEvent() {
    if (isViewOnly()) {
        showToast(currentLanguage === 'id' ? 'Anda tidak memiliki izin untuk menambah data' : 'You do not have permission to add data', 'error');
        return;
    }
    showPage('events');
    showAddEventModal();
}

function quickCheckIn() {
    showPage('attendance');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatRupiah(angka) {
    if (angka === undefined || angka === null) return 'Rp 0';
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(currentLanguage === 'id' ? 'id-ID' : 'en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
}

function formatTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // Try parsing as time string (HH:MM)
        if (dateString.includes(':')) return dateString;
        return '-';
    }
    return date.toLocaleTimeString(currentLanguage === 'id' ? 'id-ID' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function timeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        tahun: 31536000,
        bulan: 2592000,
        minggu: 604800,
        hari: 86400,
        jam: 3600,
        menit: 60,
        detik: 1
    };
    
    const enIntervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    const labels = currentLanguage === 'id' ? intervals : enIntervals;
    const labelNames = currentLanguage === 'id' 
        ? ['tahun', 'bulan', 'minggu', 'hari', 'jam', 'menit', 'detik']
        : ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
    
    for (let i = 0; i < labelNames.length; i++) {
        const interval = labels[labelNames[i]];
        const count = Math.floor(seconds / interval);
        if (count >= 1) {
            if (currentLanguage === 'id') {
                return `${count} ${labelNames[i]} yang lalu`;
            } else {
                return count === 1 ? `${count} ${labelNames[i]} ago` : `${count} ${labelNames[i]}s ago`;
            }
        }
    }
    
    return currentLanguage === 'id' ? 'Baru saja' : 'Just now';
}

// ========================================
// FINANCE MODULE
// ========================================

let financeChart = null;
let incomeCategoryChart = null;
let expenseCategoryChart = null;

// Initialize Finance Page
function initFinance() {
    updateFinanceSummary();
    initFinanceCharts();
    renderPemasukan();
    renderPengeluaran();
    renderKategori();
    renderApprovalTab();
    populateKategoriSelects();
    populateDonaturSelect();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    document.getElementById('laporan-date').value = today;
    document.getElementById('laporan-month').value = thisMonth;
    document.getElementById('filter-pemasukan-month').value = thisMonth;
    document.getElementById('filter-pengeluaran-month').value = thisMonth;
    
    // Hide approval tab for non-superadmin
    const approvalTab = document.getElementById('tab-approval');
    if (approvalTab) {
        approvalTab.style.display = isSuperAdmin() ? 'inline-block' : 'none';
    }
    
    // Hide add buttons for view-only users
    const addButtons = document.querySelectorAll('.finance-add-btn');
    addButtons.forEach(btn => {
        btn.style.display = isViewOnly() ? 'none' : 'inline-flex';
    });
}

// Show Finance Tab
function showFinanceTab(tabName, clickedBtn) {
    // Update tab buttons
    document.querySelectorAll('.finance-tab').forEach(btn => btn.classList.remove('active'));
    if (clickedBtn) clickedBtn.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.finance-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById('finance-' + tabName).classList.add('active');
    
    // Refresh content based on tab
    if (tabName === 'dashboard') {
        updateFinanceSummary();
        updateFinanceChart();
    } else if (tabName === 'pemasukan') {
        renderPemasukan();
    } else if (tabName === 'pengeluaran') {
        renderPengeluaran();
    } else if (tabName === 'kategori') {
        renderKategori();
    } else if (tabName === 'approval') {
        renderApprovalTab();
    }
}

// Update Finance Summary
function updateFinanceSummary() {
    const data = getData();
    const pemasukan = data.pemasukan || [];
    const pengeluaran = data.pengeluaran || [];
    const donatur = data.donatur || [];
    
    // Calculate totals (only approved items)
    const totalPemasukan = pemasukan
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + p.jumlah, 0);
    
    const totalPengeluaran = pengeluaran
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + p.jumlah, 0);
    
    const saldo = (data.finance?.saldoAwal || 0) + totalPemasukan - totalPengeluaran;
    
    // Update display
    document.getElementById('finance-saldo').textContent = formatRupiah(saldo);
    document.getElementById('finance-total-pemasukan').textContent = formatRupiah(totalPemasukan);
    document.getElementById('finance-total-pengeluaran').textContent = formatRupiah(totalPengeluaran);
    document.getElementById('finance-total-donatur').textContent = donatur.length;
}

// Initialize Finance Charts
function initFinanceCharts() {
    updateFinanceChart();
    updateIncomeCategoryChart();
    updateExpenseCategoryChart();
}

// Update Finance Chart (Income vs Expense)
function updateFinanceChart() {
    const ctx = document.getElementById('financeChart');
    if (!ctx) return;
    
    const data = getData();
    const period = document.getElementById('finance-chart-period')?.value || 'month';
    
    let labels, pemasukanData, pengeluaranData;
    
    if (period === 'month') {
        // Daily data for current month
        const currentMonth = new Date().toISOString().slice(0, 7);
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        
        labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);
        pemasukanData = new Array(daysInMonth).fill(0);
        pengeluaranData = new Array(daysInMonth).fill(0);
        
        (data.pemasukan || [])
            .filter(p => p.status === 'approved' && p.tanggal.startsWith(currentMonth))
            .forEach(p => {
                const day = parseInt(p.tanggal.split('-')[2]) - 1;
                pemasukanData[day] += p.jumlah;
            });
        
        (data.pengeluaran || [])
            .filter(p => p.status === 'approved' && p.tanggal.startsWith(currentMonth))
            .forEach(p => {
                const day = parseInt(p.tanggal.split('-')[2]) - 1;
                pengeluaranData[day] += p.jumlah;
            });
    } else {
        // Monthly data for current year
        const currentYear = new Date().getFullYear();
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        pemasukanData = new Array(12).fill(0);
        pengeluaranData = new Array(12).fill(0);
        
        (data.pemasukan || [])
            .filter(p => p.status === 'approved' && p.tanggal.startsWith(String(currentYear)))
            .forEach(p => {
                const month = parseInt(p.tanggal.split('-')[1]) - 1;
                pemasukanData[month] += p.jumlah;
            });
        
        (data.pengeluaran || [])
            .filter(p => p.status === 'approved' && p.tanggal.startsWith(String(currentYear)))
            .forEach(p => {
                const month = parseInt(p.tanggal.split('-')[1]) - 1;
                pengeluaranData[month] += p.jumlah;
            });
    }
    
    if (financeChart) financeChart.destroy();
    
    financeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: getLang('income'),
                    data: pemasukanData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: getLang('expense'),
                    data: pengeluaranData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatRupiah(value);
                        }
                    }
                }
            }
        }
    });
}

// Update Income Category Chart
function updateIncomeCategoryChart() {
    const ctx = document.getElementById('incomeCategoryChart');
    if (!ctx) return;
    
    const data = getData();
    const kategoriPemasukan = (data.financeCategories || []).filter(k => k.tipe === 'pemasukan');
    
    const categoryTotals = {};
    kategoriPemasukan.forEach(k => categoryTotals[k.nama] = 0);
    
    (data.pemasukan || [])
        .filter(p => p.status === 'approved')
        .forEach(p => {
            const kategori = kategoriPemasukan.find(k => k.id === p.kategoriId);
            if (kategori) {
                categoryTotals[kategori.nama] = (categoryTotals[kategori.nama] || 0) + p.jumlah;
            }
        });
    
    if (incomeCategoryChart) incomeCategoryChart.destroy();
    
    incomeCategoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#28a745', '#20c997', '#17a2b8', '#6f42c1']
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

// Update Expense Category Chart
function updateExpenseCategoryChart() {
    const ctx = document.getElementById('expenseCategoryChart');
    if (!ctx) return;
    
    const data = getData();
    const kategoriPengeluaran = (data.financeCategories || []).filter(k => k.tipe === 'pengeluaran');
    
    const categoryTotals = {};
    kategoriPengeluaran.forEach(k => categoryTotals[k.nama] = 0);
    
    (data.pengeluaran || [])
        .filter(p => p.status === 'approved')
        .forEach(p => {
            const kategori = kategoriPengeluaran.find(k => k.id === p.kategoriId);
            if (kategori) {
                categoryTotals[kategori.nama] = (categoryTotals[kategori.nama] || 0) + p.jumlah;
            }
        });
    
    if (expenseCategoryChart) expenseCategoryChart.destroy();
    
    expenseCategoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#6c757d']
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

// Populate Kategori Selects
function populateKategoriSelects() {
    const data = getData();
    const pemasukanSelect = document.getElementById('pemasukan-kategori');
    const pengeluaranSelect = document.getElementById('pengeluaran-kategori');
    const filterPemasukanSelect = document.getElementById('filter-pemasukan-kategori');
    const filterPengeluaranSelect = document.getElementById('filter-pengeluaran-kategori');
    
    if (pemasukanSelect) {
        pemasukanSelect.innerHTML = '<option value="">' + getLang('select-category') + '</option>';
        (data.financeCategories || [])
            .filter(k => k.tipe === 'pemasukan')
            .forEach(k => {
                pemasukanSelect.innerHTML += `<option value="${k.id}">${k.nama}</option>`;
            });
        // Add Other/Lainnya option
        pemasukanSelect.innerHTML += `<option value="other">${getLang('other')}</option>`;
    }
    
    if (pengeluaranSelect) {
        pengeluaranSelect.innerHTML = '<option value="">' + getLang('select-category') + '</option>';
        (data.financeCategories || [])
            .filter(k => k.tipe === 'pengeluaran')
            .forEach(k => {
                pengeluaranSelect.innerHTML += `<option value="${k.id}">${k.nama}</option>`;
            });
        // Add Other/Lainnya option
        pengeluaranSelect.innerHTML += `<option value="other">${getLang('other')}</option>`;
    }
    
    if (filterPemasukanSelect) {
        filterPemasukanSelect.innerHTML = '<option value="">' + getLang('all-categories') + '</option>';
        (data.financeCategories || [])
            .filter(k => k.tipe === 'pemasukan')
            .forEach(k => {
                filterPemasukanSelect.innerHTML += `<option value="${k.id}">${k.nama}</option>`;
            });
    }
    
    if (filterPengeluaranSelect) {
        filterPengeluaranSelect.innerHTML = '<option value="">' + getLang('all-categories') + '</option>';
        (data.financeCategories || [])
            .filter(k => k.tipe === 'pengeluaran')
            .forEach(k => {
                filterPengeluaranSelect.innerHTML += `<option value="${k.id}">${k.nama}</option>`;
            });
    }
}

// Handle Finance Category Change (Other/Lainnya)
function handleFinanceCategoryChange(select, inputId) {
    const groupId = inputId + '-group';
    const group = document.getElementById(groupId);
    const input = document.getElementById(inputId);
    
    if (select.value === 'other') {
        group.classList.remove('hidden');
        if (input) input.required = true;
    } else {
        group.classList.add('hidden');
        if (input) {
            input.required = false;
            input.value = '';
        }
    }
}

// Populate Donatur Select
function populateDonaturSelect() {
    const data = getData();
    const donaturSelect = document.getElementById('pemasukan-donatur');
    
    if (donaturSelect) {
        donaturSelect.innerHTML = '<option value="">' + getLang('select-donor') + '</option>';
        (data.donatur || []).forEach(d => {
            donaturSelect.innerHTML += `<option value="${d.id}">${d.nama}</option>`;
        });
    }
}

// Render Pemasukan Table
function renderPemasukan() {
    const data = getData();
    const tbody = document.getElementById('pemasukan-tbody');
    if (!tbody) return;
    
    const searchTerm = document.getElementById('search-pemasukan')?.value?.toLowerCase() || '';
    const kategoriFilter = document.getElementById('filter-pemasukan-kategori')?.value || '';
    const monthFilter = document.getElementById('filter-pemasukan-month')?.value || '';
    
    let filtered = (data.pemasukan || []).filter(p => {
        const kategori = data.financeCategories?.find(k => k.id === p.kategoriId);
        const donatur = data.donatur?.find(d => d.id === p.donaturId);
        
        const matchesSearch = !searchTerm || 
            p.keterangan?.toLowerCase().includes(searchTerm) ||
            kategori?.nama.toLowerCase().includes(searchTerm) ||
            donatur?.nama.toLowerCase().includes(searchTerm);
        
        const matchesKategori = !kategoriFilter || p.kategoriId == kategoriFilter;
        const matchesMonth = !monthFilter || p.tanggal.startsWith(monthFilter);
        
        return matchesSearch && matchesKategori && matchesMonth;
    });
    
    // Sort by date descending
    filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    tbody.innerHTML = filtered.map(p => {
        const kategori = data.financeCategories?.find(k => k.id === p.kategoriId);
        const donatur = data.donatur?.find(d => d.id === p.donaturId);
        
        let statusBadge = '';
        if (p.status === 'approved') {
            statusBadge = '<span class="badge badge-success">' + getLang('approved') + '</span>';
        } else if (p.status === 'rejected') {
            statusBadge = '<span class="badge badge-danger">' + getLang('rejected') + '</span>';
        } else {
            statusBadge = '<span class="badge badge-warning">' + getLang('pending') + '</span>';
        }
        
        const canEdit = !isViewOnly() && (isSuperAdmin() || p.status !== 'approved');
        
        return `
            <tr>
                <td>${formatDate(p.tanggal)}</td>
                <td>${kategori?.nama || '-'}</td>
                <td>${p.keterangan || '-'}</td>
                <td>${donatur?.nama || '-'}</td>
                <td>${formatRupiah(p.jumlah)}</td>
                <td>${statusBadge}</td>
                <td>
                    ${canEdit ? `
                        <button class="btn-icon btn-edit" onclick="editPemasukan(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon btn-delete" onclick="deletePemasukan(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
                    ` : '-'}
                </td>
            </tr>
        `;
    }).join('');
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">${getLang('none')}</td></tr>`;
    }
}

// Render Pengeluaran Table
function renderPengeluaran() {
    const data = getData();
    const tbody = document.getElementById('pengeluaran-tbody');
    if (!tbody) return;
    
    const searchTerm = document.getElementById('search-pengeluaran')?.value?.toLowerCase() || '';
    const kategoriFilter = document.getElementById('filter-pengeluaran-kategori')?.value || '';
    const monthFilter = document.getElementById('filter-pengeluaran-month')?.value || '';
    
    let filtered = (data.pengeluaran || []).filter(p => {
        const kategori = data.financeCategories?.find(k => k.id === p.kategoriId);
        
        const matchesSearch = !searchTerm || 
            p.keterangan?.toLowerCase().includes(searchTerm) ||
            kategori?.nama.toLowerCase().includes(searchTerm);
        
        const matchesKategori = !kategoriFilter || p.kategoriId == kategoriFilter;
        const matchesMonth = !monthFilter || p.tanggal.startsWith(monthFilter);
        
        return matchesSearch && matchesKategori && matchesMonth;
    });
    
    // Sort by date descending
    filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    tbody.innerHTML = filtered.map(p => {
        const kategori = data.financeCategories?.find(k => k.id === p.kategoriId);
        
        let statusBadge = '';
        if (p.status === 'approved') {
            statusBadge = '<span class="badge badge-success">' + getLang('approved') + '</span>';
        } else if (p.status === 'rejected') {
            statusBadge = '<span class="badge badge-danger">' + getLang('rejected') + '</span>';
        } else {
            statusBadge = '<span class="badge badge-warning">' + getLang('pending') + '</span>';
        }
        
        const canEdit = !isViewOnly() && (isSuperAdmin() || p.status !== 'approved');
        
        return `
            <tr>
                <td>${formatDate(p.tanggal)}</td>
                <td>${kategori?.nama || '-'}</td>
                <td>${p.keterangan || '-'}</td>
                <td>${formatRupiah(p.jumlah)}</td>
                <td>${statusBadge}</td>
                <td>
                    ${canEdit ? `
                        <button class="btn-icon btn-edit" onclick="editPengeluaran(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon btn-delete" onclick="deletePengeluaran(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
                    ` : '-'}
                </td>
            </tr>
        `;
    }).join('');
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">${getLang('none')}</td></tr>`;
    }
}

// Render Kategori Grid
function renderKategori() {
    const data = getData();
    const grid = document.getElementById('kategori-grid');
    if (!grid) return;
    
    const searchTerm = document.getElementById('search-kategori')?.value?.toLowerCase() || '';
    
    let filtered = (data.financeCategories || []).filter(k => {
        return !searchTerm || k.nama.toLowerCase().includes(searchTerm) || k.deskripsi?.toLowerCase().includes(searchTerm);
    });
    
    const canEditKategori = !isViewOnly();
    
    grid.innerHTML = filtered.map(k => {
        const tipeBadge = k.tipe === 'pemasukan' 
            ? '<span class="badge badge-success">' + getLang('income') + '</span>'
            : '<span class="badge badge-danger">' + getLang('expense') + '</span>';
        
        return `
            <div class="kategori-card">
                <div class="kategori-header">
                    <h4>${k.nama}</h4>
                    ${tipeBadge}
                </div>
                <p>${k.deskripsi || '-'}</p>
                ${canEditKategori ? `
                <div class="kategori-actions">
                    <button class="btn-icon btn-edit" onclick="editKategori(${k.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteKategori(${k.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="text-center">${getLang('none')}</div>`;
    }
}

// Render Approval Tab
function renderApprovalTab() {
    const data = getData();
    const pendingList = document.getElementById('pending-approval-list');
    const historyList = document.getElementById('approval-history-list');
    
    if (!pendingList || !historyList) return;
    
    // Pending items
    const pendingPemasukan = (data.pemasukan || []).filter(p => p.status === 'pending');
    const pendingPengeluaran = (data.pengeluaran || []).filter(p => p.status === 'pending');
    
    const pendingItems = [
        ...pendingPemasukan.map(p => ({ ...p, tipe: 'pemasukan' })),
        ...pendingPengeluaran.map(p => ({ ...p, tipe: 'pengeluaran' }))
    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    pendingList.innerHTML = pendingItems.map(item => {
        const kategori = data.financeCategories?.find(k => k.id === item.kategoriId);
        return `
            <div class="approval-item">
                <div class="approval-info">
                    <span class="approval-type ${item.tipe}">${item.tipe === 'pemasukan' ? getLang('income') : getLang('expense')}</span>
                    <h4>${kategori?.nama || '-'}</h4>
                    <p>${item.keterangan || '-'}</p>
                    <span class="approval-amount">${formatRupiah(item.jumlah)}</span>
                    <span class="approval-date">${formatDate(item.tanggal)}</span>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-success btn-sm" onclick="approveItem('${item.tipe}', ${item.id})"><i class="fas fa-check"></i> ${getLang('approve')}</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectItem('${item.tipe}', ${item.id})"><i class="fas fa-times"></i> ${getLang('reject')}</button>
                </div>
            </div>
        `;
    }).join('');
    
    if (pendingItems.length === 0) {
        pendingList.innerHTML = `<div class="text-center">${getLang('none')}</div>`;
    }
    
    // History
    const historyItems = (data.approvalHistory || [])
        .slice()
        .reverse()
        .slice(0, 20);
    
    historyList.innerHTML = historyItems.map(h => {
        const user = data.users?.find(u => u.id === h.by);
        const item = h.tipe === 'pemasukan' 
            ? data.pemasukan?.find(p => p.id === h.itemId)
            : data.pengeluaran?.find(p => p.id === h.itemId);
        const kategori = item ? data.financeCategories?.find(k => k.id === item.kategoriId) : null;
        
        return `
            <div class="approval-item history">
                <div class="approval-info">
                    <span class="approval-type ${h.tipe}">${h.tipe === 'pemasukan' ? getLang('income') : getLang('expense')}</span>
                    <h4>${kategori?.nama || '-'}</h4>
                    <p>${item?.keterangan || '-'}</p>
                    <span class="approval-amount">${formatRupiah(item?.jumlah || 0)}</span>
                </div>
                <div class="approval-meta">
                    <span class="approval-action ${h.action}">${h.action === 'approved' ? getLang('approved') : getLang('rejected')}</span>
                    <span class="approval-by">${user?.nama || '-'}</span>
                    <span class="approval-time">${timeAgo(h.timestamp)}</span>
                </div>
            </div>
        `;
    }).join('');
    
    if (historyItems.length === 0) {
        historyList.innerHTML = `<div class="text-center">${getLang('none')}</div>`;
    }
}

// Search and Filter Functions
function searchPemasukan() { renderPemasukan(); }
function filterPemasukan() { renderPemasukan(); }
function searchPengeluaran() { renderPengeluaran(); }
function filterPengeluaran() { renderPengeluaran(); }
function searchKategori() { renderKategori(); }

// Show Add/Edit Modals
function showAddPemasukanModal() {
    document.getElementById('pemasukan-id').value = '';
    document.getElementById('form-pemasukan').reset();
    document.getElementById('pemasukan-tanggal').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-pemasukan-title').textContent = getLang('add-income');
    openModal('modal-pemasukan');
}

function showAddPengeluaranModal() {
    document.getElementById('pengeluaran-id').value = '';
    document.getElementById('form-pengeluaran').reset();
    document.getElementById('pengeluaran-tanggal').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-pengeluaran-title').textContent = getLang('add-expense');
    openModal('modal-pengeluaran');
}

function showAddKategoriModal() {
    document.getElementById('kategori-id').value = '';
    document.getElementById('form-kategori').reset();
    document.getElementById('modal-kategori-title').textContent = getLang('add-category');
    openModal('modal-kategori');
}

// Edit Functions
function editPemasukan(id) {
    // Check permission - only admin and superadmin can edit
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    const data = getData();
    const p = data.pemasukan?.find(item => item.id === id);
    if (!p) return;
    
    // Check if can edit (superadmin can edit anything, admin can only edit pending)
    if (!isSuperAdmin() && p.status === 'approved') {
        showToast('Data yang sudah di-approve tidak dapat diubah', 'error');
        return;
    }
    
    document.getElementById('pemasukan-id').value = p.id;
    document.getElementById('pemasukan-kategori').value = p.kategoriId;
    document.getElementById('pemasukan-jumlah').value = p.jumlah;
    document.getElementById('pemasukan-tanggal').value = p.tanggal;
    document.getElementById('pemasukan-donatur').value = p.donaturId || '';
    document.getElementById('pemasukan-keterangan').value = p.keterangan || '';
    document.getElementById('modal-pemasukan-title').textContent = 'Edit Pemasukan';
    openModal('modal-pemasukan');
}

function editPengeluaran(id) {
    // Check permission - only admin and superadmin can edit
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    const data = getData();
    const p = data.pengeluaran?.find(item => item.id === id);
    if (!p) return;
    
    // Check if can edit (superadmin can edit anything, admin can only edit pending)
    if (!isSuperAdmin() && p.status === 'approved') {
        showToast('Data yang sudah di-approve tidak dapat diubah', 'error');
        return;
    }
    
    document.getElementById('pengeluaran-id').value = p.id;
    document.getElementById('pengeluaran-kategori').value = p.kategoriId;
    document.getElementById('pengeluaran-jumlah').value = p.jumlah;
    document.getElementById('pengeluaran-tanggal').value = p.tanggal;
    document.getElementById('pengeluaran-keterangan').value = p.keterangan || '';
    document.getElementById('modal-pengeluaran-title').textContent = 'Edit Pengeluaran';
    openModal('modal-pengeluaran');
}

function editKategori(id) {
    // Check permission - only admin and superadmin can edit
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    const data = getData();
    const k = data.financeCategories?.find(item => item.id === id);
    if (!k) return;
    
    document.getElementById('kategori-id').value = k.id;
    document.getElementById('kategori-nama').value = k.nama;
    document.getElementById('kategori-tipe').value = k.tipe;
    document.getElementById('kategori-deskripsi').value = k.deskripsi || '';
    document.getElementById('modal-kategori-title').textContent = 'Edit Kategori';
    openModal('modal-kategori');
}

// Save Functions
function savePemasukan() {
    // Check permission - only admin and superadmin can edit
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    const data = getData();
    const id = document.getElementById('pemasukan-id').value;
    let kategoriId = document.getElementById('pemasukan-kategori').value;
    const jumlah = parseInt(document.getElementById('pemasukan-jumlah').value);
    const tanggal = document.getElementById('pemasukan-tanggal').value;
    const donaturId = document.getElementById('pemasukan-donatur').value || null;
    const keterangan = document.getElementById('pemasukan-keterangan').value;
    
    // Handle custom category (Other/Lainnya)
    if (kategoriId === 'other') {
        const customKategori = document.getElementById('pemasukan-kategori-lainnya').value.trim();
        if (!customKategori) {
            showToast('Mohon masukkan nama kategori', 'error');
            return;
        }
        // Create new category
        const newKategoriId = data.financeCategories.length > 0 ? Math.max(...data.financeCategories.map(k => k.id)) + 1 : 1;
        data.financeCategories.push({
            id: newKategoriId,
            nama: customKategori,
            tipe: 'pemasukan',
            deskripsi: 'Kategori manual'
        });
        kategoriId = newKategoriId;
    } else {
        kategoriId = parseInt(kategoriId);
    }
    
    if (!kategoriId || !jumlah || !tanggal) {
        showToast('Mohon lengkapi data yang diperlukan', 'error');
        return;
    }
    
    if (id) {
        // Update
        const index = data.pemasukan.findIndex(p => p.id == id);
        if (index !== -1) {
            data.pemasukan[index] = {
                ...data.pemasukan[index],
                kategoriId,
                jumlah,
                tanggal,
                donaturId: donaturId ? parseInt(donaturId) : null,
                keterangan
            };
        }
    } else {
        // Create new
        const newId = data.pemasukan.length > 0 ? Math.max(...data.pemasukan.map(p => p.id)) + 1 : 1;
        data.pemasukan.push({
            id: newId,
            kategoriId,
            jumlah,
            tanggal,
            donaturId: donaturId ? parseInt(donaturId) : null,
            keterangan,
            status: 'pending',
            approvedBy: null,
            approvedAt: null
        });
    }
    
    saveData(data);
    closeModal('modal-pemasukan');
    renderPemasukan();
    updateFinanceSummary();
    populateKategoriSelects();
    showToast('Pemasukan berhasil disimpan', 'success');
}

function savePengeluaran() {
    // Check permission - only admin and superadmin can edit
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    const data = getData();
    const id = document.getElementById('pengeluaran-id').value;
    let kategoriId = document.getElementById('pengeluaran-kategori').value;
    const jumlah = parseInt(document.getElementById('pengeluaran-jumlah').value);
    const tanggal = document.getElementById('pengeluaran-tanggal').value;
    const keterangan = document.getElementById('pengeluaran-keterangan').value;
    
    // Handle custom category (Other/Lainnya)
    if (kategoriId === 'other') {
        const customKategori = document.getElementById('pengeluaran-kategori-lainnya').value.trim();
        if (!customKategori) {
            showToast('Mohon masukkan nama kategori', 'error');
            return;
        }
        // Create new category
        const newKategoriId = data.financeCategories.length > 0 ? Math.max(...data.financeCategories.map(k => k.id)) + 1 : 1;
        data.financeCategories.push({
            id: newKategoriId,
            nama: customKategori,
            tipe: 'pengeluaran',
            deskripsi: 'Kategori manual'
        });
        kategoriId = newKategoriId;
    } else {
        kategoriId = parseInt(kategoriId);
    }
    
    if (!kategoriId || !jumlah || !tanggal) {
        showToast('Mohon lengkapi data yang diperlukan', 'error');
        return;
    }
    
    if (id) {
        // Update
        const index = data.pengeluaran.findIndex(p => p.id == id);
        if (index !== -1) {
            data.pengeluaran[index] = {
                ...data.pengeluaran[index],
                kategoriId,
                jumlah,
                tanggal,
                keterangan
            };
        }
    } else {
        // Create new
        const newId = data.pengeluaran.length > 0 ? Math.max(...data.pengeluaran.map(p => p.id)) + 1 : 1;
        data.pengeluaran.push({
            id: newId,
            kategoriId,
            jumlah,
            tanggal,
            keterangan,
            status: 'pending',
            approvedBy: null,
            approvedAt: null
        });
    }
    
    saveData(data);
    closeModal('modal-pengeluaran');
    renderPengeluaran();
    updateFinanceSummary();
    populateKategoriSelects();
    showToast('Pengeluaran berhasil disimpan', 'success');
}

function saveKategori() {
    // Check permission - only admin and superadmin can edit
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    const data = getData();
    const id = document.getElementById('kategori-id').value;
    const nama = document.getElementById('kategori-nama').value.trim();
    const tipe = document.getElementById('kategori-tipe').value;
    const deskripsi = document.getElementById('kategori-deskripsi').value.trim();
    
    if (!nama || !tipe) {
        showToast('Mohon lengkapi data yang diperlukan', 'error');
        return;
    }
    
    if (id) {
        // Update
        const index = data.financeCategories.findIndex(k => k.id == id);
        if (index !== -1) {
            data.financeCategories[index] = {
                ...data.financeCategories[index],
                nama,
                tipe,
                deskripsi
            };
        }
    } else {
        // Create new
        const newId = data.financeCategories.length > 0 ? Math.max(...data.financeCategories.map(k => k.id)) + 1 : 1;
        data.financeCategories.push({
            id: newId,
            nama,
            tipe,
            deskripsi
        });
    }
    
    saveData(data);
    closeModal('modal-kategori');
    renderKategori();
    populateKategoriSelects();
    showToast('Kategori berhasil disimpan', 'success');
}

// Delete Functions
function deletePemasukan(id) {
    // Check permission - only admin and superadmin can delete
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    showConfirm('Apakah Anda yakin ingin menghapus pemasukan ini?', () => {
        const data = getData();
        data.pemasukan = data.pemasukan.filter(p => p.id !== id);
        saveData(data);
        renderPemasukan();
        updateFinanceSummary();
        showToast('Pemasukan berhasil dihapus', 'success');
    });
}

function deletePengeluaran(id) {
    // Check permission - only admin and superadmin can delete
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    showConfirm('Apakah Anda yakin ingin menghapus pengeluaran ini?', () => {
        const data = getData();
        data.pengeluaran = data.pengeluaran.filter(p => p.id !== id);
        saveData(data);
        renderPengeluaran();
        updateFinanceSummary();
        showToast('Pengeluaran berhasil dihapus', 'success');
    });
}

function deleteKategori(id) {
    // Check permission - only admin and superadmin can delete
    if (isViewOnly()) {
        showToast('Anda hanya dapat melihat data. Hubungi admin untuk mengubah data.', 'error');
        return;
    }
    
    showConfirm('Apakah Anda yakin ingin menghapus kategori ini?', () => {
        const data = getData();
        data.financeCategories = data.financeCategories.filter(k => k.id !== id);
        saveData(data);
        renderKategori();
        populateKategoriSelects();
        showToast('Kategori berhasil dihapus', 'success');
    });
}

// Approval Functions
function approveItem(tipe, id) {
    if (!isSuperAdmin()) {
        showToast('Hanya Super Admin yang dapat melakukan approval', 'error');
        return;
    }
    
    const data = getData();
    const now = new Date().toISOString();
    
    if (tipe === 'pemasukan') {
        const index = data.pemasukan.findIndex(p => p.id === id);
        if (index !== -1) {
            data.pemasukan[index].status = 'approved';
            data.pemasukan[index].approvedBy = currentUser.id;
            data.pemasukan[index].approvedAt = now;
        }
    } else {
        const index = data.pengeluaran.findIndex(p => p.id === id);
        if (index !== -1) {
            data.pengeluaran[index].status = 'approved';
            data.pengeluaran[index].approvedBy = currentUser.id;
            data.pengeluaran[index].approvedAt = now;
        }
    }
    
    // Add to history
    if (!data.approvalHistory) data.approvalHistory = [];
    data.approvalHistory.push({
        id: data.approvalHistory.length + 1,
        tipe,
        itemId: id,
        action: 'approved',
        by: currentUser.id,
        timestamp: now
    });
    
    saveData(data);
    renderApprovalTab();
    renderPemasukan();
    renderPengeluaran();
    updateFinanceSummary();
    showToast('Item berhasil disetujui', 'success');
}

function rejectItem(tipe, id) {
    if (!isSuperAdmin()) {
        showToast('Hanya Super Admin yang dapat melakukan approval', 'error');
        return;
    }
    
    const data = getData();
    const now = new Date().toISOString();
    
    if (tipe === 'pemasukan') {
        const index = data.pemasukan.findIndex(p => p.id === id);
        if (index !== -1) {
            data.pemasukan[index].status = 'rejected';
            data.pemasukan[index].approvedBy = currentUser.id;
            data.pemasukan[index].approvedAt = now;
        }
    } else {
        const index = data.pengeluaran.findIndex(p => p.id === id);
        if (index !== -1) {
            data.pengeluaran[index].status = 'rejected';
            data.pengeluaran[index].approvedBy = currentUser.id;
            data.pengeluaran[index].approvedAt = now;
        }
    }
    
    // Add to history
    if (!data.approvalHistory) data.approvalHistory = [];
    data.approvalHistory.push({
        id: data.approvalHistory.length + 1,
        tipe,
        itemId: id,
        action: 'rejected',
        by: currentUser.id,
        timestamp: now
    });
    
    saveData(data);
    renderApprovalTab();
    renderPemasukan();
    renderPengeluaran();
    showToast('Item berhasil ditolak', 'success');
}

// Laporan Functions
function updateLaporanView() {
    const type = document.getElementById('laporan-type').value;
    const content = document.getElementById('laporan-content');
    
    // Show/hide appropriate filters
    document.getElementById('laporan-date-filter').style.display = type === 'harian' ? 'block' : 'none';
    document.getElementById('laporan-month-filter').style.display = type === 'bulanan' ? 'block' : 'none';
    document.getElementById('laporan-year-filter').style.display = type === 'tahunan' ? 'block' : 'none';
    
    const data = getData();
    let pemasukanFiltered, pengeluaranFiltered, title;
    
    if (type === 'harian') {
        const date = document.getElementById('laporan-date').value;
        pemasukanFiltered = (data.pemasukan || []).filter(p => p.status === 'approved' && p.tanggal === date);
        pengeluaranFiltered = (data.pengeluaran || []).filter(p => p.status === 'approved' && p.tanggal === date);
        title = `Laporan Harian - ${formatDate(date)}`;
    } else if (type === 'bulanan') {
        const month = document.getElementById('laporan-month').value;
        pemasukanFiltered = (data.pemasukan || []).filter(p => p.status === 'approved' && p.tanggal.startsWith(month));
        pengeluaranFiltered = (data.pengeluaran || []).filter(p => p.status === 'approved' && p.tanggal.startsWith(month));
        title = `Laporan Bulanan - ${month}`;
    } else {
        const year = document.getElementById('laporan-year').value;
        pemasukanFiltered = (data.pemasukan || []).filter(p => p.status === 'approved' && p.tanggal.startsWith(year));
        pengeluaranFiltered = (data.pengeluaran || []).filter(p => p.status === 'approved' && p.tanggal.startsWith(year));
        title = `Laporan Tahunan - ${year}`;
    }
    
    const totalPemasukan = pemasukanFiltered.reduce((sum, p) => sum + p.jumlah, 0);
    const totalPengeluaran = pengeluaranFiltered.reduce((sum, p) => sum + p.jumlah, 0);
    const saldo = totalPemasukan - totalPengeluaran;
    
    content.innerHTML = `
        <div class="laporan-header">
            <h3>${title}</h3>
            <div class="laporan-summary">
                <div class="summary-item income">
                    <span class="label">${getLang('total-income')}</span>
                    <span class="value">${formatRupiah(totalPemasukan)}</span>
                </div>
                <div class="summary-item expense">
                    <span class="label">${getLang('total-expense')}</span>
                    <span class="value">${formatRupiah(totalPengeluaran)}</span>
                </div>
                <div class="summary-item balance">
                    <span class="label">Selisih</span>
                    <span class="value">${formatRupiah(saldo)}</span>
                </div>
            </div>
        </div>
        <div class="laporan-tables">
            <div class="laporan-table">
                <h4>${getLang('income')}</h4>
                <table class="data-table">
                    <thead>
                        <tr><th>${getLang('date')}</th><th>${getLang('category')}</th><th>${getLang('amount')}</th></tr>
                    </thead>
                    <tbody>
                        ${pemasukanFiltered.map(p => {
                            const kategori = data.financeCategories?.find(k => k.id === p.kategoriId);
                            return `<tr><td>${formatDate(p.tanggal)}</td><td>${kategori?.nama || '-'}</td><td>${formatRupiah(p.jumlah)}</td></tr>`;
                        }).join('') || `<tr><td colspan="3" class="text-center">${getLang('none')}</td></tr>`}
                    </tbody>
                </table>
            </div>
            <div class="laporan-table">
                <h4>${getLang('expense')}</h4>
                <table class="data-table">
                    <thead>
                        <tr><th>${getLang('date')}</th><th>${getLang('category')}</th><th>${getLang('amount')}</th></tr>
                    </thead>
                    <tbody>
                        ${pengeluaranFiltered.map(p => {
                            const kategori = data.financeCategories?.find(k => k.id === p.kategoriId);
                            return `<tr><td>${formatDate(p.tanggal)}</td><td>${kategori?.nama || '-'}</td><td>${formatRupiah(p.jumlah)}</td></tr>`;
                        }).join('') || `<tr><td colspan="3" class="text-center">${getLang('none')}</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Export Functions
function exportFinanceData(type) {
    const data = getData();
    let items, filename, headers;
    
    if (type === 'pemasukan') {
        items = data.pemasukan || [];
        filename = 'pemasukan';
        headers = ['Tanggal', 'Kategori', 'Keterangan', 'Donatur', 'Jumlah', 'Status'];
    } else {
        items = data.pengeluaran || [];
        filename = 'pengeluaran';
        headers = ['Tanggal', 'Kategori', 'Keterangan', 'Jumlah', 'Status'];
    }
    
    // Apply current filters
    const kategoriFilter = document.getElementById(`filter-${type}-kategori`)?.value || '';
    const monthFilter = document.getElementById(`filter-${type}-month`)?.value || '';
    
    items = items.filter(p => {
        const matchesKategori = !kategoriFilter || p.kategoriId == kategoriFilter;
        const matchesMonth = !monthFilter || p.tanggal.startsWith(monthFilter);
        return matchesKategori && matchesMonth;
    });
    
    exportToCSV(items, filename, headers, (item) => {
        const kategori = data.financeCategories?.find(k => k.id === item.kategoriId);
        const donatur = data.donatur?.find(d => d.id === item.donaturId);
        
        if (type === 'pemasukan') {
            return [item.tanggal, kategori?.nama || '-', item.keterangan || '-', donatur?.nama || '-', item.jumlah, item.status];
        } else {
            return [item.tanggal, kategori?.nama || '-', item.keterangan || '-', item.jumlah, item.status];
        }
    });
}

function exportLaporan() {
    const type = document.getElementById('laporan-type').value;
    const data = getData();
    
    let pemasukanFiltered, pengeluaranFiltered, title;
    
    if (type === 'harian') {
        const date = document.getElementById('laporan-date').value;
        pemasukanFiltered = (data.pemasukan || []).filter(p => p.status === 'approved' && p.tanggal === date);
        pengeluaranFiltered = (data.pengeluaran || []).filter(p => p.status === 'approved' && p.tanggal === date);
        title = `Laporan_Harian_${date}`;
    } else if (type === 'bulanan') {
        const month = document.getElementById('laporan-month').value;
        pemasukanFiltered = (data.pemasukan || []).filter(p => p.status === 'approved' && p.tanggal.startsWith(month));
        pengeluaranFiltered = (data.pengeluaran || []).filter(p => p.status === 'approved' && p.tanggal.startsWith(month));
        title = `Laporan_Bulanan_${month}`;
    } else {
        const year = document.getElementById('laporan-year').value;
        pemasukanFiltered = (data.pemasukan || []).filter(p => p.status === 'approved' && p.tanggal.startsWith(year));
        pengeluaranFiltered = (data.pengeluaran || []).filter(p => p.status === 'approved' && p.tanggal.startsWith(year));
        title = `Laporan_Tahunan_${year}`;
    }
    
    // Create combined data for export
    const exportData = [
        ['LAPORAN KEUANGAN'],
        [title.replace(/_/g, ' ')],
        [],
        ['PEMASUKAN'],
        ['Tanggal', 'Kategori', 'Keterangan', 'Jumlah'],
        ...pemasukanFiltered.map(p => {
            const kategori = data.financeCategories?.find(k => k.id === p.kategoriId);
            return [p.tanggal, kategori?.nama || '-', p.keterangan || '-', p.jumlah];
        }),
        ['Total Pemasukan', '', '', pemasukanFiltered.reduce((sum, p) => sum + p.jumlah, 0)],
        [],
        ['PENGELUARAN'],
        ['Tanggal', 'Kategori', 'Keterangan', 'Jumlah'],
        ...pengeluaranFiltered.map(p => {
            const kategori = data.financeCategories?.find(k => k.id === p.kategoriId);
            return [p.tanggal, kategori?.nama || '-', p.keterangan || '-', p.jumlah];
        }),
        ['Total Pengeluaran', '', '', pengeluaranFiltered.reduce((sum, p) => sum + p.jumlah, 0)],
        [],
        ['SALDO', '', '', pemasukanFiltered.reduce((sum, p) => sum + p.jumlah, 0) - pengeluaranFiltered.reduce((sum, p) => sum + p.jumlah, 0)]
    ];
    
    // Export to Excel
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
    XLSX.writeFile(wb, `${title}.xlsx`);
    
    showToast('Laporan berhasil diexport', 'success');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Apply language on load
    applyLanguage();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all modals
            document.querySelectorAll('.modal').forEach(m => {
                if (m.style.display === 'flex') {
                    m.style.display = 'none';
                }
            });
            document.body.style.overflow = '';
        }
    });
});
