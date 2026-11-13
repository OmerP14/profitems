// Profit EMS'in hocaları. Ekibimiz sayfası ve ana sayfadaki hoca bölümü buradan beslenir.
//   ad:       sayfada görünen tam ad
//   kisaAd:   etiketlerde, düğmelerde ve 'X ile randevu al' yazısında kullanılan kısa ad
//   unvan:    'EMS antrenörü' gibi kısa unvan
//   tanitim:  (isteğe bağlı) bir iki cümlelik tanıtım; boş bırakılırsa görünmez
//   bilgiler: eğitim ve belge satırları, sayfada madde madde yazılır
//   belgeler: hocanın belgeleri; ekibimiz sayfasında fotoğraflarla birlikte, tıklayınca büyüyerek açılır
//   odak:     fotoğrafın kırpılırken ortada kalacak noktası ('50% 30%' = yatayda orta, dikeyde üstten %30)
// Fotoğraf: public/img/ekip/<id>.webp (tam boy, 3:4 dikey), <id>-720.webp (küçük) ve <id>-yuz.webp (200x200 belden yukarı kırpma, belge sekmelerinde).
// Belge:    public/img/ekip/belge-<dosya>.webp (tam çözünürlük, QR ve yazılar net okunsun diye küçültülmez)
//           ve belge-<dosya>-800.webp (sayfadaki küçük görünüm).
// Kaynak dosyalar: src/antrenör_bilgi/

// Hocalar sitede görünsün mü? (menüde Ekibimiz, ana sayfada hoca bölümü, asistanın hoca cevabı)
export const ekipYayinda = true;

export type Belge = {
  dosya: string;       // public/img/ekip/belge-<dosya>.webp
  baslik: string;      // belgenin kısa adı
  kurum: string;       // belgeyi veren kurum
  kod?: string;        // belge üzerindeki doğrulama kodu veya belge numarası
  kodEtiket?: string;  // 'Doğrulama kodu' ya da 'Belge no'
  genislik: number;
  yukseklik: number;
};

export type Hoca = {
  id: string; ad: string; kisaAd: string; unvan: string; tanitim?: string;
  bilgiler: string[]; belgeler: Belge[];
  odak: string; fotoGenislik: number; fotoYukseklik: number;
};

export const ekip: Hoca[] = [
  {
    id: 'melisa',
    ad: 'Melisa İlhan',
    kisaAd: 'Melisa',
    unvan: 'EMS antrenörü',
    bilgiler: [
      'Cimnastik Federasyonu – 1. Kademe EMS Sistem Egzersizleri Antrenörlüğü',
      'Cimnastik Federasyonu – 1. Kademe Genel Cimnastik Hareket Eğitimi Antrenörlüğü',
    ],
    belgeler: [
      {
        dosya: 'melisa-1', baslik: '1. Kademe EMS Sistem Egzersizleri', kurum: 'Gençlik ve Spor Bakanlığı · Türkiye Cimnastik Federasyonu',
        kod: '24QADED4', kodEtiket: 'Doğrulama kodu', genislik: 1540, yukseklik: 1021,
      },
      {
        dosya: 'melisa-2', baslik: '1. Kademe Genel Cimnastik Hareket Eğitimi', kurum: 'Gençlik ve Spor Bakanlığı · Türkiye Cimnastik Federasyonu',
        kod: '26UQ207R', kodEtiket: 'Doğrulama kodu', genislik: 1498, yukseklik: 1050,
      },
    ],
    odak: '46% 35%', fotoGenislik: 1086, fotoYukseklik: 1448,
  },
  {
    id: 'sude',
    ad: 'Zeynep Sude İnce',
    kisaAd: 'Sude',
    unvan: 'EMS antrenörü',
    bilgiler: [
      'Spor lisesi',
      'Necmettin Erbakan Üniversitesi – Beden Eğitimi ve Spor Öğretmenliği',
      'Türkiye Basketbol Federasyonu – 1. Kademe Antrenörlük',
      'Probody System Academy – EMS Antrenörlüğü',
      'Belge No: 202301101',
    ],
    belgeler: [
      {
        dosya: 'sude-1', baslik: 'EMS Antrenörlüğü', kurum: 'Probody System Academy',
        kod: '202301101', kodEtiket: 'Belge no', genislik: 1539, yukseklik: 1022,
      },
    ],
    odak: '53% 30%', fotoGenislik: 1086, fotoYukseklik: 1448,
  },
  {
    id: 'nisa',
    ad: 'Nisanur İnce',
    kisaAd: 'Nisa',
    unvan: 'EMS antrenörü',
    bilgiler: [
      'Spor lisesi',
      'Selçuk Üniversitesi – Antrenörlük Eğitimi Bölümü',
      'Hentbol Millî Sporcusu',
      'Probody System Academy – EMS Antrenörlüğü',
      'Belge No: 202301102',
    ],
    belgeler: [
      {
        dosya: 'nisa-1', baslik: 'EMS Antrenörlüğü', kurum: 'Probody System Academy',
        kod: '202301102', kodEtiket: 'Belge no', genislik: 1549, yukseklik: 1015,
      },
    ],
    odak: '47% 38%', fotoGenislik: 1070, fotoYukseklik: 1426,
  },
  {
    id: 'emine',
    ad: 'Emine Feyza Aysel',
    kisaAd: 'Emine',
    unvan: 'EMS antrenörü',
    bilgiler: [
      'Probody System Academy – 1. Kademe EMS Antrenörlüğü',
      'Belge No: 202301103',
    ],
    belgeler: [
      {
        dosya: 'emine-1', baslik: '1. Kademe EMS Antrenörlüğü', kurum: 'Probody System Academy',
        kod: '202301103', kodEtiket: 'Belge no', genislik: 1543, yukseklik: 1019,
      },
    ],
    odak: '44% 42%', fotoGenislik: 1086, fotoYukseklik: 1448,
  },
];

// "dört hoca" gibi cümleler için
export const hocaSayisiYazi = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz'][ekip.length] ?? String(ekip.length);
