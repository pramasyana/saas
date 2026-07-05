# Fitur Booking System

Daftar fitur yang sudah diimplementasikan, cara penggunaannya, dan cara testing.

---

## Daftar Isi

1. [Staff-Service Mapping](#1-staff-service-mapping)
2. [Room/Resource Booking](#2-roomresource-booking)
3. [Group/Class Booking](#3-groupclass-booking)
4. [Recurring Appointments](#4-recurring-appointments)
5. [Pengaturan Dinamis (Settings)](#5-pengaturan-dinamis-settings)

---

## 1. Staff-Service Mapping

**Fungsi:** Menentukan layanan mana saja yang bisa ditangani oleh seorang staff.

### Cara Pakai

1. Buka **Staff** → klik **Edit** pada staff yang diinginkan
2. Scroll ke bawah ke section **Layanan yang Ditangani**
3. Centang layanan yang relevan
4. Opsional: centang **Utama** untuk layanan utama staff tersebut
5. Klik **Simpan Layanan**

### Efek

- Saat customer booking online, hanya staff yang memiliki mapping layanan tersebut yang muncul sebagai opsi
- Jika suatu layanan belum punya mapping staff sama sekali, **semua** staff akan tetap muncul (backward compatible)

### API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/v1/staff/{id}/services` | Ambil layanan yang dimapping ke staff |
| PUT | `/api/v1/staff/{id}/services` | Simpan mapping layanan |

### File Terkait

- `database/migrations/2026_07_20_000001_create_staff_service_table.php`
- `app/Modules/Staff/Models/Staff.php` — method `services()`
- `app/Modules/Service/Models/Service.php` — method `staff()`
- `app/Modules/Staff/Http/Controllers/Api/StaffServiceController.php`
- `app/Modules/Booking/Services/AvailabilityService.php` — filter staff by service
- `resources/js/features/staff/hooks/useStaffServices.ts`
- `resources/js/features/staff/components/StaffServiceMapping.tsx`
- `resources/js/pages/tenant/staff/Edit.tsx` — integration

---

## 2. Room/Resource Booking

**Fungsi:** Kelola ruangan/resource, assign ke layanan, dan cek ketersediaan ruangan di kalender.

### Cara Pakai

**Setup:**
1. Buka sidebar **Perusahaan** → **Ruangan**
2. Klik **Tambah Ruangan** — isi nama, kapasitas, warna, cabang
3. Buka **Layanan** → edit layanan → pilih **Ruangan** default (opsional)

**Saat Booking:**
- Ruangan bisa dipilih saat membuat booking (via form atau walk-in)
- Jika layanan punya room default, ruangan akan otomatis terisi

### Cek Ketersediaan

Endpoint `/api/v1/booking/availability` secara otomatis mengecek tumpang tindih ruangan. Jika waktu yang dipilih sudah ada booking untuk ruangan tersebut, sistem akan menampilkan ruangan lain yang tersedia.

### API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/v1/booking/rooms` | List ruangan (paginated) |
| GET | `/api/v1/booking/rooms/all` | Semua ruangan aktif |
| GET | `/api/v1/booking/rooms/{id}` | Detail ruangan |
| POST | `/api/v1/booking/rooms` | Tambah ruangan |
| PUT | `/api/v1/booking/rooms/{id}` | Update ruangan |
| DELETE | `/api/v1/booking/rooms/{id}` | Hapus ruangan |

### File Terkait

- `database/migrations/2026_07_20_000002_create_rooms_table.php`
- `database/migrations/2026_07_20_000003_add_room_id_to_services.php`
- `database/migrations/2026_07_20_000004_create_booking_rooms_table.php`
- `app/Modules/Booking/Models/Room.php`
- `app/Modules/Booking/Models/BookingRoom.php`
- `app/Modules/Booking/Contracts/RoomRepositoryInterface.php`
- `app/Modules/Booking/Repositories/RoomRepository.php`
- `app/Modules/Booking/Http/Controllers/Api/RoomController.php`
- `app/Modules/Booking/Http/Resources/RoomResource.php`
- `app/Modules/Booking/Http/Requests/StoreRoomRequest.php`
- `app/Modules/Booking/Http/Requests/UpdateRoomRequest.php`
- `app/Modules/Booking/Services/AvailabilityService.php` — method `getAvailableRooms()`
- `app/Modules/Booking/Http/Requests/StoreBookingRequest.php` — validasi `rooms.*`
- `app/Modules/Booking/Actions/CreateBookingAction.php` — attach rooms
- `app/Modules/Service/Models/Service.php` — method `room()`
- `resources/js/features/rooms/types.ts`
- `resources/js/features/rooms/hooks/useRooms.ts`
- `resources/js/features/rooms/components/RoomForm.tsx`
- `resources/js/pages/tenant/company/Rooms.tsx`
- `resources/js/pages/tenant/company/RoomCreate.tsx`
- `resources/js/pages/tenant/company/RoomEdit.tsx`
- `resources/js/layouts/TenantLayout.tsx` — sidebar

---

## 3. Group/Class Booking

**Fungsi:** Booking yang bisa diikuti oleh banyak peserta (misal: kelas yoga, workshop).

### Cara Pakai

**Saat membuat booking:**
1. Aktifkan toggle **Group Booking**
2. Set **Maksimal Peserta** (misal: 20)
3. Tambah daftar **Peserta** (nama, no telepon, email, catatan)
4. Simpan booking

**Di kalender:**
- Booking group ditandai dengan ikon/badge berbeda
- Jumlah peserta terdaftar / maksimal ditampilkan
- Status tiap peserta: `registered`, `attended`, `cancelled`

### API

Data peserta dikirim bersama data booking:

```json
{
  "start_time": "2026-07-20 09:00:00",
  "end_time": "2026-07-20 10:00:00",
  "customer_id": "uuid",
  "is_group": true,
  "max_participants": 20,
  "participants": [
    { "name": "Budi", "phone": "0812...", "email": "budi@..." },
    { "name": "Ani", "phone": "0813...", "email": "ani@..." }
  ]
}
```

### File Terkait

- `database/migrations/2026_07_20_000005_add_group_fields_to_bookings.php`
- `database/migrations/2026_07_20_000006_create_booking_participants_table.php`
- `app/Modules/Booking/Models/BookingParticipant.php`
- `app/Modules/Booking/Models/Booking.php` — method `participants()`, casts `is_group`, `max_participants`
- `app/Modules/Booking/Http/Resources/BookingResource.php` — include participants
- `app/Modules/Booking/Http/Requests/StoreBookingRequest.php` — validasi participants
- `app/Modules/Booking/Actions/CreateBookingAction.php` — create participants

---

## 4. Recurring Appointments

**Fungsi:** Booking berulang otomatis (setiap hari, minggu, bulan).

### Cara Pakai

**Saat membuat booking:**
1. Isi data booking seperti biasa (customer, staff, waktu, layanan)
2. Di bagian **Berulang**, aktifkan toggle
3. Pilih **Frekuensi**: Harian / Mingguan / Bulanan
4. Atur **Interval**: setiap berapa kali (misal: setiap 2 minggu)
5. Tentukan **Akhir**: setelah N kali / sampai tanggal tertentu / tidak pernah
6. Simpan

**Proses Generate Otomatis:**
- Command `booking:generate-recurring` berjalan setiap menit via scheduler
- Command cek setting `recurring.enabled` — jika nonaktif, skip
- Command cek setting `recurring.generate_at` — hanya jalan di jam tersebut
- Booking baru akan digenerate dengan status `pending`

### API

Data recurring dikirim bersama data booking:

```json
{
  "start_time": "2026-07-20 09:00:00",
  "end_time": "2026-07-20 10:00:00",
  "customer_id": "uuid",
  "recurring": {
    "frequency": "weekly",
    "interval": 1,
    "end_type": "after_count",
    "count": 10
  }
}
```

### Command

```bash
# Manual generate (untuk test):
php artisan booking:generate-recurring
```

### Scheduler

Terdaftar di `routes/console.php` — jalan setiap menit, tapi command sendiri yang memutuskan apakah perlu generate berdasarkan settings.

### File Terkait

- `database/migrations/2026_07_20_000007_create_booking_recurring_templates_table.php`
- `database/migrations/2026_07_20_000008_add_recurring_template_id_to_bookings.php`
- `app/Modules/Booking/Models/BookingRecurringTemplate.php`
- `app/Modules/Booking/Console/GenerateRecurringBookingsCommand.php`
- `app/Modules/Booking/Actions/CreateBookingAction.php` — create template
- `routes/console.php` — scheduler

---

## 5. Pengaturan Dinamis (Settings)

**Fungsi:** Semua nilai hardcode sebelumnya sekarang bisa diubah dari UI tanpa perlu utak-atik kode.

### Halaman Settings

Buka sidebar **Perusahaan** → **Pengaturan**, atau langsung ke `/company/settings`.

Ada 3 tab:

#### Tab Booking

| Setting | Key | Default | Fungsi |
|---------|-----|---------|--------|
| Interval Slot (menit) | `booking.slot_interval` | `30` | Jarak antar slot waktu di kalender (semakin kecil, makin banyak slot) |
| Prefiks Kode Booking | `booking.code_prefix` | `BK-` | Huruf depan kode booking otomatis (contoh: `BK-20260720-001`) |
| Sumber Booking | `booking.sources` | `online, walk_in, recurring` | Sumber booking yang valid (dipisah koma) |

#### Tab Ruangan

| Setting | Key | Default | Fungsi |
|---------|-----|---------|--------|
| Warna Default Ruangan | `room.default_color` | `#7C3AED` | Warna default untuk ruangan baru |

#### Tab Berulang

| Setting | Key | Default | Fungsi |
|---------|-----|---------|--------|
| Generate Berulang | `recurring.enabled` | `true` | Aktif/nonaktif generate booking berulang |
| Jam Generate | `recurring.generate_at` | `03:00` | Jam berapa generate berjalan (format 24 jam) |
| Interval Generate | `recurring.generate_interval` | `1` | Generate setiap N hari sekali |

### Cara Settings Bekerja

1. User ubah nilai di UI `/company/settings`
2. `PUT /api/v1/settings` — kirim array `[{ key, value, type, group }]`
3. `TenantSettingService::set()` — simpan ke table `tenant_settings`, flush cache
4. Backend panggil `TenantSettingService::get(key, default)` untuk baca nilai
5. Ada cache per-tenant (3600 detik), auto-flush pas update

### API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/v1/settings` | Semua settings tenant |
| GET | `/api/v1/settings/group/{group}` | Settings per group |
| PUT | `/api/v1/settings` | Update settings (bulk) |

### File Terkait

- `database/migrations/2026_07_20_000010_create_tenant_settings_table.php`
- `app/Modules/Setting/Models/TenantSetting.php`
- `app/Modules/Setting/Services/TenantSettingService.php`
- `app/Modules/Setting/Providers/SettingServiceProvider.php`
- `app/Modules/Setting/Http/Controllers/Api/TenantSettingController.php`
- `app/Modules/Setting/Http/Controllers/SettingController.php`
- `routes/api/v1/tenant/setting.php`
- `resources/js/features/settings/hooks/useSettings.ts`
- `resources/js/features/settings/components/SettingsForm.tsx`
- `resources/js/pages/tenant/settings/Index.tsx`
- `app/Modules/Setting/Database/Seeders/TenantSettingSeeder.php`
- `database/seeders/DatabaseSeeder.php`

---

## Testing

### 1. Staff-Service Mapping

```bash
# Login sebagai tenant
# Buka /staff -> Edit staff -> cek section "Layanan yang Ditangani"
# Centang beberapa layanan -> Simpan
# Buka booking online -> pilih layanan yang di-centang -> staff yang sesuai muncul
```

### 2. Room/Resource Booking

```bash
# Buka /company/rooms -> Tambah Ruangan
# Buka /service/services -> Edit layanan -> assign room_id
# Buka booking -> creates booking with room -> cek BookingResource.rooms
```

### 3. Group/Class Booking

```bash
# Buka booking -> create -> aktifkan is_group -> set max_participants
# Tambah peserta -> Simpan
# Cek detail booking -> daftar peserta muncul
```

### 4. Recurring

```bash
# Buat booking dengan recurring data
# Cek table booking_recurring_templates -> template tersimpan
# Jalankan: php artisan booking:generate-recurring
# Cek table bookings -> booking baru tergenerate
# Matikan setting recurring.enabled = false di /company/settings
# Jalankan lagi -> command skip
```

### 5. Settings

```bash
# Buka /company/settings
# Ubah "Interval Slot" jadi 60 -> Simpan
# Buka booking calendar -> slot interval berubah jadi 60 menit
# Ubah "Prefiks Kode Booking" jadi "INV-" -> Simpan
# Buat booking baru -> kode booking jadi "INV-20260720-001"
# Cek API: curl /api/v1/settings -> return semua settings
```
