// Profit EMS'in bütün iletişim bilgileri burada. Bir şey değişirse sadece bu dosyayı düzenle;
// menü, sayfa altı, asistan ve Google'a giden işletme bilgisi buradan beslenir.

export const isletme = {
  ad: 'Profit EMS',
  telefon: '0536 661 39 93',
  telefonUluslararasi: '+905366613993',
  whatsapp: '905366613993',
  instagram: 'https://www.instagram.com/pro.fit.ems/',
  instagramKullanici: '@pro.fit.ems',
  adres: {
    sokak: 'Kılınçarslan Mah., Urfa Sk., Şefik Can Cd. No:9C',
    ilce: 'Selçuklu',
    il: 'Konya',
    postaKodu: '42080',
    kisa: 'Şefik Can Cd. No:9C', // ana sayfada büyük yazılan kısa adres
    tarif: 'Kafem giriş kapısının karşısı',
  },
  saatler: {
    metin: 'Her gün 10:00–22:00',
    acilis: '10:00',
    kapanis: '22:00',
  },
  sertifika: 'Türkiye Cimnastik Federasyonu yeterlilik belgeli tesis',
};

export const tamAdres = `${isletme.adres.sokak}, ${isletme.adres.postaKodu} ${isletme.adres.ilce}/${isletme.adres.il}`;

export const haritaLinki = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${isletme.ad}, ${tamAdres}`)}`;

export const whatsappLinki = (mesaj = 'Merhaba, Profit EMS hakkında bilgi almak istiyorum.') =>
  `https://wa.me/${isletme.whatsapp}?text=${encodeURIComponent(mesaj)}`;

export const yolTarifiLinki = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${isletme.ad}, ${tamAdres}`)}`;

export const haritaGomme = `https://www.google.com/maps?q=${encodeURIComponent(`${isletme.ad}, ${tamAdres}`)}&output=embed`;
