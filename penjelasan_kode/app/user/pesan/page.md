# 📝 Penjelasan File: `app/user/pesan/page.tsx`

* **File Asli**: [`app/user/pesan/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/pesan/page.tsx)
* **Kategori**: Halaman Formulir Reservasi & Pembayaran (Booking Checkout View)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Halaman orkestrasi pemesanan lapangan. Halaman ini menggabungkan 4 langkah reservasi menjadi satu alur yang mulus:
1. **Langkah 1**: Memilih lapangan yang ingin disewa (`<PilihLapangan />`).
2. **Langkah 2**: Memilih tanggal bermain, jam mulai, dan durasi bermain (`<PilihJadwal />`).
3. **Langkah 3**: Memilih metode pembayaran QRIS atau Transfer Bank (`<MetodeBayar />`).
4. **Langkah 4 (Selesai)**: Jika reservasi berhasil, tampilan otomatis berganti menampilkan nota bukti pemesanan lengkap (`<BuktiSukses />`).

---

## 🔍 Bedah & Terjemahan Logika Perhitungan Jam & Biaya

```typescript
// Menghitung jam selesai berdasarkan jam mulai dan durasi sewa
const calculateEndTime = (start: string, duration: number) => {
  const [h, m] = start.split(":").map(Number);
  const endH = h + duration;
  return `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const endHour = calculateEndTime(startHour, durationHours);
const totalAmount = selectedLapangan ? selectedLapangan.price * durationHours : 0;
```
* **Contoh Kasus**:
  Jika user memilih jam mulai `08:00` dan durasi `2 Jam`, maka `endHour` otomatis menjadi `10:00 WIB`, dan total biaya otomatis dihitung: `Tarif per Jam × 2 Jam`.

---

### Pengiriman Data ke Backend (`handleSubmitBooking`)
```typescript
const res = await createBookingAction({
  userId: session.user.id,
  userEmail: session.user.email,
  userName: session.user.name || "Member",
  lapanganId: selectedFieldId,
  startTime: startDateTime.toISOString(),
  endTime: endDateTime.toISOString(),
  amount: totalAmount,
  paymentType: paymentType,
});

if (res.success && res.data) {
  setBookingSuccess(res.data as BookingWithRelations); // Tampilkan nota bukti sukses
} else {
  setErrorMessage(res.error); // Tampilkan pesan bentrok atau gagal
}
```
* Mengirimkan data pemesanan ke Server Action [app/user/actions.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/actions.ts). Jika server mengonfirmasi jadwal aman, layar langsung memunculkan nota sukses.
