# Profit EMS web sitesi — plan

Bu plan üzerinde mutabık kalındı (16 Ekim 2026). Sayfalar bu sırayla, **birer birer** yapılır.

## Her sayfanın akışı

1. Sayfa tasarlanır ve kodlanır (masaüstü + mobil, SEO başlık/açıklaması dahil).
2. Tarayıcıda ve ekran görüntüleriyle kontrol edilir.
3. Kullanıcıya gösterilir; **onay gelmeden bir sonraki sayfaya geçilmez.**
4. Onaydan sonra menüye ve ana sayfaya bağlanır, git'e kaydedilip `yedek-<sayfa>` etiketiyle yedeklenir.

## Sayfalar

| # | Sayfa | Adres | Durum | Gerekenler |
|---|---|---|---|---|
| 0 | Ana sayfa (giriş + EMS nasıl çalışır?) | `/` | ✅ Onaylandı (`yedek-anasayfa-v1`) | — |
| 1 | İletişim | `/iletisim` | ✅ Onaylandı (`yedek-iletisim`) | — |
| 2 | Hizmetler | `/hizmetler` | ✅ Onaylandı (`yedek-hizmetler`) | Seans süresi, haftalık seans, fiyat, ilk geliş süreci gelince "Bir seans nasıl geçer?" bölümü eklenecek |
| 3 | EMS Nedir? (SSS dahil) | `/ems-nedir` | ⏭️ Sırada | Sık sorulan 5–10 soru ve cevapları, kimlerin yapmaması gerektiği (kullanıcı onayıyla) |
| 4 | Hakkımızda ve Ekibimiz | `/hakkimizda` | ⏳ Bekliyor | Hocaların adı, fotoğrafı, uzmanlığı; kısa işletme hikâyesi |
| 5 | Blog | `/blog` | ⏳ Bekliyor | Açılış için 2–3 yazı konusu |
| 6 | KVKK, çerez politikası, 404 | `/kvkk`, `/cerez-politikasi` | ⏳ Bekliyor | KVKK taslağı bir avukat/muhasebeci tarafından kontrol edilmeli |
| 7 | Ana sayfanın kalan bölümleri | `/` | ⏳ Bekliyor | Diğer sayfalar bittikçe her birine giden bölümler eklenir |

## Sayfalara göre içerik

**İletişim** — tek dokunuşla WhatsApp / arama / Instagram; çalışma saatleri ve "şu an açık mı" bilgisi; Google Haritalar ve yol tarifi; TCF belgesi (QR koduyla).

**Hizmetler** — zayıflama, sıkılaşma, incelme, bel-boyun ağrısı; 3D manken ilgili bölgeyi gösterir. İleride her hizmet kendi sayfasına ayrılabilir (`/hizmetler/zayiflama` gibi).

**EMS Nedir?** — nasıl çalışır, bir seansın akışı, kimler yapmamalı, sık sorulan sorular.

**Hakkımızda** — hikâye, hocalar, TCF belgesi.

**Blog** — yayından sonra kullanıcının sürekli yazı ekleyeceği SEO bölümü; yeni yazı = tek metin dosyası.

## Yayından önce

- Domain alınır, `site/.env` içine `SITE_URL` yazılır (sitemap + canonical açılır).
- Gerçek salon fotoğrafları ve videosu stok görsellerin yerine konur.
- Google İşletme Profili sahiplenilir, saatler düzeltilir ("24 saat açık" yanlış), siteye bağlanır.
- Vercel veya Netlify'a yüklenir, Google Search Console'a eklenir.
