import type { LandingConfig } from '@/features/booking/hooks/useLandingSettings';

export const defaultLandingTemplate: LandingConfig = {
    enabled: true,
    template: 'clean-business',
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
        primary: '#7C3AED',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#FAFAFA',
        text: '#171717',
        text_muted: '#737373',
    },
    hero: {
        enabled: true,
        title: 'Transformasi Gaya Anda Bersama Ahli Kami',
        subtitle: 'Nikmati pengalaman perawatan premium dengan terapis profesional. Hasil maksimal, harga bersahabat.',
        cta_text: 'Booking Sekarang',
        cta_link: '/booking',
        background_type: 'color',
        background_image: null,
        overlay_opacity: 50,
        carousel_items: [],
        carousel_interval: 5000,
    },
    features: {
        enabled: true,
        title: 'Mengapa Memilih Kami',
        subtitle: 'Kami berkomitmen memberikan pelayanan terbaik untuk setiap pelanggan',
        items: [
            {
                icon: 'sparkles',
                title: 'Teknologi Terkini',
                description: 'Menggunakan peralatan dan produk terbaru untuk hasil perawatan yang optimal dan aman.',
            },
            {
                icon: 'shield',
                title: 'Produk Premium',
                description: 'Hanya menggunakan produk berkualitas tinggi yang sudah teruji dan bersertifikasi.',
            },
            {
                icon: 'users',
                title: 'Terapis Profesional',
                description: 'Tim terapis berpengalaman dan tersertifikasi, siap memberikan pelayanan terbaik.',
            },
            {
                icon: 'currency',
                title: 'Harga Terjangkau',
                description: 'Menawarkan paket perawatan berkualitas dengan harga yang kompetitif dan transparan.',
            },
            {
                icon: 'clock',
                title: 'Booking Mudah',
                description: 'Sistem reservasi online yang cepat dan fleksibel, kapanpun dan dimanapun.',
            },
            {
                icon: 'heart',
                title: 'Pelayanan Ramah',
                description: 'Suasana nyaman dan staf yang ramah siap membuat pengalaman Anda berkesan.',
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
        title: 'Layanan Kami',
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
        subtitle: 'Testimoni dari pelanggan setia kami',
        items: [
            {
                name: 'Sari Dewi',
                role: 'Ibu Rumah Tangga',
                content: 'Pelayanannya sangat memuaskan! Terapisnya ramah dan profesional. Hasil perawatannya terlihat setelah 2 kali treatment. Sangat recomended!',
                rating: 5,
            },
            {
                name: 'Andi Pratama',
                role: 'Pengusaha',
                content: 'Tempatnya nyaman, bersih, dan stafnya helpful banget. Sistem booking online-nya memudahkan saya yang sibuk. Langganan tiap bulan!',
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
        subtitle: 'Temukan jawaban untuk pertanyaan yang sering diajukan',
        items: [
            {
                question: 'Bagaimana cara booking?',
                answer: 'Anda bisa booking melalui website kami dengan mengklik tombol "Booking Sekarang". Pilih layanan, staff, dan jadwal yang diinginkan. Konfirmasi akan dikirim ke email Anda.',
            },
            {
                question: 'Apakah bisa reschedule atau cancel?',
                answer: 'Tentu! Anda bisa mereschedule atau membatalkan booking maksimal 24 jam sebelum jadwal. Hubungi kami melalui WhatsApp atau email untuk perubahan jadwal.',
            },
            {
                question: 'Produk apa yang digunakan?',
                answer: 'Kami menggunakan produk-produk premium yang sudah bersertifikasi dan aman untuk semua jenis kulit. Tanyakan ke terapis kami untuk rekomendasi produk yang sesuai.',
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
        title: 'Galeri Kami',
        subtitle: 'Lihat suasana dan hasil perawatan di tempat kami',
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
        title: 'Siap Booking?',
        subtitle: 'Mulai perjalanan perawatan Anda bersama kami. Dapatkan pengalaman terbaik yang akan membuat Anda kembali lagi.',
        button_text: 'Booking Sekarang',
        button_link: '/booking',
        background_color: '#7C3AED',
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
        map_embed_url: '',
    },
    footer: {
        copyright_text: '© 2026 Glow Studio. All rights reserved.',
    },
};
