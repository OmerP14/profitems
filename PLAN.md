# Profit EMS web sitesi — plan

Bu plan üzerinde mutabık kalındı (16 Ekim 2026). Sayfalar bu sırayla, **birer birer** yapılır.

## Her sayfanın akışı

1. Sayfa tasarlanır ve kodlanır (masaüstü + mobil, SEO başlık/açıklaması dahil).
2. Tarayıcıda ve ekran görüntüleriyle kontrol edilir.
3. Kullanıcıya gösterilir; **onay gelmeden bir sonraki sayfaya geçilmez.**
4. Onaydan sonra menüye ve ana sayfaya bağlanır, `main` dalına açıklamalı notla kaydedilip `yedek-<sayfa>` etiketiyle yedeklenir ve GitHub'a gönderilir (ayrı dal açılmaz).

## Sayfalar

| # | Sayfa | Adres | Durum | Gerekenler |
|---|---|---|---|---|
| 0 | Ana sayfa (giriş + EMS nasıl çalışır?) | `/` | ✅ Onaylandı (`yedek-anasayfa-v2`: 3D bölüm masaüstünde de sabit sahne) | — |
| 1 | İletişim | `/iletisim` | ✅ Onaylandı (`yedek-iletisim-v2`) | — |
| 2 | Hizmetler | `/hizmetler` | ✅ Onaylandı (`yedek-hizmetler`) | Seans süresi, haftalık seans, fiyat, ilk geliş süreci gelince "Bir seans nasıl geçer?" bölümü eklenecek |
| 3 | EMS Nedir? (SSS dahil) | `/ems-nedir` | ✅ Onaylandı (`yedek-ems-nedir`) | Sık sorulan 5–10 soru ve cevapları, kimlerin yapmaması gerektiği (kullanıcı onayıyla) |
| 4 | Ekibimiz | `/ekibimiz` | ⏸ Gizli (26 Ekim 2026): örnek hocalar yayına çıkmasın diye menüden, ana sayfadan ve sitemap'ten çıkarıldı; açmak için `site/src/data/ekip.ts` başındaki adımlar | 3 hocanın gerçek adı, unvanı, tanıtımı, hedefleri ve 3:4 dikey fotoğrafı; işletme hikâyesi gelirse bölüm olarak eklenir |
| 5 | Blog | `/blog` | ✅ Onaylandı (`yedek-blog`) | 6 açılış yazısı yayında; yeni yazı = `site/src/content/blog/` içine bir `.md` dosyası |
| 6 | KVKK, çerez politikası, 404 | `/kvkk`, `/cerez-politikasi`, 404 | ✅ Yayında, taslak uyarısı kaldırıldı (26 Ekim 2026) | Veri sorumlusunun vergi levhasındaki adı ve KVKK e-postası gelince `site/src/data/yasal.ts`'e yazılır |
| 7 | Ana sayfanın kalan bölümleri | `/` | ✅ Onaylandı (`yedek-site-v1`): kart kart EMS hikâyesi, Dört hedef, Seansını hocan yönetir, EMS üzerine yazılar, Selçuklu'dayız | — |

## Sayfalara göre içerik

**İletişim** — tek dokunuşla WhatsApp / arama / Instagram; çalışma saatleri ve "şu an açık mı" bilgisi; Google Haritalar ve yol tarifi; TCF belgesi (QR koduyla).

**Hizmetler** — zayıflama, sıkılaşma, incelme, bel-boyun ağrısı; 3D manken ilgili bölgeyi gösterir. İleride her hizmet kendi sayfasına ayrılabilir (`/hizmetler/zayiflama` gibi).

**EMS Nedir?** — nasıl çalışır, bir seansın akışı, kimler yapmamalı, sık sorulan sorular.

**Ekibimiz** — hocalar (seçilen hoca öne çıkar), TCF belgesi; hikâye bilgisi gelince eklenir.

**Blog** — yayından sonra kullanıcının sürekli yazı ekleyeceği SEO bölümü; yeni yazı = tek metin dosyası.

## Fotoğraflar gelince (yayından sonra)

- Hocalar: isim, unvan, tanıtım ve 3:4 dikey fotoğraf → `site/src/data/ekip.ts`, ardından Ekibimiz açılır.
- Stüdyo: kapı/giriş + en az 3 salon fotoğrafı → `site/src/data/mekan.ts`, `mekanYayinda = true`.
- Stok görsellerin (giriş videosu, hizmetler, blog, satış bandı) yerine gerçekleri konur.

## Yayın

- ✅ 26 Ekim 2026: Vercel'de yayında (https://profitems.vercel.app), `yedek-yayin-v2`.
- ⏳ profitems.com Vercel projesine eklendi; Squarespace DNS'inde A kaydı Vercel'e çevrilince açılır. `www.profitems.com` da eklenip profitems.com'a yönlendirilecek.
- GitHub bağlantısı (her push'ta otomatik yayın) Vercel panelinden kurulacak: Root Directory = `site`.

## Yayından önce

- ✅ Domain alındı: profitems.com (ayarlara yazıldı; sitemap + canonical açık). Yayında domain Vercel/Netlify'a bağlanır, `www` adresi `profitems.com`'a yönlendirilir.
- Gerçek salon fotoğrafları ve videosu stok görsellerin yerine konur.
- Google İşletme Profili sahiplenilir, saatler düzeltilir ("24 saat açık" yanlış), siteye bağlanır.
- Vercel veya Netlify'a yüklenir, Google Search Console'a eklenir.
