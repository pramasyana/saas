import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

export const defaultLandingTemplate: LandingConfig = {
    enabled: true,
    template: 'lumina',
    section_order: [
        'hero',
        'features',
        'about',
        'stats',
        'services',
        'team',
        'testimonials',
        'faq',
        'gallery',
        'cta',
        'contact',
        'branches',
        'divider',
        'logo_cloud',
        'footer',
    ],
    colors: {
        primary: '#6B38D4',
        secondary: '#4648D4',
        accent: '#855000',
        background: '#FAF8FF',
        text: '#131B2E',
        text_muted: '#494454',
    },
    hero: {
        enabled: true,
        title: 'Transformasi Gaya Anda Bersama Ahli Kami',
        subtitle: 'Nikmati pengalaman perawatan premium dengan terapis profesional. Hasil maksimal, harga bersahabat, dan kenyamanan tanpa kompromi.',
        badge: 'Premium Wellness',
        image: null,
        cta_text: 'Booking Sekarang',
        cta_link: '/booking',
        background_type: 'color',
        background_image: null,
        overlay_opacity: 50,
        carousel_items: [],
        carousel_interval: 5000,
        stats: [
            { number: '500+', label: 'Pelanggan Puas' },
            { number: '15', label: 'Terapis Ahli' },
        ],
    },
    features: {
        enabled: true,
        title: 'Mengapa Memilih Kami',
        subtitle: 'Kami berkomitmen memberikan pelayanan terbaik untuk setiap pelanggan dengan standar kenyamanan tertinggi.',
        items: [
            {
                icon: 'sparkles',
                title: 'Teknologi Terkini',
                description: 'Menggunakan peralatan dan produk terbaru untuk hasil perawatan yang optimal dan aman sesuai standar klinis internasional.',
            },
            {
                icon: 'shield',
                title: 'Produk Premium',
                description: 'Hanya menggunakan produk berkualitas tinggi yang sudah teruji dermatologis dan bersertifikasi aman untuk kulit sensitif.',
            },
            {
                icon: 'users',
                title: 'Terapis Profesional',
                description: 'Tim terapis berpengalaman dan tersertifikasi, siap memberikan pelayanan terbaik dengan teknik yang modern.',
            },
        ],
    },
    about: {
        enabled: true,
        title: 'Tentang Kami',
        content: 'Kami adalah penyedia layanan perawatan profesional yang telah berpengalaman lebih dari 10 tahun. Berawal dari sebuah studio kecil, kini kami telah berkembang menjadi salah satu destinasi perawatan terkemuka dengan jaringan cabang di berbagai kota.\n\nVisi kami adalah menjadi pilihan utama bagi setiap individu yang menginginkan perawatan berkualitas tinggi dengan harga terjangkau. Misi kami adalah memberikan pengalaman perawatan yang menyenangkan, aman, dan memuaskan bagi setiap pelanggan.\n\nKami percaya bahwa setiap orang berhak tampil percaya diri. Karena itu, kami terus berinovasi dan meningkatkan kualitas layanan kami setiap hari.',
    },
    stats: {
        enabled: true,
        items: [
            { number: '500+', label: 'Pelanggan Puas', suffix: '+' },
            { number: '10', label: 'Tahun Pengalaman', suffix: '+ Tahun' },
            { number: '15', label: 'Terapis Profesional' },
            { number: '4.9', label: 'Rating Pelanggan' },
        ],
    },
    services: {
        enabled: true,
        title: 'Layanan Kecantikan Terpadu',
        subtitle: 'Berbagai pilihan perawatan untuk memenuhi kebutuhan Anda',
    },
    team: {
        enabled: true,
        title: 'Tim Profesional Kami',
        subtitle: 'Kenali para ahli yang siap memberikan pelayanan terbaik untuk Anda',
    },
    testimonials: {
        enabled: true,
        title: 'Apa Kata Mereka',
        subtitle: 'Lebih dari 500 pelanggan mempercayakan kecantikannya kepada kami setiap bulannya.',
        items: [
            {
                name: 'Sari Dewi',
                role: 'Ibu Rumah Tangga',
                content: 'Pelayanannya sangat memuaskan! Terapisnya ramah dan profesional. Hasil perawatannya terlihat instan setelah 2 kali treatment. Sangat recommended!',
                rating: 5,
            },
            {
                name: 'Andi Pratama',
                role: 'Entrepreneur',
                content: 'Tempatnya nyaman, bersih, dan staffnya helpful banget. System booking online-nya memudahkan saya yang sibuk. Langganan tiap bulan!',
                rating: 5,
            },
            {
                name: 'Maya Indah',
                role: 'Karyawan Swasta',
                content: 'Harga terjangkau dengan kualitas yang tidak kalah dengan salon mahal. Sudah jadi tempat langganan saya dan teman-teman kantor.',
                rating: 4,
            },
            {
                name: 'Rina Wijaya',
                role: 'Mahasiswa',
                content: 'Pertama kali coba, langsung jatuh cinta! Suasananya cozy, hasilnya amazing. Pasti balik lagi minggu depan!',
                rating: 5,
            },
        ],
    },
    faq: {
        enabled: true,
        title: 'Pertanyaan Umum',
        subtitle: 'Segala hal yang perlu Anda ketahui sebelum berkunjung.',
        items: [
            {
                question: 'Bagaimana cara booking treatment?',
                answer: 'Anda bisa booking langsung melalui website ini dengan menekan tombol "Book Ritual", melalui WhatsApp resmi kami, atau datang langsung ke outlet terdekat.',
            },
            {
                question: 'Apakah bisa reschedule atau cancel?',
                answer: 'Tentu. Kami memberikan fleksibilitas reschedule hingga 24 jam sebelum jadwal treatment Anda tanpa dikenakan biaya tambahan.',
            },
            {
                question: 'Produk apa yang digunakan?',
                answer: 'Kami hanya menggunakan produk premium berstandar internasional yang telah terdaftar BPOM dan teruji secara klinis aman untuk kulit sensitif.',
            },
            {
                question: 'Berapa lama durasi perawatan?',
                answer: 'Durasi perawatan bervariasi tergantung paket yang dipilih. Basic 60 menit, Pro 90 menit, dan Premium 120 menit. Detail lengkap ada di halaman layanan.',
            },
            {
                question: 'Apakah ada garansi kepuasan?',
                answer: 'Ya, kami memberikan garansi kepuasan untuk semua layanan. Jika Anda tidak puas dengan hasilnya, kami akan memberikan treatment ulang secara gratis.',
            },
        ],
    },
    gallery: {
        enabled: true,
        title: 'Galeri Lumina',
        subtitle: 'Lihat suasana dan hasil nyata dari perawatan kami.',
        items: [
            { image: '', title: 'Interior Studio', description: 'Suasana nyaman dan elegan' },
            { image: '', title: 'Ruang Perawatan', description: 'Ruangan bersih dan modern' },
            { image: '', title: 'Produk Premium', description: 'Produk berkualitas tinggi' },
            { image: '', title: 'Tim Terapis', description: 'Terapis profesional dan ramah' },
            { image: '', title: 'Area Tunggu', description: 'Ruangan tunggu yang cozy' },
            { image: '', title: 'Hasil Treatment', description: 'Hasil maksimal untuk pelanggan' },
        ],
    },
    cta: {
        enabled: true,
        title: 'Siap Untuk Glowing?',
        subtitle: 'Mulai perjalanan perawatan Anda bersama kami. Dapatkan pengalaman terbaik yang akan membuat Anda merasa lahir kembali.',
        button_text: 'Booking Sekarang',
        button_link: '/booking',
        background_color: '#6B38D4',
        text_color: '#FFFFFF',
    },
    divider: {
        enabled: true,
        style: 'wave',
        height: 60,
    },
    logo_cloud: {
        enabled: true,
        title: 'Dipercaya oleh',
        items: [
            { image: '', name: 'Partner 1' },
            { image: '', name: 'Partner 2' },
            { image: '', name: 'Partner 3' },
            { image: '', name: 'Partner 4' },
            { image: '', name: 'Partner 5' },
        ],
    },
    branches: {
        enabled: true,
        title: 'Cabang Kami',
        subtitle: 'Temukan cabang terdekat untuk pengalaman perawatan terbaik',
    },
    contact: {
        enabled: true,
        title: 'Hubungi Kami',
        subtitle: 'Senang mendengar dari Anda. Hubungi kami melalui kontak di bawah atau datang langsung ke cabang terdekat.',
    },
    footer: {
        copyright_text: '© 2026 Lumina Wellness Clinic. All rights reserved.',
    },
};
