# Hemora — Icon Library v1.0

Set ikon untuk website Hemora, dibuat mengikuti *Brand Identity & Fundamental* (Mora Group, 2025). Semua ikon berformat **SVG stroke** agar ringan, tajam di segala resolusi, dan warnanya bisa diatur lewat CSS.

---

## 1. Spesifikasi teknis

| Properti | Nilai |
|---|---|
| Format | SVG (vektor, satu file per ikon) |
| Kanvas (viewBox) | `0 0 24 24` |
| Gaya | Line / outline (bukan filled) |
| Ketebalan garis | `stroke-width="1.5"` |
| Ujung & sudut garis | `round` (stroke-linecap & stroke-linejoin) |
| Warna default | `#343F33` (Hemora Deep Green) |
| Jumlah ikon | 39 |

Setiap file sudah rapi: tanpa `<style>`, tanpa ukuran terkunci yang aneh, siap dioptimasi ulang (mis. lewat SVGO) bila perlu.

---

## 2. Struktur folder

```
hemora-icon-library/
├── icons/            → 39 .svg  · Deep Green #343F33  (untuk latar TERANG)
├── icons-gold/       → 39 .svg  · Gold #C6A664        (untuk latar GELAP)
├── icons-light/      → 39 .svg  · Soft Neutral #CFCDC9 (untuk latar GELAP/foto)
├── preview.html                              → galeri versi hijau (latar terang)
├── Hemora_Icon_Library_Preview.pdf           → preview versi hijau
├── Hemora_Icon_Library_Gold-Light_Preview.pdf→ preview versi gold & light (latar gelap)
└── README.md                                 → dokumen ini
```

### Kapan pakai varian mana?

| Varian | Warna | Pakai di atas |
|---|---|---|
| **Green** (`icons/`) | `#343F33` | latar terang: putih, `#CFCDC9` |
| **Gold** (`icons-gold/`) | `#C6A664` | latar gelap sebagai aksen elegan: deep green, dark wood, foto gelap |
| **Light** (`icons-light/`) | `#CFCDC9` | latar gelap saat butuh keterbacaan maksimal; putih (`#FFFFFF`) juga boleh |

> **Catatan:** Gold `#C6A664` adalah **aksen tambahan di luar palet inti** brand guideline, dipilih agar selaras dengan nuansa *quiet elegance*. Bila brand menetapkan gold resmi, cukup ganti nilai `stroke` pada file (atau gunakan `currentColor` + CSS).

---

## 3. Daftar ikon per kategori

**01 · Fasilitas** (14)
`bed` · `pool` · `meeting` · `ballroom` · `dining` · `spa` · `fitness` · `wifi` · `parking` · `room-service` · `bar` · `reception` · `ac` · `laundry`

**02 · Booking & Kontak** (7)
`calendar` · `location` · `phone` · `email` · `clock` · `user` · `key`

**03 · UI & Navigasi** (12)
`menu` · `close` · `search` · `arrow-right` · `arrow-left` · `chevron-down` · `chevron-up` · `star` · `heart` · `check` · `plus` · `globe`

**04 · Brand / Healing** (6)
`hemora-mark` · `pause-time` · `sunrise` · `waterdrop` · `leaf` · `hands`

> `hemora-mark` adalah aksen dekoratif bergaya simbol Hemora. Untuk **logo resmi**, tetap gunakan file logo master dari brand kit, bukan ikon ini.

---

## 4. Cara pakai

### a) Inline SVG (paling fleksibel — warna & ukuran ikut CSS)
Tempel isi file langsung ke HTML. Ganti `stroke="#343F33"` menjadi `stroke="currentColor"` supaya ikon mengikuti warna teks di sekitarnya.

```html
<span class="icon" style="color:#343F33">
  <!-- isi dari icons/spa.svg, stroke diganti currentColor -->
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="1.5"
       stroke-linecap="round" stroke-linejoin="round"> ... </svg>
</span>
```

### b) Sebagai `<img>` (paling simpel)
```html
<img src="/icons/wifi.svg" alt="Wi-Fi" width="24" height="24">
```
Catatan: dengan `<img>`, warna terkunci pada nilai di file (`#343F33`).

### c) Komponen React
```jsx
import { ReactComponent as IconSpa } from "./icons/spa.svg"; // via SVGR
// ...
<IconSpa width={24} height={24} stroke="currentColor" />
```

### d) CSS mask (untuk mewarnai file eksternal)
```css
.icon-bed {
  width: 24px; height: 24px;
  background: #343F33;
  -webkit-mask: url("/icons/bed.svg") center / contain no-repeat;
          mask: url("/icons/bed.svg") center / contain no-repeat;
}
```

---

## 5. Token warna (dari brand guideline)

| Peran | Hex |
|---|---|
| Deep Green (utama) | `#343F33` |
| Soft Neutral | `#CFCDC9` |
| Warm Brown | `#4E3626` |
| Muted Taupe | `#8C857B` |
| Cool Grey | `#9EA2A2` |
| Charcoal | `#494949` |

Panduan cepat:
- **Ikon di atas latar terang** → `#343F33`.
- **Ikon di atas latar gelap/foto** → `#CFCDC9` atau putih.
- **State non-aktif / disabled** → `#9EA2A2`.
- **Aksen hangat (opsional)** → `#4E3626`.

---

## 6. Do & Don't

**Lakukan**
- Jaga ketebalan garis konsisten (`1.5` pada ukuran 24px; naikkan proporsional bila ikon diperbesar).
- Gunakan `currentColor` agar mudah mengganti warna via CSS.
- Beri area kosong (padding) di sekitar ikon minimal ± ukuran garis.

**Hindari**
- Mengubah proporsi (jangan di-stretch non-uniform).
- Mengisi (`fill`) ikon garis ini — dirancang sebagai outline.
- Mencampur ikon ini dengan set ikon lain yang gayanya berbeda.

---

*Hemora by Mora Group · Icon Library v1.0 — 2025.*
