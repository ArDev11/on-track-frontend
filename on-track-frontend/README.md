# On-Track: kode frontend milik ArDev11 (F-01)

Satu folder per tiket. Isi folder `frontend/` tiap tiket disalin ke `frontend/` di repository, pada cabang tiket masing-masing. Urutannya wajib karena tiket berikutnya memakai berkas tiket sebelumnya.

| Urutan | Issue | Folder | Cabang yang disarankan |
|---|---|---|---|
| 1 | #41 Inisialisasi Next.js 15 & Tipe OpenAPI | `41-inisialisasi-nextjs` | `feature/08-inisialisasi-nextjs` |
| 2 | #46 UI Login & Manajemen Cookie (FR-01) | `46-ui-login-cookie` | `feature/12-ui-login-cookie` |
| 3 | #49 UI Lupa & Reset Kata Sandi (FR-02) | `49-ui-lupa-reset-sandi` | `feature/23-ui-lupa-reset-sandi` |
| 4 | #51 Middleware & Proteksi Rute (FR-04) | `51-middleware-proteksi-rute` | `feature/25-middleware-proteksi-rute` |

Batas WIP di Panduan: maksimal 1-2 kartu In Progress per orang.

## Menjalankan

Di dalam `frontend/` setelah keempat tiket digabung (butuh Node.js 18.18 atau lebih baru):

```bash
npm install
```

```bash
npm run dev
```

## Perlu dicocokkan dengan Backend sebelum PR

Semuanya berkumpul di dua berkas: `src/lib/api/schema.d.ts` dan `src/lib/auth/access.ts`.

- `api/openapi.yaml` belum ada, jadi `schema.d.ts` ditulis manual. Ganti dengan `npm run gen:api` saat kontraknya tersedia.
- Field login `access_token`, field reset `token` dan `new_password`, serta ekstensi error `remaining_attempts` dan `retry_after`.
- Nilai role (`super_admin`, `owner`, `hrd`, `team_lead`, `karyawan`, `kasir`) dan rute tiap area.
- Tautan reset dianggap menuju `/atur-ulang-kata-sandi?token=...`.

## Beda dengan Figma yang disengaja

- Tiga angka di panel hitam (13/16, 1, Rp 118 jt) tidak dibuat, karena belum ada datanya dan Panduan melarang mock data.
- Baris "Untuk akun ..." di layar buat kata sandi baru tidak dibuat, karena tidak ada API untuk membaca email dari token.
- Teks sukses "Permintaan diterima" di lupa kata sandi bukan dari Figma admin; layar konfirmasinya tidak ditemukan di sana.
- Token `--status-warning-bg`, `--status-danger-bg`, dan nilai radius masih perkiraan (ditandai SEMENTARA di `tokens.css`).
