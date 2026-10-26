// Sitedeki asistanın bildikleri. Asistan tarayıcıda çalışır, yazılanları hiçbir yere göndermez;
// yalnızca buradaki cevapları verir, bilmediği soruyu WhatsApp'a yönlendirir.
// Cevaplar sitenin veri dosyalarından beslenir (isletme, sss, hizmetler); oralar değişince asistan da güncellenir.
// Yeni konu eklemek için `konular` listesine bir satır ekle:
//   anahtar: sorunun içinde geçebilecek kelimeler (Türkçe karakterli ya da karaktersiz fark etmez; kelimenin başı yeter: "fiyat" → "fiyatı", "fiyatlar")
//   cevap:   verilecek cevap (bağlantı için <a href="...">...</a> yazılabilir)
//   oneriler: cevabın altında gösterilecek hazır sorular

import { isletme, tamAdres, whatsappLinki, yolTarifiLinki } from './isletme';
import { sss, engeller, seansAkisi } from './sss';
import { hizmetler } from './hizmetler';
import { ekipYayinda } from './ekip';

// an FAQ answer carries its question, so a reply like "Hayır." still reads on its own
const sssCevap = (baslangic: string) => {
  const s = sss.find(x => x.soru.startsWith(baslangic));
  return s ? `<strong>${s.soru}</strong> ${s.cevap}` : '';
};
const hizmet = (id: string) => hizmetler.find(h => h.id === id)!;
const wa = (mesaj: string, etiket = "WhatsApp'tan yaz") => `<a href="${whatsappLinki(mesaj)}" target="_blank" rel="noopener">${etiket}</a>`;
const hizmetCevap = (id: string) => {
  const h = hizmet(id);
  return `<strong>${h.ad}:</strong> ${h.metin} Çalışan bölgeler: ${h.bolgeler.toLocaleLowerCase('tr')}. <a href="/hizmetler#${h.id}">Ayrıntılar</a>`;
};

export type Konu = { id: string; anahtar: string[]; cevap: string; oneriler?: string[] };

export const konular: Konu[] = [
  {
    id: 'selam',
    anahtar: ['merhaba', 'selam', 'slm', 'mrb', 'iyi gunler', 'iyi aksamlar', 'gunaydin', 'hey'],
    cevap: 'Merhaba! EMS, hizmetlerimiz, saatlerimiz ya da randevu hakkında ne sormak istersin?',
    oneriler: ['EMS nedir?', 'Fiyatlar ne kadar?', 'Neredesiniz?'],
  },
  {
    id: 'yer',
    anahtar: ['nerede', 'nerde', 'neresi', 'adres', 'konum', 'yol tarif', 'harita', 'nasil gel', 'nasil gid', 'semt', 'avrukon', 'sefikcan', 'selcuklu'],
    cevap: `${tamAdres}. ${isletme.adres.tarif}. <a href="${yolTarifiLinki}" target="_blank" rel="noopener">Yol tarifi al</a>`,
    oneriler: ['Saatleriniz?', 'Randevu almak istiyorum'],
  },
  {
    id: 'saat',
    anahtar: ['saat', 'acik', 'kapali', 'kacta', 'kaca kadar', 'mesai', 'hafta sonu', 'pazar', 'cumartesi', 'bugun', 'aksam', 'sabah'],
    cevap: `${isletme.saatler.metin} açığız. {durum}`,
    oneriler: ['Randevu almak istiyorum', 'Neredesiniz?'],
  },
  {
    id: 'iletisim',
    anahtar: ['telefon', 'numara', 'ara', 'iletisim', 'whatsapp', 'instagram', 'ulas', 'mail', 'e-posta', 'eposta'],
    cevap: `Telefon: <a href="tel:${isletme.telefonUluslararasi}">${isletme.telefon}</a>. ${wa('Merhaba, bilgi almak istiyorum.')} ya da Instagram'dan <a href="${isletme.instagram}" target="_blank" rel="noopener">${isletme.instagramKullanici}</a> hesabına mesaj atabilirsin.`,
    oneriler: ['Randevu almak istiyorum', 'Saatleriniz?'],
  },
  {
    id: 'randevu',
    anahtar: ['randevu', 'kayit', 'kaydol', 'baslamak', 'basla', 'gelmek istiyorum', 'deneme', 'uye', 'rezervasyon'],
    cevap: `Randevu için WhatsApp'tan yazman ya da <a href="tel:${isletme.telefonUluslararasi}">${isletme.telefon}</a> numarasını araman yeterli. Yazarken hedefini ve varsa sağlık sorununu belirt. ${wa('Merhaba, randevu almak istiyorum.', "WhatsApp'ı aç")}`,
    oneriler: ['İlk seansta ne olur?', 'Kimler yapamaz?'],
  },
  {
    id: 'sms',
    anahtar: ['sms', 'mesaj gel', 'hatirlat', 'unutur', 'unutmam', 'randevumu unut', 'randevuyu unut', 'bildirim', 'haber ver'],
    cevap: sssCevap('Randevumu nasıl'),
    oneriler: ['Randevu almak istiyorum', 'İlk seansta ne olur?'],
  },
  {
    id: 'fiyat',
    anahtar: ['fiyat', 'ucret', 'kac para', 'kac tl', 'para', 'paket', 'kampanya', 'indirim', 'pahali', 'tutar', 'odeme'],
    cevap: `${sssCevap('Fiyatlar')} ${wa('Merhaba, EMS fiyatlarını öğrenmek istiyorum.', 'Fiyat sor')}`,
    oneriler: ['Bir seans ne kadar sürer?', 'Randevu almak istiyorum'],
  },
  {
    id: 'belge',
    anahtar: ['belge', 'sertifika', 'tcf', 'federasyon', 'guvenilir', 'lisans', 'yetki', 'ruhsat'],
    cevap: 'Evet, Profit EMS Türkiye Cimnastik Federasyonu yeterlilik belgesine sahip bir tesis. Belgedeki QR kodu okutarak kendin doğrulayabilirsin. <a href="/iletisim#belge-baslik">Belgeyi gör</a>',
    oneriler: ['Hocalarınız kim?', 'EMS nedir?'],
  },
  {
    id: 'ems',
    anahtar: ['ems nedir', 'ems ne', 'nasil calisir', 'nasil isliyor', 'elektrik', 'uyari', 'kas uyarimi', 'nedir', 'ne ise yarar', 'mantigi'],
    cevap: 'EMS, elektriksel kas uyarımı demek. Kıyafetteki pedler kaslarına hafif bir uyarı gönderir; sen squat gibi basit hareketler yaparken kasların daha yoğun çalışır. <a href="/ems-nedir">EMS nedir?</a>',
    oneriler: ['EMS acıtır mı?', 'Kimler yapamaz?', 'İlk seansta ne olur?'],
  },
  {
    id: 'acitir',
    anahtar: ['aciti', 'acir mi', 'aci', 'can yakar', 'canim yanar', 'agrili mi', 'rahatsiz', 'carpar', 'tehlikeli', 'zararli', 'guvenli'],
    cevap: sssCevap('EMS acıtır'),
    oneriler: ['Kimler yapamaz?', 'Seanstan sonra kas ağrısı olur mu?'],
  },
  {
    id: 'engel',
    anahtar: ['kimler', 'yapamaz', 'yapmamali', 'hamile', 'gebe', 'kalp', 'pil', 'epilepsi', 'sara', 'ameliyat', 'kanser', 'tromboz', 'damar', 'ates', 'hastalik', 'saglik sorun', 'ilac', 'tansiyon', 'seker', 'diyabet', 'emzir'],
    cevap: `Şu durumlardan biri varsa doktor onayı olmadan EMS'e başlanmaz: ${engeller.map(e => e.charAt(0).toLocaleLowerCase('tr') + e.slice(1)).join('; ')}. Listede olmayan bir sağlık durumun varsa randevu almadan önce bize ve doktoruna danış. <a href="/ems-nedir#kimler">EMS herkese uygun mu?</a>`,
    oneriler: ['Randevu almak istiyorum', 'EMS acıtır mı?'],
  },
  {
    id: 'yeni',
    anahtar: ['hic spor', 'spor yapmadim', 'yeni basl', 'acemi', 'kondisyon', 'yasli', 'yas sinir', 'kac yas', 'fit degil', 'kilolu'],
    cevap: sssCevap('Daha önce hiç spor'),
    oneriler: ['İlk seansta ne olur?', 'EMS acıtır mı?'],
  },
  {
    id: 'zayiflama',
    anahtar: ['zayifla', 'kilo', 'yag yak', 'kalori', 'verdirir', 'zayiflatir', 'diyet', 'beslenme'],
    cevap: `${sssCevap('EMS tek başına kilo')} ${hizmetCevap('zayiflama')}`,
    oneriler: ['Sonuç ne zaman görülür?', 'Fiyatlar ne kadar?'],
  },
  {
    id: 'sikilasma',
    anahtar: ['sikilas', 'sikilastir', 'toparla', 'diri', 'sarkma', 'kalca', 'gogus'],
    cevap: hizmetCevap('sikilasma'),
    oneriler: ['Sonuç ne zaman görülür?', 'Randevu almak istiyorum'],
  },
  {
    id: 'kas',
    anahtar: ['kas gelis', 'kas yap', 'kas kazan', 'kas kutle', 'kaslan', 'hacim', 'guclen', 'kuvvet', 'kol', 'biceps', 'pazi'],
    cevap: hizmetCevap('kas-gelistirme'),
    oneriler: ['Sonuç ne zaman görülür?', 'Randevu almak istiyorum'],
  },
  {
    id: 'incelme',
    anahtar: ['incel', 'bel incel', 'gobek', 'karin', 'bolgesel', 'basen', 'selulit'],
    cevap: hizmetCevap('incelme'),
    oneriler: ['EMS tek başına kilo verdirir mi?', 'Fiyatlar ne kadar?'],
  },
  {
    id: 'belboyun',
    anahtar: ['bel agri', 'belim', 'agriyor', 'boyun', 'sirt', 'omuz', 'fitik', 'durus', 'kambur', 'belim agri', 'boynum'],
    cevap: `${sssCevap('Bel ya da boyun')} ${hizmetCevap('bel-boyun')}`,
    oneriler: ['Kimler yapamaz?', 'Randevu almak istiyorum'],
  },
  {
    id: 'sonuc',
    anahtar: ['sonuc', 'ne zaman', 'kac seans', 'kac haftada', 'fark', 'etki', 'kalici'],
    cevap: sssCevap('Sonuç ne zaman'),
    oneriler: ['Bir seans ne kadar sürer?', 'Randevu almak istiyorum'],
  },
  {
    id: 'kasagrisi',
    anahtar: ['kas agri', 'seanstan sonra', 'ertesi gun', 'tutulma', 'sonrasinda', 'seans sonrasi'],
    cevap: sssCevap('Seanstan sonra'),
    oneriler: ['EMS acıtır mı?', 'Ne giymeliyim?'],
  },
  {
    id: 'kiyafet',
    anahtar: ['giym', 'giyin', 'giyec', 'giyil', 'kiyafet', 'getir', 'yanimda', 'havlu', 'ayakkabi', 'tayt', 'ic camasir', 'dus', 'soyunma'],
    cevap: sssCevap('Seansa ne giyerim'),
    oneriler: ['İlk seansta ne olur?', 'Randevu almak istiyorum'],
  },
  {
    id: 'sure',
    anahtar: ['sure', 'kac dakika', 'ne kadar surer', 'haftada', 'kac kez', 'kac gun', 'siklik', 'her gun', 'dakika'],
    cevap: sssCevap('Bir seans ne kadar'),
    oneriler: ['Fiyatlar ne kadar?', 'İlk seansta ne olur?'],
  },
  {
    id: 'seans',
    anahtar: ['ilk seans', 'seansta ne', 'seans nasil', 'nasil gecer', 'ne yapiyoruz', 'hareket', 'antrenman nasil', 'ilk gun'],
    cevap: `Bir seans şöyle geçer: ${seansAkisi.map(a => `<strong>${a.baslik}.</strong> ${a.metin}`).join(' ')} <a href="/ems-nedir#seans">Bir seans nasıl geçer?</a>`,
    oneriler: ['Ne giymeliyim?', 'EMS acıtır mı?'],
  },
  {
    id: 'hoca',
    anahtar: ['hoca', 'egitmen', 'antrenor', 'ekip', 'kimler var', 'personel', 'kadin hoca', 'erkek hoca', 'trainer'],
    cevap: `Seanslarını hocalarımız yönetir; cihazı senin için ayarlar ve hareketleri yanında durarak yaptırırlar.${ekipYayinda ? ' <a href="/ekibimiz">Ekibimizi tanı</a>' : ` ${wa('Merhaba, hocalarınız hakkında bilgi almak istiyorum.', 'Hocalarımızı sor')}`}`,
    oneriler: ['Randevu almak istiyorum', 'İlk seansta ne olur?'],
  },
  {
    id: 'hizmetler',
    anahtar: ['hizmet', 'neler var', 'ne yapiyorsunuz', 'program', 'hedef'],
    cevap: `Beş hedef için EMS antrenmanı yapıyoruz: ${hizmetler.map(h => `<a href="/hizmetler#${h.id}">${h.ad}</a>`).join(', ')}.`,
    oneriler: ['Zayıflama', 'Bel ve boyun ağrısı', 'Fiyatlar ne kadar?'],
  },
  {
    id: 'gizlilik',
    anahtar: ['kvkk', 'gizlilik', 'kisisel veri', 'verilerim', 'cerez', 'kayit tutuyor', 'gonderiliyor'],
    cevap: 'Bu asistan tamamen tarayıcında çalışır; yazdıkların hiçbir yere gönderilmez ve kaydedilmez. Ayrıntılar: <a href="/kvkk">KVKK aydınlatma metni</a>, <a href="/cerez-politikasi">çerez politikası</a>.',
  },
  {
    id: 'tesekkur',
    anahtar: ['tesekkur', 'sagol', 'sag ol', 'eyvallah', 'tamam', 'anladim', 'super', 'harika', 'gorusuruz', 'iyi gunler dilerim'],
    cevap: 'Rica ederim! Başka bir sorun olursa buradayım. Randevu için WhatsApp her zaman açık.',
    oneriler: ['Randevu almak istiyorum'],
  },
];

export const baslangicOnerileri = ['EMS nedir?', 'Fiyatlar ne kadar?', 'Kimler yapamaz?', 'Neredesiniz?', 'Randevu almak istiyorum'];

export const bilinmiyor = 'Bunu kesin bilmiyorum, yanlış bilgi vermek istemem. Sorunu WhatsApp\'tan hocalarımıza sorabilirsin:';
