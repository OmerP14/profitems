// "EMS Nedir?" sayfasının metinleri. Soru eklemek ya da cevabı değiştirmek için sadece bu dosyayı düzenle;
// sayfa ve Google'a giden "sık sorulan sorular" bilgisi buradan beslenir.
// Sağlıkla ilgili iddialarda ölçülü kal: tedavi vaadi yok, gerektiğinde doktora yönlendir.

// Bir seansın genel akışı (işletmeye özel süre ve sayı bilgisi gelince güncellenir)
export const seansAkisi = [
  { baslik: 'Randevun SMS ile gelir', metin: "Randevu aldığında seansının günü ve saati telefonuna SMS olarak gelir. Seans günü, randevundan 4 saat önce bir hatırlatma SMS'i daha gönderilir." },
  { baslik: 'Programını planlarız', metin: 'Hedefini konuşur, sana uygun EMS programını birlikte planlarız. Varsa sağlık durumunu da bu aşamada değerlendiririz.' },
  { baslik: 'Kıyafeti giyersin', metin: 'Pedleri taşıyan EMS kıyafeti üstüne oturtulur, pedler büyük kas gruplarının üstüne gelir.' },
  { baslik: 'Cihaz ayarlanır', metin: 'Uyarı düşük başlar ve rahat ettiğin seviyeye kadar yavaş yavaş artırılır.' },
  { baslik: 'Hareket edersin', metin: 'Squat, lunge gibi basit hareketleri eğitmen eşliğinde yaparsın. Kaslar uyarıyla birlikte çalışır.' },
  { baslik: 'Seans biter', metin: 'Kıyafet çıkarılır. Gün içinde bol su içmeni öneririz.' },
];

// EMS'yi kimler yapabilir: işletmenin cümlesi. Değişirse sadece burayı düzenle; SSS, asistan buradan beslenir.
export const kimlerYapabilir = "EMS'yi kalp pili olan kişiler hariç, spor geçmişi olmayanlar da dahil herkes yapabilir.";

export const sss = [
  {
    soru: 'EMS acıtır mı?',
    cevap: 'Acıtmaz. Kaslarında karıncalanma ve güçlü bir kasılma hissedersin. Uyarı düşük başlar, eğitmen seninle konuşarak yavaş yavaş artırır; rahatsız olursan hemen düşürülür.',
  },
  {
    soru: 'Daha önce hiç spor yapmadım, EMS yapabilir miyim?',
    cevap: 'Evet. Seanstaki hareketler squat, lunge gibi basit hareketlerdir ve uyarının şiddeti sana göre ayarlanır.',
  },
  {
    soru: 'EMS tek başına kilo verdirir mi?',
    cevap: 'Hayır. EMS kasları çalıştırır; kilo verme hedefini düzenli antrenman ve dengeli beslenmeyle birlikte destekler.',
  },
  {
    soru: 'Sonuç ne zaman görülür?',
    cevap: 'Kişiden kişiye değişir. Başlangıç seviyen, seanslara ne kadar düzenli geldiğin ve beslenmen sonucu belirler.',
  },
  {
    soru: 'Seanstan sonra kas ağrısı olur mu?',
    cevap: 'İlk seanslardan sonra, normal bir antrenmandan sonraki gibi kas ağrısı olabilir. Kasların alıştıkça azalır.',
  },
  {
    soru: 'Seansa ne giyerim, yanımda ne getirmeliyim?',
    cevap: 'Pedleri taşıyan EMS kıyafetini salonda giyersin. Altına ne giyeceğini ve yanına ne alman gerektiğini randevu alırken söyleriz.',
  },
  {
    soru: 'Bir seans ne kadar sürer, haftada kaç kez gelmeliyim?',
    cevap: 'Seans süresi ve haftalık plan hedefine göre belirlenir. Senin için en uygun planı öğrenmek için WhatsApp\'tan yazabilirsin.',
  },
  {
    soru: 'Bel ya da boyun ağrım var, EMS yapabilir miyim?',
    cevap: 'Sırt, bel ve omuz çevresindeki kasları güçlendirmeye odaklanan çalışmalar yapıyoruz. Ağrın varsa başlamadan önce doktoruna danışmanı öneririz.',
  },
  {
    id: 'kimler', // eski "Kimler yapmamalı?" bağlantıları (/ems-nedir#kimler) bu soruyu açar
    soru: 'EMS herkese uygun mu?',
    cevap: kimlerYapabilir,
  },
  {
    soru: 'Randevumu nasıl hatırlayacağım?',
    cevap: "Randevu aldığında seansının günü ve saati telefonuna SMS olarak gelir. Seans günü, randevundan 4 saat önce bir hatırlatma SMS'i daha gönderilir.",
  },
  {
    soru: 'Fiyatlar ne kadar?',
    cevap: 'Güncel fiyatları WhatsApp\'tan ya da telefonla sorabilirsin.',
  },
];
