// Her sayfanın Google'da görünen başlığı ve açıklaması. SEO çalışırken buradan düzenle.
// Başlık en fazla ~60, açıklama en fazla ~155 karakter olsun; ikisinde de "Konya" ve "EMS" geçsin.

export const seo: Record<string, { baslik: string; aciklama: string }> = {
  '/': {
    baslik: 'Profit EMS | Konya EMS Stüdyosu – Selçuklu',
    aciklama: "Konya Selçuklu'da EMS stüdyosu. Zayıflama, sıkılaşma, incelme, bel ve boyun ağrıları için EMS. Her gün 10:00–22:00. WhatsApp'tan randevu al.",
  },
};

// Menüde görünen sayfalar. Yeni sayfa bitince buraya eklenir.
export const menu = [
  { href: '/#ems-nedir', etiket: 'EMS nedir?' },
];
