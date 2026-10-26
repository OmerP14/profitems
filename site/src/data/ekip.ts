// Profit EMS'in hocaları. Ekibimiz sayfası buradan beslenir.
// DİKKAT: Aşağıdaki isimler, unvanlar ve metinler ÖRNEKTİR (tasarımı görmek için konuldu).
// Gerçek bilgiler gelince her hocanın satırlarını değiştir. Boş bırakılan alan sayfada görünmez
// (ad boşsa panelde "Yakında" yazar).
//   ad:      'Ad Soyad'
//   unvan:   'EMS antrenörü' gibi
//   tanitim: bir iki cümlelik tanıtım
//   alanlar: ['Zayıflama', 'Sıkılaşma'] gibi çalıştığı hedefler
//   odak:    fotoğrafın kırpılırken ortada kalacak noktası ('50% 30%' = yatayda orta, dikeyde üstten %30)
// Fotoğraf: public/img/ekip/ içine <id>-1200.webp ve <id>-1800.webp (3:4 dikey) olarak konur.
// Şu anki fotoğraflar geçici: Instituto Alpha Fitness, Pexels (pexels.com/@mralpha, Pexels lisansı).

// Hocalar sitede görünsün mü? Gerçek isimler ve fotoğraflar gelene kadar kapalı (false):
// menüde Ekibimiz yok, ana sayfada hoca bölümü yok, asistan hocaları WhatsApp'a yönlendirir.
// Açmak için: aşağıdaki satırı true yap ve src/pages/_ekibimiz.astro dosyasının adını ekibimiz.astro olarak değiştir
// (baştaki alt çizgi sayfayı yayından çıkarır).
export const ekipYayinda = false;

export type Hoca = { id: string; ad: string; unvan: string; tanitim: string; alanlar: string[]; odak: string };

export const ekip: Hoca[] = [
  {
    id: 'hoca-1',
    ad: 'Mert Aksoy',
    unvan: 'Kurucu, EMS antrenörü',
    tanitim: 'Seans boyunca cihazı senin için ayarlar, her hareketi yanında durarak yaptırır.',
    alanlar: ['Zayıflama', 'Sıkılaşma', 'İlk seans'],
    odak: '50% 30%',
  },
  {
    id: 'hoca-2',
    ad: 'Selin Kara',
    unvan: 'EMS antrenörü',
    tanitim: 'Karın ve bel çevresi çalışmalarında hareketleri adım adım gösterir.',
    alanlar: ['İncelme', 'Sıkılaşma'],
    odak: '45% 20%',
  },
  {
    id: 'hoca-3',
    ad: 'Derya Yıldız',
    unvan: 'EMS antrenörü',
    tanitim: 'Sırt ve omuz çevresini güçlendiren çalışmaları planlar ve takip eder.',
    alanlar: ['Bel ve boyun', 'Sıkılaşma'],
    odak: '55% 20%',
  },
];
