// Stüdyonun (mekânın) fotoğrafları: ana sayfadaki "Stüdyomuz" bölümü ve İletişim'deki kapı fotoğrafı buradan beslenir.
// Gerçek fotoğraflar gelene kadar kapalı (false); kapalıyken iki bölüm de sitede görünmez.
// Açmak için:
//   1. Fotoğrafları public/img/mekan/ içine koy (yatay, en az 2000 px genişlik, .webp ya da .jpg).
//   2. Aşağıdaki src yollarını o dosyalara çevir, alt metinlerini fotoğrafa göre yaz.
//   3. mekanYayinda'yı true yap.
// Şu anki yollar GEÇİCİ stok görseller (yalnızca tasarımı denemek için); yayına bu haliyle açılmaz.
//   odak: fotoğrafın kırpılırken ortada kalacak noktası ('50% 30%' = yatayda orta, dikeyde üstten %30)

export const mekanYayinda = false;

export type MekanFoto = { src: string; alt: string; genislik: number; yukseklik: number; odak: string };

// İletişim sayfasında "Nasıl bulunur?" altında: girişin, kapının fotoğrafı
export const kapi: MekanFoto = {
  src: '/img/blog/ems-yelek.jpg',
  alt: "Profit EMS'in girişi, Kafem'in giriş kapısının karşısında",
  genislik: 2000, yukseklik: 1500, odak: '50% 40%',
};

// Ana sayfada "Stüdyomuz": ilki büyük, sonraki ikisi yanında küçük
export const galeri: MekanFoto[] = [
  { src: '/img/blog/ems-ilk-seans.jpg', alt: "Profit EMS'in antrenman alanı", genislik: 2000, yukseklik: 1500, odak: '50% 40%' },
  { src: '/img/blog/ems-zayiflama.jpg', alt: 'Stüdyodaki EMS cihazı ve kıyafetleri', genislik: 2000, yukseklik: 1500, odak: '50% 40%' },
  { src: '/img/blog/ems-bel-boyun.jpg', alt: 'Stüdyonun bekleme ve soyunma alanı', genislik: 2000, yukseklik: 1500, odak: '50% 30%' },
];
