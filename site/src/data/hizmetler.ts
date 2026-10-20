// Profit EMS'in hizmetleri. Metinleri buradan düzenle; Hizmetler sayfası ve ana sayfa buradan beslenir.
// Sağlıkla ilgili iddialarda ölçülü kal: tedavi vaadi yok, gerektiğinde doktora yönlendir.
// Fotoğraflar geçici: Instituto Alpha Fitness, Pexels (pexels.com/@mralpha, Pexels lisansı). Gerçek salon fotoğrafları gelince değiştirilecek.

export const hizmetler = [
  {
    id: 'zayiflama',
    bolge: ['zayiflama'],
    ad: 'Zayıflama',
    metin: 'EMS kıyafetindeki pedler karın, bel ve bacaklardaki büyük kas gruplarını aynı anda çalıştırır. Düzenli antrenman ve dengeli beslenmeyle birlikte kilo verme hedefini destekler.',
    bolgeler: 'Karın, bel ve bacaklar',
    gorsel: '/img/hizmetler/ems-zayiflama-1600.webp',
    odak: '50% 45%', // fotoğrafın kırpılırken ortada kalacak noktası
    srcset: '/img/hizmetler/ems-zayiflama-960.webp 960w, /img/hizmetler/ems-zayiflama-1600.webp 1600w, /img/hizmetler/ems-zayiflama-2400.webp 2400w, /img/hizmetler/ems-zayiflama-3600.webp 3600w',
    boyut: [4368, 2912],
    alt: 'EMS kıyafetiyle lunge ve squat hareketi yapan iki kadın',
  },
  {
    id: 'sikilasma',
    bolge: ['sikilasma'],
    ad: 'Sıkılaşma',
    metin: 'Göğüs, kol, kalça ve bacak kasları antrenman boyunca birlikte çalışır. Amaç kasları güçlendirip vücudu daha sıkı ve diri bir görünüme taşımak.',
    bolgeler: 'Göğüs, kollar, kalça ve bacaklar',
    gorsel: '/img/hizmetler/ems-sikilasma-1600.webp',
    odak: '50% 35%', // fotoğrafın kırpılırken ortada kalacak noktası
    srcset: '/img/hizmetler/ems-sikilasma-960.webp 960w, /img/hizmetler/ems-sikilasma-1600.webp 1600w, /img/hizmetler/ems-sikilasma-2400.webp 2400w, /img/hizmetler/ems-sikilasma-3600.webp 3600w',
    boyut: [3686, 2912],
    alt: 'EMS kıyafetli bir kadın bench üzerinde çalışırken antrenörü cihazı tabletten ayarlıyor',
  },
  {
    id: 'incelme',
    bolge: ['incelme'],
    ad: 'İncelme',
    metin: 'Karın ve bel çevresindeki kasları hedefleyen çalışma. İncelme hedefini düzenli antrenman ve beslenmeyle birlikte destekler.',
    bolgeler: 'Karın ve bel çevresi',
    gorsel: '/img/hizmetler/ems-incelme-1600.webp',
    odak: '50% 12%', // fotoğrafın kırpılırken ortada kalacak noktası
    srcset: '/img/hizmetler/ems-incelme-960.webp 960w, /img/hizmetler/ems-incelme-1600.webp 1600w, /img/hizmetler/ems-incelme-2400.webp 2400w, /img/hizmetler/ems-incelme-2912.webp 2912w',
    boyut: [2912, 4368],
    alt: 'Gövdesinde EMS yeleği, elinde halterle duran bir kadın',
  },
  {
    id: 'bel-boyun',
    bolge: ['agri'],
    ad: 'Bel ve boyun ağrıları',
    kisaAd: 'Bel ve boyun',
    metin: 'Sırt, bel ve omuz çevresindeki kasları güçlendirmeye odaklanan çalışma. Ağrın varsa başlamadan önce doktoruna danışmanı öneririz.',
    bolgeler: 'Sırt, bel, omuz ve boyun çevresi',
    gorsel: '/img/hizmetler/ems-bel-boyun-1600.webp',
    odak: '50% 18%', // fotoğrafın kırpılırken ortada kalacak noktası
    srcset: '/img/hizmetler/ems-bel-boyun-960.webp 960w, /img/hizmetler/ems-bel-boyun-1600.webp 1600w, /img/hizmetler/ems-bel-boyun-2400.webp 2400w, /img/hizmetler/ems-bel-boyun-2912.webp 2912w',
    boyut: [2912, 4368],
    alt: 'EMS kıyafetiyle kablo makinesinde sırt çalışan bir kadın',
  },
];
