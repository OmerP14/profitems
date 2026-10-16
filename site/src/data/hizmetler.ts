// Profit EMS'in hizmetleri. Metinleri buradan düzenle; Hizmetler sayfası ve ana sayfa buradan beslenir.
// Sağlıkla ilgili iddialarda ölçülü kal: tedavi vaadi yok, gerektiğinde doktora yönlendir.

export const hizmetler = [
  {
    id: 'zayiflama',
    bolge: ['zayiflama'],
    ad: 'Zayıflama',
    metin: 'EMS kıyafetindeki pedler karın, bel ve bacaklardaki büyük kas gruplarını aynı anda çalıştırır. Düzenli antrenman ve dengeli beslenmeyle birlikte kilo verme hedefini destekler.',
    bolgeler: 'Karın, bel ve bacaklar',
    gorsel: '/img/hizmetler/zayiflama.jpg',
    alt: 'Spor salonunda dambıllarla lunge hareketi yapan bir kadın',
  },
  {
    id: 'sikilasma',
    bolge: ['sikilasma'],
    ad: 'Sıkılaşma',
    metin: 'Göğüs, kol, kalça ve bacak kasları antrenman boyunca birlikte çalışır. Amaç kasları güçlendirip vücudu daha sıkı ve diri bir görünüme taşımak.',
    bolgeler: 'Göğüs, kollar, kalça ve bacaklar',
    gorsel: '/img/hizmetler/sikilasma.jpg',
    alt: 'Dambıllarla omuz press hareketi yapan bir erkek',
  },
  {
    id: 'incelme',
    bolge: ['incelme'],
    ad: 'İncelme',
    metin: 'Karın ve bel çevresindeki kasları hedefleyen çalışma. İncelme hedefini düzenli antrenman ve beslenmeyle birlikte destekler.',
    bolgeler: 'Karın ve bel çevresi',
    gorsel: '/img/hizmetler/incelme.jpg',
    alt: 'Elleri belinde, spor salonunda duran bir kadın',
  },
  {
    id: 'bel-boyun',
    bolge: ['agri'],
    ad: 'Bel ve boyun ağrıları',
    kisaAd: 'Bel ve boyun',
    metin: 'Sırt, bel ve omuz çevresindeki kasları güçlendirmeye odaklanan çalışma. Ağrın varsa başlamadan önce doktoruna danışmanı öneririz.',
    bolgeler: 'Sırt, bel, omuz ve boyun çevresi',
    gorsel: '/img/hizmetler/bel-boyun.jpg',
    alt: 'Öne eğilerek iki dambılı yerden kaldıran bir kadın',
  },
];
