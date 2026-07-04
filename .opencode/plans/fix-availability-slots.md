# Fix Availability Slots — 3 Bugs

## Bug 1: Holiday filter ignored
**File:** `app/Modules/Company/Repositories/HolidayRepository.php`
**Line:** ~31 (setelah `upcoming` filter)
**Fix:** Tambah filter `date`:

```php
if (! empty($filters['date'])) {
    $query->where('date_start', '<=', $filters['date'])
          ->where('date_end', '>=', $filters['date']);
}
```

## Bug 2: getTenantId() crash di public API
**File:** `app/Modules/Booking/Services/AvailabilityService.php`
**Line:** 26-29
**Fix:** Ganti `auth()->user()->tenant_id` → `tenant()->getTenantKey()`

## Bug 3: day_of_week mismatch
**File:** `app/Modules/Booking/Services/AvailabilityService.php`
**Line:** 34
**Fix:** Ganti `date('N')` → `date('w')` (0=Sunday, 6=Saturday — cocok dengan DB)
