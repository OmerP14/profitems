// Her sayfanın Google'da görünen başlığı ve açıklaması. SEO çalışırken buradan düzenle.
// Başlık en fazla ~60, açıklama en fazla ~155 karakter olsun; ikisinde de "Konya" ve "EMS" geçsin.

export const seo: Record<string, { baslik: string; aciklama: string }> = {
  '/': {
    baslik: 'Profit EMS | Konya EMS Stüdyosu – Selçuklu',
    aciklama: "Konya Selçuklu'da EMS stüdyosu. Zayıflama, sıkılaşma, incelme, bel ve boyun ağrıları için EMS. Her gün 10:00–22:00. WhatsApp'tan randevu al.",
  },
  '/hizmetler': {
    baslik: 'Konya EMS Hizmetleri: Zayıflama, Sıkılaşma | Profit EMS',
    aciklama: "Profit EMS'te zayıflama, sıkılaşma, incelme ve bel-boyun ağrıları için EMS antrenmanı. Konya Selçuklu, Avrukon Plaza. WhatsApp'tan bilgi al.",
  },
  '/ems-nedir': {
    baslik: 'EMS Nedir, Nasıl Çalışır? Kimler Yapamaz | Profit EMS Konya',
    aciklama: "EMS nedir, bir seans nasıl geçer, kimler yapmamalı? Konya Selçuklu'daki Profit EMS'ten EMS antrenmanı hakkında sık sorulan soruların cevapları.",
  },
  '/iletisim': {
    baslik: 'İletişim ve Konum | Profit EMS Konya Selçuklu',
    aciklama: "Profit EMS'e WhatsApp, telefon veya Instagram'dan ulaş. Kılınçarslan Mah., Avrukon Plaza, Selçuklu/Konya. Her gün 10:00–22:00 açığız.",
  },
};

// Menüde görünen sayfalar. Yeni sayfa bitince buraya eklenir.
export const menu = [
  { href: '/hizmetler', etiket: 'Hizmetler' },
  { href: '/ems-nedir', etiket: 'EMS nedir?' },
  { href: '/iletisim', etiket: 'İletişim' },
];
